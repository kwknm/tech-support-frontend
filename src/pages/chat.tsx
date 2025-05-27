import { Button, Form, Spinner, Textarea, Tooltip } from "@heroui/react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import { Alert } from "@heroui/alert";
import { AxiosError } from "axios";
import { addToast } from "@heroui/toast";

import { PlaneIcon } from "@/components/icons.tsx";
import TicketHeader from "@/components/tickets/ticket-header.tsx";
import { Ticket, MessageType } from "@/types";
import { Axios } from "@/api/api-provider.ts";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import { siteConfig } from "@/config/site.ts";
import TabSwitch from "@/components/tickets/tab-switch.tsx";
import MessageList from "@/components/tickets/chat/message-list.tsx";
import UploadFileInput from "@/components/tickets/chat/upload-file-input.tsx";

const scrollToChatBottom = () =>
  document.getElementById("scroll")?.scrollIntoView({
    behavior: "smooth",
  });

const ChatPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messagesIsLoading, setMessagesIsLoading] = useState<boolean>(true);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);

  const { data, isLoading, error } = useSWR<Ticket>(`/api/tickets/${id}`);

  useEffect(() => {
    Axios.get(`/api/tickets/${id}/messages`).then((response) => {
      setMessages(
        response.data.map((x: any) => ({
          ...x,
          firstName: x.user.firstName,
          lastName: x.user.lastName,
        })),
      );
      setMessagesIsLoading(false);
    });

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${siteConfig.api_url}/hubs/chat`, {
        accessTokenFactory(): string | Promise<string> {
          return localStorage.getItem("token") ?? "";
        },
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection && data?.chatId) {
      connection
        .start()
        .then(() => {
          console.log("SignalR Chat Connected");
          connection.send("JoinChat", data.chatId).then(() => {
            console.log("Joined chat");
          });
        })
        .catch((error) => {
          console.error("Ошибка при подключении к SignalR:", error);
        });

      connection.on("ReceiveMessage", (response: MessageType) => {
        setMessages((prevMessages) => [...prevMessages, response]);
        scrollToChatBottom();
      });

      connection.on("ReceiveSystemMessage", (content) => {
        console.log(content);
      });

      return () => {
        connection.off("ReceiveMessage");
      };
    }
  }, [connection, data]);

  const sendMessage = async (e: any) => {
    e.preventDefault();

    setIsSendingMessage(true);
    setErrorMessage(null);

    const form = Object.fromEntries(new FormData(e.currentTarget));

    if (!(form.content as string).trim()) {
      setErrorMessage("Сообщение не может быть пустым");
      e.target.reset();

      return;
    }

    let attachmentId = null;

    if (currentFile) {
      try {
        const response = await Axios.post("/api/attachments", form, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });

        attachmentId = response.data?.attachmentId ?? null;
        setCurrentFile(undefined);
      } catch (err) {
        if (err instanceof AxiosError) {
          addToast({
            title: "Произошла ошибка",
            color: "danger",
            description: err.response?.data.message,
          });
        }

        return;
      } finally {
        setIsSendingMessage(false);
      }
    }

    e.target.reset();
    if (connection) {
      await connection.invoke(
        "SendMessage",
        data?.chatId,
        form.content,
        attachmentId,
      );
      setIsSendingMessage(false);
    } else {
      console.error("connection is not presented");
    }
  };

  if (error)
    return (
      <Alert
        color="danger"
        title={`Запись не найдена. Попробуйте позже [${error.message}]`}
      />
    );

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner variant="dots" />
      </div>
    );

  return (
    <>
      <TicketHeader
        id={data!.id}
        issuer={data!.issuer}
        status={data!.status}
        title={data!.title}
      />
      <TabSwitch
        currentTab={"chat"}
        isDisabled={
          (user?.id != data?.issuerId && user?.id != data?.supportId) ||
          !data?.supportId
        }
        ticketId={data?.id!}
      />
      <section className="flex flex-col items-center my-1">
        <MessageList
          isLoading={messagesIsLoading}
          isTicketClosed={data?.isClosed!}
          issuer={data?.issuer!}
          messages={messages}
          support={data?.support!}
        />
        <Form
          ref={formRef}
          className="flex flex-row gap-1 mt-3"
          onSubmit={sendMessage}
        >
          <UploadFileInput
            currentFile={currentFile}
            isDisabled={data?.isClosed!}
            isLoading={messagesIsLoading}
            setCurrentFile={setCurrentFile}
          />
          <Tooltip
            closeDelay={0}
            content={"ENTER – новая строка, Ctrl + ENTER – отправить сообщение"}
          >
            <div>
              <Textarea
                isRequired
                className="w-[250px] md:w-[450px]"
                description={currentFile?.name}
                errorMessage={errorMessage}
                isDisabled={data?.isClosed}
                maxRows={3}
                minRows={1}
                name="content"
                placeholder="Сообщение"
                variant="bordered"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
              />
            </div>
          </Tooltip>
          <Tooltip closeDelay={0} content="Отправить сообщение">
            <Button
              isIconOnly
              color="default"
              isDisabled={data?.isClosed}
              type="submit"
              variant="bordered"
            >
              {isSendingMessage ? (
                <Spinner size="sm" variant="gradient" />
              ) : (
                <PlaneIcon />
              )}
            </Button>
          </Tooltip>
        </Form>
      </section>
    </>
  );
};

export default ChatPage;
