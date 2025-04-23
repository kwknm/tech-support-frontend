import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment/min/moment-with-locales";
import { Spinner } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { AxiosError } from "axios";

import IndexPage from "@/pages/index";
import LoginPage from "@/pages/login.tsx";
import TicketsPage from "@/pages/tickets";
import RegisterPage from "@/pages/register.tsx";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import AuthGuard from "@/AuthGuard.tsx";
import NotFound from "@/pages/not-found.tsx";
import TicketDetailsPage from "@/pages/tickets/details.tsx";
import ChatPage from "@/pages/chat.tsx";
import DefaultLayout from "@/layouts/default.tsx";
import FaqPage from "@/pages/faq.tsx";

moment.locale("ru");

function App() {
  const { checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth()
      .then((_) => setIsLoading(false))
      .catch((err: AxiosError<{ message?: string }>) =>
        addToast({
          title: "Произошла ошибка при авторизации",
          description:
            err.response?.data.message || `${err.code} ${err.message}`,
          color: "danger",
        }),
      );
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen dark:bg-blend-darken">
        <Spinner />
      </div>
    );
  }

  return (
    <DefaultLayout>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route
          element={
            <AuthGuard>
              <TicketsPage />
            </AuthGuard>
          }
          path="/tickets"
        />
        <Route
          element={
            <AuthGuard>
              <TicketDetailsPage />
            </AuthGuard>
          }
          path="/tickets/:id"
        />
        <Route
          element={
            <AuthGuard>
              <ChatPage />
            </AuthGuard>
          }
          path="/tickets/:id/chat"
        />
        <Route element={<FaqPage />} path="/faq" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
