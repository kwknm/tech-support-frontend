import { Chip } from "@heroui/react";

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
}