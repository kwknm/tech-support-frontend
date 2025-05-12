import { Link, Tab, Tabs } from "@heroui/react";
import { MessageSquareIcon, ScrollTextIcon } from "lucide-react";
import React from "react";

interface TabSwitchProps {
  currentTab: "details" | "chat";
  isDisabled: boolean;
  ticketId: number;
}

const TabContent = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType;
  text: string;
}) => (
  <div className="flex items-center space-x-2">
    <Icon />
    <span>{text}</span>
  </div>
);

export default function TabSwitch({
  currentTab,
  isDisabled,
  ticketId,
}: TabSwitchProps) {
  const commonTabsProps: {
    ariaLabel: string;
    isDisabled: boolean;
    color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | undefined;
  } = {
    ariaLabel: "Options",
    color: "default",
    isDisabled,
  };

  const isChatTab = currentTab === "chat";

  return (
    <Tabs
      {...commonTabsProps}
      className={isChatTab ? "mt-5" : undefined}
      selectedKey={isChatTab ? "chat" : undefined}
      variant={"solid"}
    >
      <Tab
        key="details"
        as={isChatTab ? undefined : Link}
        href={isChatTab ? `/tickets/${ticketId}` : undefined}
        title={<TabContent icon={ScrollTextIcon} text="Заявка" />}
      />
      <Tab
        key="chat"
        as={isChatTab ? undefined : Link}
        href={isChatTab ? undefined : `/tickets/${ticketId}/chat`}
        title={<TabContent icon={MessageSquareIcon} text="Чат" />}
      />
    </Tabs>
  );
}
