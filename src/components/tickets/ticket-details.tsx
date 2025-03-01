import {
  Accordion,
  AccordionItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Chip } from "@heroui/chip";
import moment from "moment/min/moment-with-locales";
import { MDXEditor } from "@mdxeditor/editor";

import { useTheme } from "@/hooks/use-theme.ts";

type Props = {
  support: { id: string; firstName: string; lastName: string };
  issuer: { firstName: string; lastName: string };
  createdAt: Date;
  issueType: { name: string };
  description: string;
  closedAt?: Date;
  isClosed: boolean;
};

export default function TicketDetails({
  support,
  issuer,
  createdAt,
  issueType,
  description,
  closedAt,
  isClosed,
}: Props) {
  const { isDark } = useTheme();

  return (
    <section>
      <h2 className="text-3xl font-light mt-6">Сведения</h2>
      <Divider className="my-4" />

      <Table
        hideHeader
        removeWrapper
        aria-label="Сведения"
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
                `${support.firstName} ${support.lastName}`
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
              {isClosed ? moment(closedAt).format("LLL") : "Нет"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Divider className="my-4" />

      <Accordion defaultExpandedKeys={["1"]} variant="bordered">
        <AccordionItem key="1" title="Описание проблемы">
          <MDXEditor
            readOnly
            className={isDark ? "dark-theme" : ""}
            markdown={description!}
            suppressHtmlProcessing={true}
          />
        </AccordionItem>
      </Accordion>
    </section>
  );
}
