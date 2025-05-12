import { Link } from "react-router-dom";
import { Chip } from "@heroui/chip";
import { Snippet, Tooltip } from "@heroui/react";
import { FileIcon } from "lucide-react";

import { siteConfig } from "@/config/site.ts";
import { formatBytes } from "@/lib/utils.tsx";

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
      <Snippet
        disableCopy
        as={Link}
        className="max-w-[250px] border-secondary-200 border-2"
        color="secondary"
        copyIcon={<FileIcon size={32} />}
        symbol={
          <p className="max-w-[175px] text-left mb-1 text-wrap line-clamp-1 text-gray-800 font-semibold  dark:text-white">
            {fileName}
          </p>
        }
        to={`${siteConfig.api_url}/api/attachments/${id}`}
        variant="flat"
      >
        <Chip
          className="justify-start flex"
          color="primary"
          radius="sm"
          size="sm"
          variant="flat"
        >
          <div className="line-clamp-1 max-w-[150px] font-semibold">
            {formatBytes(bytesLength)} · {fileExtension?.slice(1).toUpperCase()}
          </div>
        </Chip>
      </Snippet>
    </Tooltip>
  );
}
