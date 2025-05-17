import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { MessageCircleQuestion, Trash2Icon } from "lucide-react";
import { Button, Divider, ScrollShadow, Tooltip, User } from "@heroui/react";
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
  const [isLoadingButtons, setIsLoadingButtons] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
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

    setIsLoadingLike(true);

    try {
      await Axios.post(`/api/faq/${faqId}/like/toggle`);

      await mutate();
    } catch {
      addToast({
        title: "Произошла неизвестная ошибка. Попробуйте позже",
        color: "danger",
      });
    } finally {
      setIsLoadingLike(false);
    }
  };

  const updateDescription = async () => {
    setIsLoadingButtons(true);

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
      setIsLoadingButtons(false);
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
          <span className="line-clamp-2 font-sans font-semibold">{title}</span>
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
            isDisabled={isLoadingLike}
            variant={user && likes.includes(user?.id) ? "shadow" : "faded"}
            onPress={async () => await toggleLike(id)}
          >
            <LikeIcon /> {likes.length || null}
          </Button>
          {isAllowedToEdit && (
            <>
              <EditButtonGroup
                isEditing={isEditing}
                isLoading={isLoadingButtons}
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
          <User
            avatarProps={{
              name: `${author?.firstName[0]}${author?.lastName[0]}`,
            }}
            description={
              !editedAt ? (
                <span>Добавлено {moment(createdAt).format("lll")}</span>
              ) : (
                <Tooltip
                  closeDelay={0}
                  content={`Дата создания: ${moment(createdAt).format("lll")}`}
                >
                  <span>Обновлено {moment(editedAt).format("lll")}</span>
                </Tooltip>
              )
            }
            name={`${author.firstName} ${author.lastName}`}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
