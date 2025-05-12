import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import "@mdxeditor/editor/style.css";
import { MDXEditorMethods } from "@mdxeditor/editor";
import React from "react";
import { KeyedMutator } from "swr";
import { FileQuestionIcon } from "lucide-react";

import InitializedMDXEditor from "@/components/common/initialized-mdxeditor.tsx";
import { Axios } from "@/api/api-provider.ts";
import { Faq } from "@/types";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mutate: KeyedMutator<Faq[]>;
};

export default function AddFaqModal({ isOpen, onOpenChange, mutate }: Props) {
  const ref = React.useRef<MDXEditorMethods>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // @ts-ignore
    const data: { title: string; content: string } = {
      ...Object.fromEntries(new FormData(e.currentTarget)),
      content: ref.current?.getMarkdown()!,
    };

    if ((data?.title as string).trim() === "") {
      addToast({
        title: "Ошибка",
        color: "danger",
        description: "Заполните заголовок",
      });

      return;
    }

    if ((data?.content as string).trim() === "") {
      addToast({
        title: "Ошибка",
        color: "danger",
        description: "Заполните описание",
      });

      return;
    }

    try {
      await Axios.post("/api/faq", data);

      await mutate();
      onOpenChange(false);

      addToast({
        title: "Элемент создан",
        color: "success",
      });
    } catch (err: any) {
      console.log(err);
      addToast({
        title: "Ошибка",
        description: err.response.data?.errors.join("; "),
        color: "danger",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
      <ModalContent>
        {(_) => (
          <>
            <ModalHeader className="flex items-center gap-1.5">
              <FileQuestionIcon /> Добавление элемента FAQ
            </ModalHeader>
            <Divider />
            <ModalBody>
              <Form className="w-full" onSubmit={onSubmit}>
                <Input
                  label="Заголовок"
                  name="title"
                  placeholder="Введите заголовок элемента"
                  type="text"
                />
                <InitializedMDXEditor editorRef={ref} markdown={""} />
                <Button isLoading={false} type="submit" variant="bordered">
                  Добавить
                </Button>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
