import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { MessageCircleQuestion, Trash2Icon } from "lucide-react";
import { Button, Divider, ScrollShadow, Tooltip } from "@heroui/react";
import React, { useState } from "react";
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditorMethods,
  quotePlugin,
} from "@mdxeditor/editor";
import moment from "moment/min/moment-with-locales";
import { addToast } from "@heroui/toast";
import { KeyedMutator } from "swr";

import { Faq } from "@/types";
import InitializedMDXEditor from "@/components/common/initialized-mdxeditor.tsx";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import { LikeIcon } from "@/components/icons.tsx";
import { Axios } from "@/api/api-provider.ts";
import EditButtonGroup from "@/components/common/edit-button-group.tsx";
import ConfirmButton from "@/components/common/confirm-button.tsx";

export default function FaqItem({
  id,
  content,
  author,
  createdAt,
  title,
  likes,
  editedAt,
  mutate,
}: Faq & { mutate: KeyedMutator<Faq[]> }) {
  const { user, isLoggedIn } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = React.useRef<MDXEditorMethods>(null);
  const isAllowedToEdit = user?.isSupport;

  const toggleLike = async (faqId: number) => {
    if (!isLoggedIn) {
      addToast({
        title: "Авторизуйтесь для данного действия",
        color: "danger",
      });

      return;
    }

    try {
      await Axios.post(`/api/faq/${faqId}/like/toggle`);

      await mutate();
    } catch {
      addToast({
        title: "Произошла неизвестная ошибка. Попробуйте позже",
        color: "danger",
      });
    }
  };

  const updateDescription = async () => {
    setIsLoading(true);

    try {
      await Axios.patch(`/api/faq/${id}`, {
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

  const deleteFaq = async () => {
    try {
      await Axios.delete(`/api/faq/${id}`);
      await mutate();
      addToast({
        title: "Успешно",
        color: "success",
        description: "Элемент успешно удален",
      });
    } catch {
      addToast({
        title: "Произошла неизвестная ошибка",
        color: "danger",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex gap-1.5">
        <MessageCircleQuestion className="shrink-0" />
        <Tooltip closeDelay={0} content={title}>
          <span className="line-clamp-2">{title}</span>
        </Tooltip>
      </CardHeader>
      <Divider />
      <CardBody>
        <ScrollShadow className="h-[300px]" isEnabled={false}>
          {!isEditing && (
            <InitializedMDXEditor
              readOnly
              editorRef={null}
              markdown={content}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                markdownShortcutPlugin(),
              ]}
            />
          )}
          {isEditing && isAllowedToEdit && (
            <InitializedMDXEditor editorRef={ref} markdown={content} />
          )}
        </ScrollShadow>
      </CardBody>
      <Divider />
      <CardFooter className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <Button
            color={user && likes.includes(user?.id) ? "primary" : "default"}
            variant={user && likes.includes(user?.id) ? "shadow" : "faded"}
            onPress={async () => await toggleLike(id)}
          >
            <LikeIcon /> {likes.length || null}
          </Button>
          {isAllowedToEdit && (
            <>
              <EditButtonGroup
                isEditing={isEditing}
                isLoading={isLoading}
                onCancel={() => setIsEditing(false)}
                onEdit={() => setIsEditing(true)}
                onSave={updateDescription}
              />
              <ConfirmButton
                confirmButtonColor="danger"
                confirmText="Удалить"
                popoverContent="Вы уверены, что хотите удалить элемент?"
                onOk={deleteFaq}
              >
                <Button
                  isIconOnly
                  color="danger"
                  startContent={<Trash2Icon />}
                  variant="flat"
                />
              </ConfirmButton>
            </>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-default-900">
            {author.firstName} {author.lastName}
          </span>
          <span className="text-sm text-default-500">
            {!editedAt ? (
              <span>Добавлено {moment(createdAt).format("lll")}</span>
            ) : (
              <Tooltip
                closeDelay={0}
                content={`Дата создания: ${moment(createdAt).format("lll")}`}
              >
                <span>Обновлено {moment(editedAt).format("lll")}</span>
              </Tooltip>
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
