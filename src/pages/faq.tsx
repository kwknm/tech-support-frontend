import { Button, Form, Input, useDisclosure } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import useSWR from "swr";
import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { subtitle, title } from "@/components/primitives.ts";
import { SearchIcon } from "@/components/icons.tsx";
import { useAuthStore } from "@/hooks/use-auth-store.ts";
import AddFaqModal from "@/components/faq/add-faq-modal.tsx";
import FaqList from "@/components/faq/faq-list.tsx";
import { Faq } from "@/types";

export default function FaqPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const { isSupport } = useAuthStore();
  const { data, isLoading, mutate } = useSWR<Faq[]>(
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
      <FaqList isLoading={isLoading} items={data} mutate={mutate} />
    </div>
  );
}
