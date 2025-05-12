import { TicketIcon } from "@/components/icons.tsx";
import { convertStatusToTag } from "@/lib/utils.tsx";

type Props = {
  id: number;
  title: string;
  issuer: { firstName: string; lastName: string };
  status: number;
};

export default function TicketHeader({ id, title, issuer, status }: Props) {
  return (
    <section className="flex flex-col gap-7">
      <div className="flex w-full gap-2">
        <TicketIcon />
        <h2 className="text-2xl font-light">Заявка #{id}</h2>
      </div>
      <div className="flex gap-3 items-baseline">
        <h1 className="text-4xl">{title}</h1>
        <p className="text-2xl font-light text-gray-600 dark:text-gray-300">
          {issuer.firstName} {issuer.lastName}
        </p>
        {convertStatusToTag(status, "lg")}
      </div>
    </section>
  );
}
