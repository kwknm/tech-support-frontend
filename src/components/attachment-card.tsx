import { Link } from "react-router-dom";
import { Chip } from "@heroui/chip";
import { Button, Tooltip } from "@heroui/react";

import { siteConfig } from "@/config/site.ts";
import { DocumentIcon } from "@/components/icons.tsx";

type Props = {
  id: string;
  fileName: string;
  fileExtension: string;
  bytesLength: number;
};

export default function AttachmentCard({
  id,
  fileName,
  fileExtension,
  bytesLength,
}: Props) {
  return (
    <Tooltip closeDelay={0} content={fileName}>
      <Button
        as={Link}
        className="p-2 h-full max-w-fit"
        color="secondary"
        size="lg"
        to={`${siteConfig.api_url}/api/attachments/${id}`}
        variant="flat"
      >
        <DocumentIcon size={32} />
        <div className="max-w-[150px]">
          <p className="text-sm text-wrap line-clamp-1 text-gray-800 font-bold  dark:text-white">
            {fileName}
          </p>
          <Chip color="default" radius="sm" size="sm" variant="flat">
            {fileExtension?.slice(1).toUpperCase()}{" "}
            {(bytesLength / 1024).toFixed(3)} KB
          </Chip>
        </div>
      </Button>
    </Tooltip>
  );
}
