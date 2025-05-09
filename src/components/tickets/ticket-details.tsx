import {
  Accordion,
  AccordionItem,
  Button,
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
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditorMethods,
  quotePlugin,
} from "@mdxeditor/editor";
import { SaveIcon, SquarePenIcon, TextIcon } from "lucide-react";
import React, { useState } from "react";
import { addToast } from "@heroui/toast";
import { KeyedMutator } from "swr";

import InitializedMDXEditor from "@/components/common/initialized-mdxeditor.tsx";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import { Axios } from "@/api/api-provider.ts";
import { Ticket } from "@/types";

type Props = {
  id: number;
  support: { id: string; firstName: string; lastName: string };
  issuer: { id: string; firstName: string; lastName: string };
  createdAt: Date;
  issueType: { name: string };
  description: string;
  closedAt?: Date;
  isClosed: boolean;
  mutate: KeyedMutator<Ticket>;
};

export default function TicketDetails({
  id,
  support,
  issuer,
  createdAt,
  issueType,
  description,
  closedAt,
  isClosed,
  mutate,
}: Props) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const isAllowedToEdit = user?.id === issuer.id;
  const [isLoading, setIsLoading] = useState(false);
  const ref = React.useRef<MDXEditorMethods>(null);

  const updateDescription = async () => {
    setIsLoading(true);

    try {
      await Axios.patch(`/api/tickets/${id}`, {
        description: ref.current?.getMarkdown()!,
      });
    } catch {
      addToast({
        color: "danger",
        title: "Произошла неизвестная ошибка",
      });
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      await mutate(undefined, { revalidate: true });
    }
  };

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

      <Divider className="my-4" />

      <Accordion defaultExpandedKeys="all" variant="bordered">
        <AccordionItem
          key="1"
          startContent={<TextIcon />}
          title="Описание проблемы"
        >
          {!isEditing && (
            <InitializedMDXEditor
              readOnly
              editorRef={null}
              markdown={description}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                markdownShortcutPlugin(),
              ]}
            />
          )}
          {isEditing && isAllowedToEdit && (
            <InitializedMDXEditor editorRef={ref} markdown={description} />
          )}

          {isAllowedToEdit && (
            <div className="flex w-full justify-end">
              {isEditing ? (
                <Button
                  color="primary"
                  isLoading={isLoading}
                  startContent={<SaveIcon />}
                  variant="flat"
                  onPress={updateDescription}
                >
                  Сохранить
                </Button>
              ) : (
                <Button
                  color="warning"
                  startContent={<SquarePenIcon />}
                  variant="flat"
                  onPress={() => setIsEditing(true)}
                >
                  Редактировать
                </Button>
              )}
            </div>
          )}
        </AccordionItem>
      </Accordion>
    </section>
  );
}
