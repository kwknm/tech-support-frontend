import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/react";
import { Checkbox, Divider, Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/react";
import { Form } from "@heroui/react";
import React, { useEffect, useState } from "react";
import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  quotePlugin,
  MDXEditorMethods,
} from "@mdxeditor/editor";
import { useNavigate } from "react-router-dom";
import { KeyedMutator } from "swr";
import { addToast } from "@heroui/toast";

import { Axios } from "@/api/api-provider.ts";
import { useTheme } from "@/hooks/use-theme.ts";
import { Ticket } from "@/types";

type SubmitData = {
  title: string;
  description: string;
  terms?: string;
  attachment: File;
  issueTypeId: string;
};

export default function NewTicket({
  mutate,
}: {
  mutate: KeyedMutator<Ticket[]>;
}) {
  const [issues, setIssues] = useState([]);
  const { isDark } = useTheme();
  const ref = React.useRef<MDXEditorMethods>(null);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("/api/tickets/issues").then((res) =>
      setIssues(
        res.data.map((x: { id: number; name: string }) => ({
          key: x.id,
          label: x.name,
        })),
      ),
    );
  }, []);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    // @ts-ignore
    const data: SubmitData = {
      ...Object.fromEntries(new FormData(e.currentTarget)),
      description: ref.current?.getMarkdown()!,
    };

    try {
      const response = await Axios.post("/api/tickets", data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      await mutate();
      ref.current?.setMarkdown("");
      e.target.reset();
      navigate(`/tickets/${response.data.ticketId}`);

      addToast({
        title: "Заявка создана",
        description: "Мы постараемся ответить в ближайшее время",
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
    <Card className="my-2.5">
      <Form validationBehavior="native" onSubmit={onSubmit}>
        <CardHeader className={"flex justify-around gap-5"}>
          <Input
            label="Тема"
            name={"title"}
            radius={"lg"}
            size={"sm"}
            variant="bordered"
          />
          <Select
            className="max-w-xs"
            items={issues}
            label="Тип проблемы"
            name={"issueTypeId"}
            radius="lg"
            size={"sm"}
            variant="bordered"
          >
            {(iss: { key: number; label: string }) => (
              <SelectItem>{iss.label}</SelectItem>
            )}
          </Select>
        </CardHeader>
        <Divider className="my-3" />
        <CardBody>
          <MDXEditor
            ref={ref}
            className={isDark ? "dark-theme dark-editor" : ""}
            markdown={""}
            plugins={[
              headingsPlugin(),
              quotePlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                  </>
                ),
              }),
            ]}
          />
        </CardBody>
        <Divider className="my-3" />
        <CardFooter className="flex justify-between gap-3.5">
          <div className="flex">
            <Checkbox name="terms" size="sm" value="true">
              Я согласен на обработку моих персональных данных
            </Checkbox>
          </div>
          <div className="flex gap-5">
            <Input
              className="max-w-xs"
              color="primary"
              name="attachment"
              type="file"
              variant="flat"
            >
              Добавить вложение
            </Input>
            <Button color="primary" type="submit" variant="shadow">
              Создать заявку
            </Button>
          </div>
        </CardFooter>
      </Form>
    </Card>
  );
}
