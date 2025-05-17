import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Listbox,
  ListboxItem,
  Divider,
  Form,
  Input,
} from "@heroui/react";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { BugIcon, Trash2Icon } from "lucide-react";
import { addToast } from "@heroui/toast";
import { AxiosError } from "axios";

import { IssueType } from "@/types";
import { Axios } from "@/api/api-provider.ts";
import ConfirmButton from "@/components/common/confirm-button.tsx";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

type ListBoxItemProps = { key: string; label: string };

export default function IssuesModal({ isOpen, onOpenChange }: Props) {
  const { data, isLoading, mutate } = useSWR("/api/tickets/issues", null, {
    revalidateOnFocus: false,
  });
  const [mappedIssues, setMappedIssues] = useState();

  useEffect(() => {
    if (data) {
      setMappedIssues(
        data.map((x: IssueType) => ({
          key: x.id,
          label: x.name,
        })),
      );
    }
  }, [data]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    if ((data?.name as string).trim() === "") {
      addToast({
        title: "Ошибка",
        color: "danger",
        description: "Заполните название проблемы",
      });

      return;
    }

    try {
      await Axios.post<{ issueId: string }>("/api/tickets/issues", data);

      addToast({
        title: "Успешно",
        color: "success",
        description: "Проблема успешно добавлена",
      });
      // @ts-ignore
      e.target.reset();
      await mutate();
    } catch (err: any) {
      let msg =
        err instanceof AxiosError ? err.response?.data.message : err.message;

      addToast({
        title: "Произошла ошибка",
        color: "danger",
        description: msg,
      });
    }
  };

  const deleteIssue = async (issueId: string) => {
    try {
      await Axios.delete(`/api/tickets/issues/${issueId}`);
      await mutate();
      addToast({
        title: "Успешно",
        color: "success",
        description: "Проблема успешно удалена",
      });
    } catch {
      addToast({
        title: "Произошла неизвестная ошибка",
        color: "danger",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(_) => (
          <>
            <ModalHeader className="flex items-center gap-1.5">
              <BugIcon size={22} />
              Управление проблемами
            </ModalHeader>
            <ModalBody>
              <Listbox
                items={mappedIssues}
                topContent="Список проблем:"
                variant="bordered"
              >
                {(item: ListBoxItemProps) => (
                  <ListboxItem
                    key={item.key}
                    endContent={
                      <ConfirmButton
                        confirmButtonColor={"danger"}
                        confirmText={"Удалить"}
                        popoverContent={"Уверены, что хотите удалить элемент?"}
                        onOk={async () => {
                          await deleteIssue(item.key);
                        }}
                      >
                        <Button isIconOnly size="sm" variant="light">
                          <Trash2Icon
                            className="text-danger"
                            color="currentColor"
                            size={22}
                          />
                        </Button>
                      </ConfirmButton>
                    }
                    startContent={"–"}
                  >
                    {item.label}
                  </ListboxItem>
                )}
              </Listbox>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Form className="w-full" onSubmit={onSubmit}>
                <Input
                  label="Создание проблемы"
                  labelPlacement="outside"
                  name="name"
                  placeholder="Введите название проблемы"
                  type="text"
                />
                <Button isLoading={isLoading} type="submit" variant="bordered">
                  Добавить
                </Button>
              </Form>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
