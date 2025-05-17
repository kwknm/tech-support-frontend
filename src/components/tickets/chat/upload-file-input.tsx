import React, { useRef } from "react";
import { Button, Tooltip } from "@heroui/react";
import { FileXIcon } from "lucide-react";

import { PaperClipIcon } from "@/components/icons.tsx";

type Props = {
  isLoading: boolean;
  isDisabled: boolean;
  currentFile: File | undefined;
  setCurrentFile: (value: File | undefined) => void;
};

export default function UploadFileInput({
  isLoading,
  isDisabled,
  currentFile,
  setCurrentFile,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    setCurrentFile(file);
  };

  const resetCurrentFile = () => {
    setCurrentFile(undefined);
    // @ts-ignore-next-line
    inputRef.current.value = null;
  };

  return (
    <>
      {currentFile ? (
        <Tooltip closeDelay={0} content="Очистить вложение">
          <Button
            isIconOnly
            color="danger"
            isDisabled={isDisabled}
            isLoading={isLoading}
            variant="flat"
            onPress={resetCurrentFile}
          >
            <FileXIcon />
          </Button>
        </Tooltip>
      ) : (
        <Tooltip closeDelay={0} content="Добавить вложение">
          <Button
            isIconOnly
            color="default"
            isDisabled={isDisabled}
            isLoading={isLoading}
            variant="bordered"
            onPress={() => inputRef.current?.click()}
          >
            <PaperClipIcon />
          </Button>
        </Tooltip>
      )}
      <input
        ref={inputRef}
        className="hidden"
        name="attachment"
        type="file"
        onChange={handleFileChange}
      />
    </>
  );
}
