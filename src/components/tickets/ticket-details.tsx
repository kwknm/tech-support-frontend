import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Chip } from "@heroui/chip";
import moment from "moment/min/moment-with-locales";

import { User } from "@/types";

type Props = {
  id: number;
  support: User;
  issuer: User;
  createdAt: Date;
  issueType: { name: string };
  closedAt?: Date;
  isClosed: boolean;
};

export default function TicketDetails({
  support,
  issuer,
  createdAt,
  issueType,
  closedAt,
  isClosed,
}: Props) {
  return (
    <section>
      <Table
        hideHeader
        isCompact
        removeWrapper
        aria-label="Сведения"
        className="bg-gray-100 dark:bg-zinc-900 my-10 border-solid border-2 dark:border-zinc-800 rounded-md"
        isHeaderSticky={false}
      >
        <TableHeader>
          <TableColumn>1</TableColumn>
          <TableColumn>2</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell className="text-gray-500 dark:text-gray-400 font-semibold">
              Ответственный
            </TableCell>
            <TableCell>
              {support ? (
                <Chip color="success" variant="dot">
                  {support.firstName} {support.lastName}
                </Chip>
              ) : (
                <Chip color="danger" variant="dot">
                  Нет
                </Chip>
              )}
            </TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell className="text-gray-500 dark:text-gray-400 font-semibold">
              Пользователь
            </TableCell>
            <TableCell>
              {issuer.firstName} {issuer.lastName}
            </TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell className="text-gray-500 dark:text-gray-400 font-semibold">
              Тип проблемы
            </TableCell>
            <TableCell>{issueType.name}</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell className="text-gray-500 dark:text-gray-400 font-semibold">
              Дата создания
            </TableCell>
            <TableCell>{moment(createdAt).format("LLL")}</TableCell>
          </TableRow>
          <TableRow key="5">
            <TableCell className="text-gray-500 dark:text-gray-400 font-semibold">
              Дата закрытия
            </TableCell>
            <TableCell>
              {isClosed ? (
                <>
                  {moment(closedAt).format("LLL")}{" "}
                  <span className="text-default-500">
                    (закрыта спустя{" "}
                    {moment
                      .duration(moment(closedAt).diff(moment(createdAt)))
                      .humanize()}
                    )
                  </span>
                </>
              ) : (
                "Нет"
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}
