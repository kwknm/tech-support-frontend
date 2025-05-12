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
  useDisclosure,
  User,
} from "@heroui/react";
import useSWR from "swr";
import moment from "moment/min/moment-with-locales";
import { Link } from "react-router-dom";
import React, { useMemo, useState } from "react";
import { Chip } from "@heroui/chip";
import {
  TicketCheckIcon,
  HexagonIcon,
  WrenchIcon,
  TicketPlusIcon,
  ShieldIcon,
} from "lucide-react";

import { title } from "@/components/primitives.ts";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import { Ticket } from "@/types";
import { Axios } from "@/api/api-provider.ts";
import { siteConfig } from "@/config/site.ts";
import IssuesModal from "@/components/tickets/issues-modal.tsx";
import { convertStatusToTag, getStatusDict } from "@/lib/utils.tsx";

const columns = [
  {
    key: "id",
    label: "#",
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

export default function TicketsSupportView() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [myAssignment, setMyAssignment] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const uri = new URL("/api/tickets", siteConfig.api_url);

  statusFilter &&
    statusFilter !== "all" &&
    uri.searchParams.append("statusId", statusFilter);
  myAssignment && uri.searchParams.append("supportId", user!.id);

  const { data, isLoading, mutate } = useSWR(uri.toString());

  const assignTicket = async (ticketId: number) => {
    try {
      await Axios.post(`/api/tickets/${ticketId}/assign`);
      await mutate();
    } catch (err) {
      console.error(err);
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
            avatarProps={{
              name: `${user?.firstName[0]}${user?.lastName[0]}`,
            }}
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
            {!ticket?.supportId && (
              <Tooltip content="Приняться за заявку">
                <Button
                  isIconOnly
                  radius="full"
                  variant="bordered"
                  onPress={async () => {
                    await assignTicket(ticket.id);
                  }}
                >
                  <TicketPlusIcon />
                </Button>
              </Tooltip>
            )}
            {ticket.supportId != user?.id && ticket.supportId != null && (
              <Tooltip
                closeDelay={0}
                content="Заявка уже рассматривается другим сотрудником"
              >
                <Button
                  disableRipple
                  isIconOnly
                  radius="full"
                  variant="bordered"
                >
                  <ShieldIcon className="text-warning" />
                </Button>
              </Tooltip>
            )}
            {ticket.supportId == user?.id && (
              <Tooltip closeDelay={0} content="Вы рассматриваете эту заявку">
                <Button
                  disableRipple
                  isIconOnly
                  radius="full"
                  variant="bordered"
                >
                  <TicketCheckIcon className="text-success" />
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
      <IssuesModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <section className="flex flex-col items-center justify-center gap-4 pt-8 md:pt-10">
        <div className="max-w-lg text-center justify-center flex flex-col mb-10">
          <h1 className={title()}>
            Список <span className={title({ color: "pink" })}>заявок</span>
          </h1>
        </div>
      </section>
      <main>
        <div className="flex justify-between">
          <div className="flex flex-col gap-2 w-full">
            <Select
              disallowEmptySelection
              className="max-w-[200px]"
              defaultSelectedKeys={["all"]}
              label="Статус"
              labelPlacement="outside"
              size="sm"
              startContent={<HexagonIcon />}
              variant="bordered"
              onSelectionChange={(keys) => {
                setStatusFilter(keys.currentKey!);
              }}
            >
              {getStatusDict().map((x) => (
                <SelectItem key={x.key}>{x.label}</SelectItem>
              ))}
            </Select>
            <Checkbox
              size="sm"
              onValueChange={(value) => setMyAssignment(value)}
            >
              На моем рассмотрении
            </Checkbox>
          </div>
          <Button
            className="flex-shrink-0"
            startContent={<WrenchIcon />}
            variant="bordered"
            onPress={onOpen}
          >
            Управление проблемами
          </Button>
        </div>
        <div>
          <Chip className="my-3" color="primary" radius="sm" variant="dot">
            {data?.length ?? "?"} заявок
          </Chip>
        </div>
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
              <TableRow
                key={item.key}
                as={Link}
                className="cursor-pointer"
                href={`/tickets/${item.key}`}
              >
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
