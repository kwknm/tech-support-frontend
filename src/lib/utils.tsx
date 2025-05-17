import { Chip } from "@heroui/react";
import moment from "moment/min/moment-with-locales";

export const convertStatusToTag = (
  status: number | undefined,
  size: "sm" | "md" | "lg" | undefined = "md",
  radius: "sm" | "md" | "lg" | undefined = "md",
) => {
  switch (status) {
    case 0:
      return (
        <Chip color="default" radius={radius} size={size} variant="flat">
          Открыта
        </Chip>
      );
    case 1:
      return (
        <Chip color="primary" radius={radius} size={size} variant="flat">
          Обрабатывается
        </Chip>
      );
    case 2:
      return (
        <Chip color="success" radius={radius} size={size} variant="flat">
          Решена
        </Chip>
      );
    case 3:
      return (
        <Chip color="danger" radius={radius} size={size} variant="flat">
          Отклонена
        </Chip>
      );
    default:
      return (
        <Chip color="default" radius={radius} size={size} variant="flat">
          Неизвестен
        </Chip>
      );
  }
};

export const convertNotificationTypeToTag = (type: string) => {
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

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 B";

  const k = 1024; // 1 KB = 1024 Bytes
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const getStatusDict = () => {
  return [
    { key: "all", label: "Все" },
    { key: "0", label: "Открыта" },
    { key: "1", label: "Обрабатывается" },
    { key: "2", label: "Решена" },
    { key: "3", label: "Отклонена" },
  ];
};

export const convertStatusToString = (status: number) => {
  const dict: Record<string, string> = {
    3: "Отклонена",
    2: "Решена",
    1: "Обрабатывается",
    0: "Открыта",
  };

  return dict[status];
};

export const formatShortTime = (ms: number) => {
  const duration = moment.duration(ms, "milliseconds");

  return `${Math.floor(duration.asHours())} ч. ${duration.minutes()} мин.`;
};
