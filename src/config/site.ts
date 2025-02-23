export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Служба технической поддержки",
  description: "Служба технической поддержки пользователей.",
  api_url: "https://localhost:7110",
  navItems: [
    {
      label: "Заявки",
      href: "/tickets",
    },
  ],
  links: {
    login: "/login",
    register: "/register",
  },
};
