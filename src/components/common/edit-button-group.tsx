import { Button, Tooltip } from "@heroui/react";
import { SaveIcon, SquarePenIcon, XIcon } from "lucide-react";

type Props = {
  isEditing: boolean;
  isLoading?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function EditButtonGroup({
  isEditing,
  isLoading,
  onEdit,
  onSave,
  onCancel,
}: Props) {
  if (!isEditing) {
    return (
      <Tooltip closeDelay={0} content="Редактировать">
        <Button
          isIconOnly
          color="default"
          startContent={<SquarePenIcon />}
          variant="bordered"
          onPress={onEdit}
        />
      </Tooltip>
    );
  }

  return (
    <div className="flex gap-1">
      <Tooltip closeDelay={0} content="Сохранить изменения">
        <Button
          isIconOnly
          color="primary"
          isDisabled={isLoading}
          startContent={<SaveIcon />}
          variant="flat"
          onPress={onSave}
        />
      </Tooltip>
      <Tooltip closeDelay={0} content="Отменить">
        <Button
          isIconOnly
          color="danger"
          startContent={<XIcon />}
          variant="flat"
          onPress={onCancel}
        />
      </Tooltip>
    </div>
  );
}
