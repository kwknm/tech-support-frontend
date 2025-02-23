import { Link } from "react-router-dom";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Button,
} from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { User, Chip } from "@heroui/react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { ExitIcon, TicketIconLogo } from "@/components/icons";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import Notifications from "@/components/notifications.tsx";

export const Navbar = () => {
  const { isLoggedIn, user, isSupport, checkAuth } = useAuthStore();

  const logoutAction = async () => {
    localStorage.removeItem("token");
    await checkAuth();
  };

  return (
    <HeroUINavbar isBordered maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            to="/"
          >
            <TicketIconLogo />
            <p className="font-bold text-inherit">Tech.Support</p>
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                to={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {isLoggedIn ? (
          <NavbarItem className="hidden md:flex items-center gap-5">
            <User
              description={
                isSupport && (
                  <span>
                    Вы вошли под аккаунтом{" "}
                    <Chip color={"success"} size={"sm"} variant={"flat"}>
                      Поддержки
                    </Chip>
                  </span>
                )
              }
              name={`${user?.firstName} ${user?.lastName}`}
            />
            <Notifications />
            <Button
              color={"warning"}
              size={"sm"}
              startContent={<ExitIcon />}
              variant="flat"
              onPress={logoutAction}
            >
              Выйти
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem className="hidden md:flex">
            <Button
              as={Link}
              color={"secondary"}
              to={siteConfig.links.login}
              variant="flat"
            >
              Войти
            </Button>
          </NavbarItem>
        )}
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
    </HeroUINavbar>
  );
};
