export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Служба технической поддержки",
  description: "Служба технической поддержки пользователей.",
  api_url: import.meta.env.VITE_API_URL,
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
