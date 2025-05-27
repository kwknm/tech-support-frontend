export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Служба технической поддержки",
  description: "Служба технической поддержки пользователей.",
  api_url:
    process.env.NODE_ENV === "development"
      ? import.meta.env.VITE_DEV_API_URL
      : import.meta.env.VITE_PROD_API_URL,
  navItems: [
    {
      label: "Заявки",
      href: "/tickets",
    },
    {
      label: "FAQ",
      href: "/faq",
    },
  ],
  links: {
    login: "/login",
    register: "/register",
  },
};
