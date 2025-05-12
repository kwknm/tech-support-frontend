import { useAuthStore } from "@/hooks/use-auth-store.ts";
import TicketsUserView from "@/components/tickets/views/user-view.tsx";
import TicketsSupportView from "@/components/tickets/views/support-view.tsx";

export default function TicketsPage() {
  const { isSupport } = useAuthStore();

  return isSupport ? <TicketsSupportView /> : <TicketsUserView />;
}
