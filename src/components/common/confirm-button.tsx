import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import React from "react";

type Props = {
  triggerElement: React.ReactNode;
  popoverContent: React.ReactNode;
  confirmText: React.ReactNode;
  onPressed: () => void;
  confirmButtonColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
};

export default function ConfirmButton({
  triggerElement,
  popoverContent,
  confirmText,
  onPressed,
  confirmButtonColor,
}: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      backdrop="blur"
      isOpen={isOpen}
      placement="bottom"
      showArrow={false}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>{triggerElement}</PopoverTrigger>
      <PopoverContent>
        <div className="px-2 py-2">
          <div className="text-small font-semibold mb-3">{popoverContent}</div>
          <Button
            color={confirmButtonColor}
            size="sm"
            variant="faded"
            onPress={onPressed}
          >
            {confirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
