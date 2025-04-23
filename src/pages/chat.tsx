import {
  Button,
  Divider,
  Form,
  Spinner,
  Textarea,
  Tooltip,
} from "@heroui/react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import { Link } from "react-router-dom";
import { Alert } from "@heroui/alert";
import { AxiosError } from "axios";
import { addToast } from "@heroui/toast";

import { ExternalIcon, PaperClipIcon, PlaneIcon } from "@/components/icons.tsx";
import { Message } from "@/components/message.tsx";
import TicketHeader from "@/components/tickets/ticket-header.tsx";
import { Ticket, MessageType } from "@/types";
import { Axios } from "@/api/api-provider.ts";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import { siteConfig } from "@/config/site.ts";

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

    if ((form.attachment as File).size != 0) {
      try {
        const response = await Axios.post("/api/attachments", form, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });

        attachmentId = response.data?.attachmentId ?? null;
      } catch (err) {
        if (err instanceof AxiosError) {
          addToast({
            title: "Произошла ошибка",
            color: "danger",
            description: err.response?.data.message,
          });
        }

        setIsSendingMessage(false);

        return;
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

  if (isLoading || messagesIsLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
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
      <Button
        as={Link}
        className="mt-5"
        startContent={<ExternalIcon />}
        to={`/tickets/${id}`}
        variant="shadow"
      >
        К заявке
      </Button>
      <section className="flex flex-col items-center my-5">
        <h2 className="text-light text-3xl text-gray-700 mb-4 dark:text-gray-200 decoration-dashed">
          Обсуждение
        </h2>
        <Divider className="mb-2" />
        <div className="flex flex-col items-center h-[calc(95vh/2)]">
          {data?.isClosed && (
            <Alert
              className="my-3"
              color="primary"
              title={
                <>
                  Чат недоступен, так как заявка была закрыта.{<br />} Вы
                  по-прежнему можете просматривать историю сообщений.
                </>
              }
              variant="flat"
            />
          )}
          {!messages?.length && !data?.isClosed && (
            <Alert
              isClosable
              className="mb-1"
              color="primary"
              title={`Используйте этот чат для связи с ${user?.isSupport ? "пользователем" : "сотрудником поддержки"}`}
              variant="flat"
            />
          )}
          <ul
            className="space-y-2 h-[500px] overflow-y-auto w-[600px] mb-5 [&::-webkit-scrollbar]:w-2
                      [&::-webkit-scrollbar-track]:bg-gray-100
                      [&::-webkit-scrollbar-thumb]:bg-gray-300
                      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                       [&::-webkit-scrollbar-track]:rounded-full
                       [&::-webkit-scrollbar-thumb]:rounded-full pr-2"
          >
            {messages?.map((m, idx) => (
              <Message
                key={m.content + idx}
                attachment={m.attachment}
                content={m.content}
                firstName={m.firstName}
                isSupport={m.isSupport}
                isUsersMessage={m.userId == user?.id}
                lastName={m.lastName}
                timestamp={m.timestamp}
              />
            ))}
            <div id="scroll" />
          </ul>
        </div>
        <Form className="flex flex-row gap-1" onSubmit={sendMessage}>
          <Tooltip content="Добавить вложение">
            <Button
              isIconOnly
              color="default"
              isDisabled={data?.isClosed}
              isLoading={messagesIsLoading}
              variant="bordered"
              onPress={() => document.getElementById("attachment")?.click()}
            >
              <PaperClipIcon />
            </Button>
          </Tooltip>
          <input
            className="hidden"
            id="attachment"
            name="attachment"
            type="file"
          />
          <Textarea
            isRequired
            className="w-[450px]"
            errorMessage={errorMessage}
            isDisabled={data?.isClosed}
            isInvalid={!!errorMessage}
            maxRows={3}
            minRows={1}
            name="content"
            placeholder="Сообщение"
            variant="bordered"
          />
          <Tooltip content="Отправить сообщение">
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
