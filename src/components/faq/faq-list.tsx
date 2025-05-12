import { Spinner } from "@heroui/react";
import { KeyedMutator } from "swr";

import { Faq } from "@/types";
import FaqItem from "@/components/faq/faq-item.tsx";

type Props = {
  items?: Faq[];
  isLoading: boolean;
  mutate: KeyedMutator<Faq[]>;
};

export default function FaqList({ items, isLoading, mutate }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center h-96 align-middle">
        <Spinner variant="simple" />
      </div>
    );
  }

  if ((items?.length === 0 && !isLoading) || !items) {
    return <p className="italic font-light">Ничего не найдено</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item: Faq) => (
        <FaqItem
          key={item.id}
          author={item.author}
          authorId={item.authorId}
          content={item.content}
          createdAt={item.createdAt}
          editedAt={item.editedAt}
          id={item.id}
          likes={item.likes}
          mutate={mutate}
          title={item.title}
        />
      ))}
    </div>
  );
}
