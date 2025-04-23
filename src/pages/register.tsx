import { Form, Input, Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { Link as HeroUILink } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { addToast } from "@heroui/toast";
import React, { useEffect } from "react";

import { title } from "@/components/primitives";
import { siteConfig } from "@/config/site.ts";
import { Axios } from "@/api/api-provider.ts";
import { useAuthStore } from "@/hooks/use-auth-store.ts";

export default function RegisterPage() {
  const { checkAuth, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const response = await Axios.post("/api/identity/register", data);

      localStorage.setItem("token", response.data.access_token);
      await checkAuth();
      addToast({
        title: "Успешная регистрация!",
        description: "Теперь вы можете создать заявку",
        color: "success",
      });
    } catch (err: any) {
      addToast({
        title: "Ошибка",
        description: err.response.data?.errors.join(", "),
        color: "danger",
      });
      console.error(err);
    }
  }

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Создание аккаунта</h1>
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
              label="Имя"
              labelPlacement="outside"
              name="firstname"
              placeholder="Ваше имя"
              type="text"
              variant="bordered"
            />
            <Input
              isRequired
              label="Фамилия"
              labelPlacement="outside"
              name="lastname"
              placeholder="Ваша фамилия"
              type="text"
              variant="bordered"
            />
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

            <Input
              isRequired
              label="Подтверждение пароля"
              labelPlacement="outside"
              name="passwordConfirm"
              placeholder="Подтверждение пароля"
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
                Зарегистрироваться
              </Button>
            </div>

            <div className="flex gap-4 justify-end mt-2">
              <HeroUILink as={Link} to={siteConfig.links.login}>
                <span className="text-default-500">Уже есть аккаунт?</span>
                &nbsp;
                <p className="underline">Войти</p>
              </HeroUILink>
            </div>
          </div>
        </Form>
      </main>
    </>
  );
}
