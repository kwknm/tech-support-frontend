import { Button, Divider, Tooltip } from "@heroui/react";
import { PencilIcon, SaveIcon, SquarePenIcon, TextIcon } from "lucide-react";
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditorMethods,
  quotePlugin,
} from "@mdxeditor/editor";
import React, { useState } from "react";
import { addToast } from "@heroui/toast";
import { KeyedMutator } from "swr";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import moment from "moment/min/moment-with-locales";

import { Axios } from "@/api/api-provider.ts";
import InitializedMDXEditor from "@/components/common/initialized-mdxeditor.tsx";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import { Ticket } from "@/types";

export default function TicketDescription({
  id,
  issuerId,
  description,
  mutate,
  editedAt,
}: {
  id: number;
  issuerId: string;
  description: string;
  mutate: KeyedMutator<Ticket>;
  editedAt?: Date;
}) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const isAllowedToEdit = user?.id === issuerId;
  const [isLoading, setIsLoading] = useState(false);
  const ref = React.useRef<MDXEditorMethods>(null);

  const updateDescription = async () => {
    setIsLoading(true);

    try {
      await Axios.patch(`/api/tickets/${id}`, {
        description: ref.current?.getMarkdown()!,
      });
      addToast({
        color: "success",
        title: "Описание успешно обновлено",
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
    <Card>
      <CardHeader className="flex gap-3">
        <TextIcon />
        <h2>Описание</h2>
      </CardHeader>
      <Divider />
      <CardBody>
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
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between">
        {isAllowedToEdit || (
          <>
            {editedAt && (
              <span className="text-sm italic flex flex-row gap-1.5">
                <PencilIcon size={20} /> Редактировано{" "}
                {moment(editedAt).format("LLL")}
              </span>
            )}
            {isAllowedToEdit &&
              (isEditing ? (
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
                <Tooltip content="Редактировать">
                  <Button
                    isIconOnly
                    color="default"
                    startContent={<SquarePenIcon />}
                    variant="bordered"
                    onPress={() => setIsEditing(true)}
                  />
                </Tooltip>
              ))}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
