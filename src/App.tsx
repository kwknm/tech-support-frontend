import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import moment from "moment/min/moment-with-locales";

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

moment.locale("ru");

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
