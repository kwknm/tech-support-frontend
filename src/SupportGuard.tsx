import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { addToast } from "@heroui/toast";

import { useAuthStore } from "@/hooks/use-auth-store.ts";

export default function SupportGuard({ children }: { children: ReactNode }) {
  const { isSupport } = useAuthStore();

  if (!isSupport) {
    addToast({ title: "Недостаточно прав", color: "danger" });

    return <Navigate replace to={"/"} />;
  }

  return <>{children}</>;
}
