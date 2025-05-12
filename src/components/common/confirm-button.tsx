import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import React from "react";

type Props = {
  popoverContent: React.ReactNode;
  confirmText: React.ReactNode;
  onOk: () => void;
  confirmButtonColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
  confirmButtonVariant?:
    | "shadow"
    | "faded"
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "ghost"
    | undefined;
  children: React.ReactNode;
};

export default function ConfirmButton({
  popoverContent,
  confirmText,
  onOk,
  confirmButtonColor = "default",
  confirmButtonVariant = "flat",
  children,
}: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      backdrop="opaque"
      isOpen={isOpen}
      placement="top"
      showArrow={true}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent>
        <div className="px-2 py-2">
          <div className="text-small mb-3">{popoverContent}</div>
          <Button
            color={confirmButtonColor}
            size="sm"
            variant={confirmButtonVariant}
            onPress={() => {
              onOk();
              setIsOpen(false);
            }}
          >
            {confirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
