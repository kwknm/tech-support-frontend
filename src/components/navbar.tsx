import { Link } from "react-router-dom";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Button,
  NavbarMenu,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { User, Chip } from "@heroui/react";
import { FileChartColumnIcon, LogInIcon, LogOutIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { TicketIconLogo } from "@/components/icons";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import Notifications from "@/components/notifications.tsx";

export const Navbar = () => {
  const { isLoggedIn, user, isSupport, checkAuth } = useAuthStore();

  const logoutAction = async () => {
    localStorage.removeItem("token");
    await checkAuth();
  };

  const NavbarAuthStuff = () => {
    return isLoggedIn ? (
      <NavbarItem className="hidden md:flex items-center gap-5">
        <Dropdown placement="bottom-end" shouldBlockScroll={false}>
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                name: `${user?.firstName[0]}${user?.lastName[0]}`,
              }}
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
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownSection title={`Аккаунт ${user?.email}`}>
              <>
                {!user?.isSupport && (
                  <DropdownItem
                    key="greeting"
                    isReadOnly
                    className={clsx("cursor-default")}
                    variant="light"
                  >
                    Добро пожаловать
                  </DropdownItem>
                )}
              </>
              <>
                {user?.isSupport && (
                  <DropdownItem
                    key="report"
                    className={clsx("text-primary")}
                    description="Подробная статистика"
                    href="/report"
                    startContent={<FileChartColumnIcon size={18} />}
                    variant="bordered"
                  >
                    Мой отчёт
                  </DropdownItem>
                )}
              </>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>

        <Notifications />
        <Button
          color={"warning"}
          size={"sm"}
          startContent={<LogOutIcon size={18} />}
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
          startContent={<LogInIcon size={20} />}
          to={siteConfig.links.login}
          variant="flat"
        >
          Войти
        </Button>
      </NavbarItem>
    );
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
                  "data-[active=true]:text-primary data-[active=true]:font-medium hover:underline underline-offset-4   hover:text-primary",
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
        <NavbarAuthStuff />
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
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
      </NavbarMenu>
    </HeroUINavbar>
  );
};
