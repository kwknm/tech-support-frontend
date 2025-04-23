import moment from "moment/min/moment-with-locales";
import { Tooltip } from "@heroui/react";
import Linkify from "react-linkify";

import { Attachment } from "@/types";
import AttachmentCard from "@/components/attachment-card.tsx";
import { BaselineCheck } from "@/components/icons.tsx";

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
          <h2 className="max-w-[300px] flex space-x-2 flex-row text-sm mb-0.5 text-gray-900 dark:text-gray-100">
            <span>{fullName}</span>
            {isSupport && (
              <span className="mt-0.5 flex flex-col text-xs text-gray-500 dark:text-neutral-500">
                <div className="flex flex-row space-x-0.5 items-center">
                  <BaselineCheck />
                  <span className="text-green-500 italic">Поддержка</span>
                </div>
              </span>
            )}
          </h2>
          <div className="bg-white leading-none max-w-fit border border-gray-200 shadow dark:border-none rounded-xl px-3 pt-2 pb-1 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
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
