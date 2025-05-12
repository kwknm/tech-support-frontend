import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import moment from "moment/min/moment-with-locales";

import { BellIcon } from "@/components/icons.tsx";
import { Axios } from "@/api/api-provider.ts";
import { Metadata, Notification } from "@/types";
import { convertNotificationTypeToTag } from "@/lib/utils.tsx";

export default function Notifications() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  const fetchNotifications = () => {
    Axios.get(`/api/notifications`)
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((err) => console.error(err));
  };

  const mapNotificationBehavior = (
    notificationType: string,
    meta?: Metadata,
  ) => {
    switch (notificationType) {
      case "new-message":
        return navigate(`/tickets/${meta?.resourceId}/chat`);
      case "ticket-status-change":
        return navigate(`/tickets/${meta?.resourceId}`);
    }
  };

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5174/hubs/notifications", {
        accessTokenFactory(): string | Promise<string> {
          return localStorage.getItem("token") ?? "";
        },
      })
      .withAutomaticReconnect()
      .build();

    fetchNotifications();
    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start().then(() => {
        console.log("SignalR Notifications Connected");
      });

      connection.on("ReceiveNotification", (response: Notification) => {
        setNotifications((prevState) => [response, ...prevState]);
      });

      return () => {
        connection.off("ReceiveNotification");
      };
    }
  }, [connection]);

  const getNumberOfUnreadNotifications = () => {
    return notifications.filter((x) => !x.isRead).length;
  };

  const readAllNotifications = async () => {
    try {
      await Axios.post("/api/notifications/read");
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const getUnreadNotifications = () => notifications.filter((x) => !x.isRead);
  const getStaleNotifications = () => notifications.filter((x) => x.isRead);

  return (
    <Dropdown onClose={readAllNotifications}>
      <DropdownTrigger>
        <Button isIconOnly variant="light">
          <Badge
            color="danger"
            content={getNumberOfUnreadNotifications()}
            isInvisible={!getNumberOfUnreadNotifications()}
          >
            <BellIcon />
          </Badge>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Уведомления"
        className={
          "w-[500px] max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full"
        }
        disabledKeys={["empty"]}
        variant="faded"
      >
        <>
          {getUnreadNotifications().length != 0 && (
            <DropdownSection title="Непрочитанные">
              {getUnreadNotifications().map((n) => (
                <DropdownItem
                  key={n.id}
                  classNames={{
                    title: "line-clamp-3 text-pretty whitespace-pre-wrap",
                    description: "line-clamp-2 text-pretty whitespace-pre-wrap",
                  }}
                  description={n.body}
                  endContent={
                    <p className="text-xs text-nowrap">
                      {moment(n.timestamp).fromNow()}
                    </p>
                  }
                  startContent={convertNotificationTypeToTag(n.type)}
                  textValue={n.title}
                  onPress={() => mapNotificationBehavior(n.type, n.metadata)}
                >
                  {n.title}
                </DropdownItem>
              ))}
            </DropdownSection>
          )}
        </>
        <DropdownSection title="Уведомления">
          <>
            {notifications.length == 0 && (
              <DropdownItem
                key="empty"
                className="font-light"
                title="Уведомлений нет."
              />
            )}
          </>
          <>
            {getStaleNotifications().map((n) => (
              <DropdownItem
                key={n.id}
                classNames={{
                  title: "line-clamp-3 text-pretty whitespace-pre-wrap",
                  description: "line-clamp-2 text-pretty whitespace-pre-wrap",
                }}
                description={n.body}
                endContent={
                  <p className="text-xs text-nowrap">
                    {moment(n.timestamp).fromNow()}
                  </p>
                }
                startContent={convertNotificationTypeToTag(n.type)}
                textValue={n.title}
                onPress={(_) => mapNotificationBehavior(n.type, n.metadata)}
              >
                {n.title}
              </DropdownItem>
            ))}
          </>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
