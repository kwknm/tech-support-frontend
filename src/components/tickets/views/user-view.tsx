import { Table, TableHeader, TableColumn, TableBody } from "@heroui/table";
import {
  Accordion,
  AccordionItem,
  Spinner,
  TableCell,
  TableRow,
  getKeyValue,
  Tooltip,
  Pagination,
  Button,
  User,
} from "@heroui/react";
import useSWR from "swr";
import moment from "moment/min/moment-with-locales";
import { Link } from "react-router-dom";
import React from "react";

import { title } from "@/components/primitives.ts";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import NewTicket from "@/components/new-ticket.tsx";
import { ExternalIcon } from "@/components/icons.tsx";
import { Ticket } from "@/types";
import { convertStatusToTag } from "@/pages/tickets";

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "issuer",
    label: "ОТПРАВИТЕЛЬ",
  },
  {
    key: "title",
    label: "ТЕМА",
  },
  {
    key: "status",
    label: "СТАТУС",
  },
  {
    key: "issueType",
    label: "ТИП",
  },
  {
    key: "createdAt",
    label: "ДАТА СОЗДАНИЯ",
  },
  {
    key: "support",
    label: "ОТВЕТСТВЕННЫЙ",
  },
  {
    key: "actions",
    label: "ДЕЙСТВИЯ",
  },
];

export default function TicketsUserView() {
  const { user } = useAuthStore();
  const { data, isLoading, mutate } = useSWR<Ticket[]>(
    `/api/tickets?userId=${user?.id}`,
  );
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const mappedTicketsData =
    data?.map((ticket: Ticket) => ({
      key: ticket.id,
      id: "#" + ticket.id,
      issuer: (
        <User
          description={ticket.issuer.email}
          name={ticket.issuer.firstName + " " + ticket.issuer.lastName}
        />
      ),
      title: (
        <Tooltip closeDelay={0} content={ticket.title} placement="top-start">
          <span className="line-clamp-1 text-pretty whitespace-pre-wrap">
            {ticket.title}
          </span>
        </Tooltip>
      ),
      status: convertStatusToTag(ticket.status),
      issueType: ticket.issueType.name,
      createdAt: moment(ticket.createdAt).format("ll"),
      support: ticket.supportId
        ? ticket.support!.firstName + " " + ticket.support!.lastName
        : "Нет",
      actions: (
        <div className="flex gap-1 justify-left items-center">
          <Tooltip closeDelay={0} content="Перейти к заявке">
            <Button
              isIconOnly
              as={Link}
              to={`/tickets/${ticket.id}`}
              variant="bordered"
            >
              <ExternalIcon />
            </Button>
          </Tooltip>
        </div>
      ),
    })) ?? [];

  const pages = Math.ceil(mappedTicketsData?.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return mappedTicketsData?.slice(start, end);
  }, [page, mappedTicketsData]);

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 pt-8 md:pt-10">
        <div className="max-w-lg text-center justify-center flex flex-col mb-10">
          <h1 className={title()}>
            Мои <span className={title({ color: "pink" })}>заявки</span>
          </h1>
        </div>
      </section>
      <Accordion className={"my-5"} variant={"bordered"}>
        <AccordionItem
          key="1"
          aria-label="создать заявку"
          subtitle="Пожалуйста, заполните форму, чтобы мы могли помочь вам решить вашу проблему"
          title="Создание новой заявки"
        >
          <NewTicket mutate={mutate} />
        </AccordionItem>
      </Accordion>
      <main>
        <Table
          aria-label={"заявки"}
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          selectionMode={"single"}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"Нет заявок."}
            isLoading={isLoading}
            items={items}
            loadingContent={<Spinner />}
          >
            {(item: any) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </main>
    </>
  );
}
