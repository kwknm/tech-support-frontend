import { Link } from "react-router-dom";
import { Chip } from "@heroui/chip";
import { Snippet, Tooltip } from "@heroui/react";

import { siteConfig } from "@/config/site.ts";
import { DocumentIcon } from "@/components/icons.tsx";

type Props = {
  id: string;
  fileName: string;
  fileExtension: string;
  bytesLength: number;
};

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024; // 1 KB = 1024 Bytes
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export default function AttachmentCard({
  id,
  fileName,
  fileExtension,
  bytesLength,
}: Props) {
  return (
    <Tooltip closeDelay={0} content={fileName}>
      <Snippet
        disableCopy
        as={Link}
        className="max-w-[200px]"
        color="secondary"
        copyIcon={<DocumentIcon size={32} />}
        symbol={
          <p className="text-left mb-1 text-wrap line-clamp-1 text-gray-800 font-semibold  dark:text-white">
            {fileName}
          </p>
        }
        to={`${siteConfig.api_url}/api/attachments/${id}`}
        variant="flat"
      >
        <Chip
          className="justify-start flex"
          color="default"
          radius="sm"
          size="sm"
          variant="flat"
        >
          <div className="line-clamp-1 max-w-[125px]">
            {formatBytes(bytesLength)} {fileExtension?.slice(1).toUpperCase()}
          </div>
        </Chip>
      </Snippet>
    </Tooltip>
  );
}
