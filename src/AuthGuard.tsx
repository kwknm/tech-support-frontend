import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

import { useAuthStore } from "@/hooks/use-auth-store.ts";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn && !localStorage.getItem("token")) {
    return <Navigate replace to={"/login"} />;
  }

  return <>{children}</>;
}
