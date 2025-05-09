import { useParams } from "react-router";
import {
  Spinner,
  Button,
  ButtonGroup,
  Tooltip,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import useSWR from "swr";
import { Link } from "react-router-dom";
import { Alert } from "@heroui/alert";
import { addToast } from "@heroui/toast";
import { Paperclip } from "lucide-react";

import { Ticket } from "@/types";
import {
  CheckIcon,
  CheckPlusIcon,
  CloseIcon,
  ExternalIcon,
} from "@/components/icons.tsx";
import TicketDetails from "@/components/tickets/ticket-details.tsx";
import TicketHeader from "@/components/tickets/ticket-header.tsx";
import { Axios } from "@/api/api-provider.ts";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import AttachmentCard from "@/components/attachment-card.tsx";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const { user, isSupport } = useAuthStore();
  const { data, isLoading, error, mutate } = useSWR<Ticket>(
    `/api/tickets/${id}`,
  );

  const closeTicket = async () => {
    try {
      await Axios.post(`/api/tickets/${data?.id}/close`);
      addToast({
        title: "Успешно",
        color: "success",
      });
    } catch (e: any) {
      addToast({
        title: e.response?.message || "Что-то пошло не так...",
        color: "danger",
      });
    } finally {
      await mutate();
    }
  };

  const rejectTicket = async () => {
    try {
      await Axios.post(`/api/tickets/${data?.id}/reject`);
      addToast({
        title: "Успешно",
        color: "success",
      });
    } catch (e: any) {
      addToast({
        title: e.response?.message || "Что-то пошло не так...",
        color: "danger",
      });
    } finally {
      await mutate();
    }
  };

  if (error)
    return (
      <>
        <Alert
          color="danger"
          title={`Что-то пошло не так... Попробуйте позже [${error.message}]`}
        />
      </>
    );

  if (isLoading)
    return (
      <>
        <div className="flex justify-center">
          <Spinner />
        </div>
      </>
    );

  const assignTicket = async (ticketId: number) => {
    try {
      await Axios.post(`/api/tickets/${ticketId}/assign`);
      await mutate();
      addToast({
        title: "Успешно",
        description: "Вы принялись за заявку",
        color: "success",
      });
    } catch (e: any) {
      addToast({
        title: e.response?.message || "Что-то пошло не так...",
        color: "danger",
      });
      console.error(e);
    }
  };

  return (
    <>
      <TicketHeader
        id={data!.id}
        issuer={data!.issuer}
        status={data!.status}
        title={data!.title}
      />
      <div className="my-5">
        <div className="flex justify-between">
          {!data?.supportId && isSupport ? (
            <Button
              color="success"
              startContent={<CheckPlusIcon className="text-success" />}
              variant="flat"
              onPress={async () => await assignTicket(data!.id)}
            >
              Приняться за заявку
            </Button>
          ) : (
            <>
              <Tooltip
                closeDelay={0}
                content="Заявка еще не принята на рассмотрение"
                isDisabled={!!data?.supportId}
              >
                <span>
                  <Button
                    as={Link}
                    isDisabled={
                      (user?.id != data?.issuerId &&
                        user?.id != data?.supportId) ||
                      !data?.supportId
                    }
                    startContent={<ExternalIcon />}
                    to={`/tickets/${id}/chat`}
                    variant="shadow"
                  >
                    К чату
                  </Button>
                </span>
              </Tooltip>

              {isSupport && (
                <Tooltip
                  closeDelay={0}
                  content={
                    data?.isClosed
                      ? "Заявка уже закрыта"
                      : "Вы не рассматриваете эту заявку"
                  }
                  isDisabled={!data?.isClosed && user?.id == data?.supportId}
                >
                  <ButtonGroup>
                    <Button
                      color={"success"}
                      endContent={<CheckIcon className={"text-success"} />}
                      isDisabled={data?.isClosed || user?.id != data?.supportId}
                      variant="faded"
                      onPress={closeTicket}
                    >
                      Закрыть заявку
                    </Button>
                    <Button
                      color={"danger"}
                      endContent={<CloseIcon className={"text-danger"} />}
                      isDisabled={data?.isClosed || user?.id != data?.supportId}
                      variant="faded"
                      onPress={rejectTicket}
                    >
                      Отклонить заявку
                    </Button>
                  </ButtonGroup>
                </Tooltip>
              )}
            </>
          )}
        </div>
        <TicketDetails
          closedAt={data!.closedAt}
          createdAt={data!.createdAt}
          description={data!.description}
          id={data!.id}
          isClosed={data!.isClosed}
          issueType={data!.issueType}
          issuer={data!.issuer}
          mutate={mutate}
          support={data!.support!}
        />
        <Accordion
          className="mt-5"
          defaultExpandedKeys="all"
          variant="bordered"
        >
          <AccordionItem
            key="1"
            startContent={<Paperclip />}
            title="Приложения"
          >
            {data?.attachment ? (
              <AttachmentCard
                bytesLength={data.attachment.bytesLength}
                fileExtension={data.attachment.fileExtension}
                fileName={data.attachment.fileName}
                id={data.attachment.id}
              />
            ) : (
              <p className="font-light italic">Приложений нет</p>
            )}
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
