import moment from "moment/min/moment-with-locales";
import { Tooltip } from "@heroui/react";
import Linkify from "react-linkify";

import { Attachment } from "@/types";
import AttachmentCard from "@/components/attachment-card.tsx";

const formatDate = (timestamp: Date) => {
  const now = moment();
  const messageDate = moment(timestamp);

  if (now.isSame(messageDate, "day")) {
    return moment(timestamp).fromNow();
  } else {
    return moment(timestamp).format("D MMMM HH:MM");
  }
};

export const Message = ({
  firstName,
  lastName,
  content,
  isSupport = true,
  timestamp,
  isUsersMessage,
  attachment,
}: {
  firstName: string;
  lastName: string;
  content: string;
  isSupport?: boolean;
  timestamp: Date;
  isUsersMessage: boolean;
  attachment?: Attachment;
}) => {
  const fullName = `${firstName} ${lastName}`;
  const formatted = formatDate(timestamp);
  const formattedFull = moment(timestamp).format("DD.MM.YYYY HH:mm:ss");

  if (isUsersMessage)
    return (
      <li className="flex ms-auto gap-x-2 sm:gap-x-4 max-w-[90%]">
        <div className="grow text-end">
          <div className="inline-flex flex-col gap-2 items-end">
            <div className="inline-block leading-none bg-blue-500 dark:bg-blue-600 rounded-xl px-3 pt-2 pb-1 shadow-lg">
              <p className="text-md text-white text-start">
                <Linkify>{content}</Linkify>
              </p>
              <Tooltip closeDelay={0} content={formattedFull}>
                <span className="text-xs text-gray-300">{formatted}</span>
              </Tooltip>
            </div>
            {attachment && (
              <AttachmentCard
                bytesLength={attachment.bytesLength}
                fileExtension={attachment.fileExtension}
                fileName={attachment.fileName}
                id={attachment.id}
              />
            )}
          </div>
        </div>
      </li>
    );

  return (
    <>
      <li className="gap-x-2 sm:gap-x-4 me-11 max-w-[90%] flex flex-col">
        <div>
          <h2 className="max-w-[300px] font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">
            {fullName}
          </h2>
          <div className="bg-white leading-none border max-w-fit border-gray-200 rounded-2xl px-3 pt-2 pb-1 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
            <div className="space-y-1.5">
              <p className="text-sm text-gray-800 dark:text-white">
                <Linkify>{content}</Linkify>
              </p>
              <Tooltip closeDelay={0} content={formattedFull}>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {formatted}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>

        <span className="mt-1.5 flex gap-x-1 flex-col text-xs text-gray-500 dark:text-neutral-500">
          {isSupport && (
            <div className="flex flex-row items-center">
              <svg
                className="shrink-0 size-3"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 6 7 17l-5-5" />
                <path d="m22 10-7.5 7.5L13 16" />
              </svg>
              &nbsp;
              <span className="text-green-500 mb-1.5">Поддержка</span>
            </div>
          )}
        </span>

        {attachment && (
          <AttachmentCard
            bytesLength={attachment.bytesLength}
            fileExtension={attachment.fileExtension}
            fileName={attachment.fileName}
            id={attachment.id}
          />
        )}
      </li>
    </>
  );
};
