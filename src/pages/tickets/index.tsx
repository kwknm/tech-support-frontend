import { Chip } from "@heroui/chip";

import { useAuthStore } from "@/hooks/use-auth-store.ts";
import TicketsUserView from "@/components/tickets/views/user-view.tsx";
import TicketsSupportView from "@/components/tickets/views/support-view.tsx";

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

export default function TicketsPage() {
  const { isSupport } = useAuthStore();

  return isSupport ? <TicketsSupportView /> : <TicketsUserView />;
}
