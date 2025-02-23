import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import {
  Badge,
  Button,
  Chip,
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

const convertNotificationTypeToTag = (type: string) => {
  switch (type) {
    case "new-message":
      return (
        <Chip color="primary" size="sm" variant="flat">
          Чат
        </Chip>
      );
    case "ticket-status-change":
      return (
        <Chip color="secondary" size="sm" variant="flat">
          Заявка
        </Chip>
      );
    default:
      return <Chip>Другое</Chip>;
  }
};

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
    console.log(notificationType);
    switch (notificationType) {
      case "new-message":
        return () => {
          navigate(`/tickets/${meta?.resourceId}/chat`);
        };
      case "ticket-status-change":
        return () => {
          navigate(`/tickets/${meta?.resourceId}`);
        };
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

      connection.on(
        "ReceiveNotification",
        (
          id: string,
          isRead: boolean,
          recipientId: string,
          type: string,
          title: string,
          body: string,
          timestamp: Date,
          metadata: Metadata,
        ) => {
          const newNotif: Notification = {
            id,
            isRead,
            recipientId,
            title,
            type,
            body,
            timestamp,
            metadata,
          };

          setNotifications((prevState) => [newNotif, ...prevState]);
        },
      );

      return () => {
        connection.stop();
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
        className={"w-[500px]"}
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
                  startContent={convertNotificationTypeToTag(n.type)}
                  textValue={n.title}
                  onPress={mapNotificationBehavior(n.type, n.metadata)}
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
                onPress={(_) =>
                  navigate(`/tickets/${n.metadata?.resourceId}/chat`)
                }
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
