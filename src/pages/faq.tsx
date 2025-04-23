import {
  Accordion,
  AccordionItem,
  Button,
  Form,
  Input,
  Spinner,
} from "@heroui/react";
import { InfoIcon } from "lucide-react";
import useSWR from "swr";
import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { subtitle, title } from "@/components/primitives.ts";
import { Faq } from "@/types";
import { SearchIcon } from "@/components/icons.tsx";
import { useAuthStore } from "@/hooks/use-auth-store.ts";

export default function FaqPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const { isSupport } = useAuthStore();
  const { data, isLoading, mutate } = useSWR(
    `/api/faq?${searchParams.toString()}`,
  );

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

  return (
    <div>
      <div className={title()}>
        Раздел <span className={title({ color: "blue" })}>FAQ</span>
      </div>
      <div className={subtitle()}>Ответы на часто задаваемые вопросы</div>
      <div className="flex flex-row justify-between">
        <Form className="flex flex-row mb-3" onSubmit={onSubmit}>
          <Input
            className="max-w-sm"
            placeholder="Поиск по разделу"
            value={searchQuery}
            variant="bordered"
            onValueChange={(val) => setSearchQuery(val)}
          />
          <Button isIconOnly type="submit" variant="bordered">
            <SearchIcon />
          </Button>
        </Form>
        {isSupport && <Button variant="bordered">Добавить элемент</Button>}
      </div>
      {!isLoading && data.length == 0 && (
        <p className="italic font-light">Ничего не найдено</p>
      )}
      {!isLoading ? (
        <Accordion>
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
              {item.content}
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
