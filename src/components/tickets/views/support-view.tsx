import { Table, TableBody, TableColumn, TableHeader } from "@heroui/table";
import {
  Button,
  Checkbox,
  getKeyValue,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  TableCell,
  TableRow,
  Tooltip,
  User,
} from "@heroui/react";
import useSWR from "swr";
import moment from "moment/min/moment-with-locales";
import { Link } from "react-router-dom";
import React, { useMemo, useState } from "react";
import { Chip } from "@heroui/chip";

import { title } from "@/components/primitives.ts";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import {
  DocumentCheckIcon,
  DocumentPlusIcon,
  DocumentShieldIcon,
  ExternalIcon,
} from "@/components/icons.tsx";
import { Ticket } from "@/types";
import { Axios } from "@/api/api-provider.ts";
import { convertStatusToTag } from "@/pages/tickets";
import { siteConfig } from "@/config/site.ts";

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

const statusDict = [
  { key: "all", label: "Все" },
  { key: "0", label: "Открыта" },
  { key: "1", label: "Обрабатывается" },
  { key: "2", label: "Решена" },
  { key: "3", label: "Отклонена" },
];

export default function TicketsSupportView() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [myAssignment, setMyAssignment] = useState<boolean>(false);
  const uri = new URL("/api/tickets", siteConfig.api_url);

  statusFilter &&
    statusFilter !== "all" &&
    uri.searchParams.append("statusId", statusFilter);
  myAssignment && uri.searchParams.append("supportId", user!.id);

  const { data, isLoading, mutate } = useSWR(uri.toString(), null, {
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const assignTicket = async (ticketId: number) => {
    try {
      await Axios.post(`/api/tickets/${ticketId}/assign`);
      await mutate();
    } catch (e) {
      console.error(e);
    }
  };
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const mappedTicketsData = useMemo(() => {
    return (
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
        support: ticket.support ? (
          ticket.support.firstName + " " + ticket.support.lastName
        ) : (
          <Chip radius="sm" variant="bordered">
            Нет
          </Chip>
        ),
        actions: (
          <div className="flex gap-1 justify-left items-center">
            <Tooltip content="Перейти к заявке">
              <Button
                isIconOnly
                as={Link}
                to={`/tickets/${ticket.id}`}
                variant="bordered"
              >
                <ExternalIcon />
              </Button>
            </Tooltip>
            {!ticket?.supportId && (
              <Tooltip content="Приняться за заявку">
                <Button
                  isIconOnly
                  variant="bordered"
                  onPress={async () => {
                    await assignTicket(ticket.id);
                  }}
                >
                  <DocumentPlusIcon />
                </Button>
              </Tooltip>
            )}
            {ticket.supportId != user?.id && ticket.supportId != null && (
              <Tooltip content="Заявка уже рассматривается другим сотрудником">
                <Button disableRipple isIconOnly variant="bordered">
                  <DocumentShieldIcon className="text-warning" />
                </Button>
              </Tooltip>
            )}
            {ticket.supportId == user?.id && (
              <Tooltip content="Вы рассматриваете эту заявку">
                <Button disableRipple isIconOnly variant="bordered">
                  <DocumentCheckIcon className="text-success" />
                </Button>
              </Tooltip>
            )}
          </div>
        ),
      })) ?? []
    );
  }, [data]);

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
            Список <span className={title({ color: "pink" })}>заявок</span>
          </h1>
        </div>
      </section>
      <main>
        <div className="flex flex-row gap-5">
          <Select
            disallowEmptySelection
            className="max-w-[200px]"
            defaultSelectedKeys={["all"]}
            label="Статус"
            size="sm"
            variant="bordered"
            onSelectionChange={(keys) => {
              setStatusFilter(keys.currentKey!);
            }}
          >
            {statusDict.map((x) => (
              <SelectItem key={x.key}>{x.label}</SelectItem>
            ))}
          </Select>
          <Checkbox onValueChange={(value) => setMyAssignment(value)}>
            На вашем рассмотрении
          </Checkbox>
        </div>
        <div>
          <Chip className="my-3" radius="sm">
            {data?.length ?? "?"} заявок
          </Chip>
        </div>
        <Table
          isVirtualized
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
          selectionMode={"multiple"}
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
