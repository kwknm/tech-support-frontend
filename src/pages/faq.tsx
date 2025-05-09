import {
  Accordion,
  AccordionItem,
  Button,
  Form,
  Input,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { InfoIcon, PlusIcon } from "lucide-react";
import useSWR from "swr";
import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { addToast } from "@heroui/toast";
import moment from "moment/min/moment-with-locales";

import { subtitle, title } from "@/components/primitives.ts";
import { Faq } from "@/types";
import { LikeIcon, SearchIcon } from "@/components/icons.tsx";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import { Axios } from "@/api/api-provider.ts";
import AddFaqModal from "@/components/add-faq-modal.tsx";
import InitializedMDXEditor from "@/components/common/initialized-mdxeditor.tsx";

export default function FaqPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const { isSupport, user, isLoggedIn } = useAuthStore();
  const { data, isLoading, mutate } = useSWR(
    `/api/faq?${searchParams.toString()}`,
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery) {
      setSearchParams((params) => {
        params.delete("search");

        return params;
      });
    } else {
      setSearchParams({ search: searchQuery });
    }
  };

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
    } catch (err) {
      addToast({
        title: "Произошла неизвестная ошибка. Попробуйте позже",
        color: "danger",
      });
    }
  };

  return (
    <div>
      <AddFaqModal
        isOpen={isOpen}
        mutate={mutate}
        onOpenChange={onOpenChange}
      />
      <div className={title()}>
        Раздел <span className={title({ color: "blue" })}>FAQ</span>
      </div>
      <div className={subtitle()}>Ответы на часто задаваемые вопросы</div>
      <div className="flex flex-row justify-between mb-5">
        <Form className="flex flex-row w-1/3 mb-3" onSubmit={onSubmit}>
          <Input
            className=""
            placeholder="Поиск по разделу"
            value={searchQuery}
            variant="bordered"
            onValueChange={(val) => setSearchQuery(val)}
          />
          <Button isIconOnly type="submit" variant="bordered">
            <SearchIcon />
          </Button>
        </Form>
        {isSupport && (
          <Button
            startContent={<PlusIcon color="currentColor" size={24} />}
            variant="bordered"
            onPress={onOpen}
          >
            Добавить элемент
          </Button>
        )}
      </div>
      {!isLoading && data.length == 0 && (
        <p className="italic font-light">Ничего не найдено</p>
      )}
      {!isLoading ? (
        <Accordion selectionMode="multiple" variant="splitted">
          {data.map((item: Faq) => (
            <AccordionItem
              key={item.id}
              disableIndicatorAnimation
              hideIndicator
              aria-label={`FAQ ${item.id}`}
              startContent={<InfoIcon />}
              subtitle="Нажмите для раскрытия"
              title={item.title}
            >
              <InitializedMDXEditor
                editorRef={null}
                markdown={item.content}
                plugins={[]}
                readOnly={true}
                suppressHtmlProcessing={true}
              />

              <div className="flex justify-between">
                <div className="flex items-center mt-5 gap-3">
                  <Button
                    color={
                      user && item.likes.includes(user?.id)
                        ? "primary"
                        : "default"
                    }
                    variant={
                      user && item.likes.includes(user?.id) ? "shadow" : "faded"
                    }
                    onPress={async () => await toggleLike(item.id)}
                  >
                    <LikeIcon /> {item.likes.length || ""}
                  </Button>
                  <span className="text-sm text-default-500">
                    Посчитали данный материал полезным?
                  </span>
                </div>
                <div className="flex items-center mt-5 gap-3">
                  <span className="text-sm text-default-900">
                    {item.author.firstName} {item.author.lastName}
                  </span>
                  <span className="text-sm text-default-500">
                    {!item.editedAt ? (
                      <span>
                        Добавлено {moment(item.createdAt).format("lll")}
                      </span>
                    ) : (
                      <span>
                        Обновлено {moment(item.editedAt).format("lll")}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex justify-center h-96 align-middle">
          <Spinner variant="simple" />
        </div>
      )}
    </div>
  );
}
