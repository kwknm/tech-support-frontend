import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/hooks/use-auth-store.ts";

// @ts-ignore
function AuthGuard(props) {
  const { children } = props;

  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn && !localStorage.getItem("token")) {
    return <Navigate replace to={"/login"} />;
  }

  return <>{children}</>;
}

export default AuthGuard;
