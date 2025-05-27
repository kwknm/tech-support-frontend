import { Alert } from "@heroui/alert";
import { Avatar, Chip, Spinner, Tooltip } from "@heroui/react";
import { MessageSquareTextIcon } from "lucide-react";

import { Message } from "@/components/tickets/chat/message.tsx";
import { MessageType, User } from "@/types";
import { useAuthStore } from "@/hooks/use-auth-store.ts";

type Props = {
  isLoading: boolean;
  isTicketClosed: boolean;
  messages: MessageType[];
  issuer: User;
  support: User;
};

export default function MessageList({
  isLoading,
  isTicketClosed,
  messages,
  issuer,
  support,
}: Props) {
  const { isSupport, user } = useAuthStore();

  return (
    <div className="flex flex-col items-center border-2 p-3 rounded-lg bg-default-50 dark:bg-transparent dark:border-content2">
      <div className="bg-white dark:bg-content2 dark:border-content3 border-2 rounded-lg p-3 flex flex-row justify-between w-full items-center shadow-2xl z-10">
        <div>
          <h2 className="font-semibold text-2xl text-default-700 manrope">
            Обсуждение
          </h2>
          <span className="text-default-500 text-sm gap-1 mt-1 flex">
            <Chip
              avatar={<Avatar name={issuer.firstName[0]} />}
              size="sm"
              variant="flat"
            >
              {issuer.firstName} {issuer.lastName}
            </Chip>
            <Chip
              avatar={<Avatar name={support.firstName[0]} />}
              size="sm"
              variant="flat"
            >
              {support.firstName} {support.lastName}
            </Chip>
          </span>
        </div>
        <Tooltip closeDelay={0} content="Количество сообщений в чате">
          <span className="text-sm text-gray-500 flex item-center gap-1.5 dark:text-default-600">
            <MessageSquareTextIcon />
            {messages.length}
          </span>
        </Tooltip>
      </div>
      <div className="flex flex-col items-center pt-1">
        {isTicketClosed && (
          <Alert
            className="my-3"
            color="primary"
            title={
              <p>
                Чат недоступен, так как заявка была закрыта.{<br />} Вы
                по-прежнему можете просматривать историю сообщений.
              </p>
            }
            variant="flat"
          />
        )}
        {!messages.length && !isTicketClosed && !isLoading && (
          <Alert
            isClosable
            className="my-3"
            color="primary"
            title={`Используйте этот чат для связи с ${isSupport ? "пользователем" : "сотрудником поддержки"}`}
            variant="flat"
          />
        )}
        <ul
          className="gap-1.5 flex flex-col overflow-y-auto h-[60vh] w-[85vw] md:w-[35vw] [&::-webkit-scrollbar]:w-2
                      [&::-webkit-scrollbar-track]:bg-gray-100
                      [&::-webkit-scrollbar-thumb]:bg-gray-300
                      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                       [&::-webkit-scrollbar-track]:rounded-full
                       [&::-webkit-scrollbar-thumb]:rounded-full pr-2"
        >
          {isLoading ? (
            <div className="h-[100%] flex justify-center items-center">
              <Spinner label="Загружаем сообщения..." />
            </div>
          ) : (
            messages.map((m, idx) => (
              <Message
                key={m.content + idx}
                attachment={m.attachment}
                content={m.content}
                firstName={m.firstName}
                isSupport={m.isSupport}
                isUsersMessage={m.userId === user?.id}
                lastName={m.lastName}
                timestamp={m.timestamp}
              />
            ))
          )}

          <div id="scroll" />
        </ul>
      </div>
    </div>
  );
}
