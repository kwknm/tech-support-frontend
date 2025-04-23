import { Form, Input, Button } from "@heroui/react";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link as HeroUILink } from "@heroui/react";
import { addToast } from "@heroui/toast";

import { title } from "@/components/primitives";
import { siteConfig } from "@/config/site.ts";
import { Axios } from "@/api/api-provider.ts";
import { useAuthStore } from "@/hooks/use-auth-store.ts";

export default function LoginPage() {
  const navigate = useNavigate();
  const { checkAuth, isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const response = await Axios.post("/api/identity/login", { ...data });
      const accessToken = response.data.access_token;

      localStorage.setItem("token", accessToken);
      await checkAuth();
      addToast({
        title: "Успешный вход!",
        color: "success",
      });
    } catch (err: any) {
      addToast({
        title: "Ошибка",
        description: err.response.data?.message,
        color: "danger",
      });
    }
  }

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Вход в аккаунт</h1>
        </div>
      </section>
      <main>
        <Form
          className="w-full justify-center items-center space-y-4"
          validationBehavior="native"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-4 w-1/3">
            <Input
              isRequired
              label="Почта"
              labelPlacement="outside"
              name="email"
              placeholder="example@email.com"
              type="email"
              variant="bordered"
            />

            <Input
              isRequired
              label="Пароль"
              labelPlacement="outside"
              name="password"
              placeholder="Пароль"
              type="password"
              variant="bordered"
            />

            <div className="flex gap-4">
              <Button
                className="w-full"
                color="secondary"
                type="submit"
                variant="flat"
              >
                Войти
              </Button>
            </div>

            <div className="flex gap-4 justify-end mt-2">
              <HeroUILink as={Link} to={siteConfig.links.register}>
                <span className="text-default-500">Нет аккаунта?</span>&nbsp;
                <p className="underline">Регистрация</p>
              </HeroUILink>
            </div>
          </div>
        </Form>
      </main>
    </>
  );
}
