import { ArrowDown, ArrowUp } from "lucide-react";
import clsx from "clsx";
import useSWRImmutable from "swr/immutable";
import { memo } from "react";
import { Divider, Progress, Spinner } from "@heroui/react";

import StatisticItem from "@/components/reports/statistic-item.tsx";
import { PersonalReport } from "@/types";
import { formatShortTime } from "@/lib/utils.tsx";

type Props = {
  startDate?: Date;
  endDate?: Date;
};

type ProgressProps = {
  label: string;
  personalValue: number;
  generalValue: number;
  color:
    | "primary"
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
};

const ProgressValueCard = ({
  label,
  personalValue,
  generalValue,
  color,
}: ProgressProps) => {
  return (
    <div
      className={clsx(
        "flex",
        "gap-3",
        "flex-col",
        "border-2",
        "rounded-md",
        "p-3",
        "w-full",
        "dark:border-content2",
      )}
    >
      <Progress
        color={color}
        label={label + " (Вы)"}
        maxValue={Math.max(personalValue, generalValue) / (2 / 3)}
        showValueLabel={true}
        size="sm"
        value={personalValue}
        valueLabel={
          <DifferenceLabel
            generalValue={generalValue}
            personalValue={personalValue}
          />
        }
      />
      <Progress
        color={color}
        label={label + " (Общее)"}
        maxValue={Math.max(personalValue, generalValue) / (2 / 3)}
        showValueLabel={true}
        size="sm"
        value={generalValue}
        valueLabel={formatShortTime(generalValue)}
      />
    </div>
  );
};

const DifferenceLabel = ({
  personalValue,
  generalValue,
}: {
  personalValue: number;
  generalValue: number;
}) => {
  return (
    <span className="flex flex-row items-center gap-2">
      {formatShortTime(personalValue)}
      {personalValue < generalValue ? (
        <span
          className={"text-success font-semibold flex items-center flex-row"}
        >
          <ArrowDown size={18} strokeWidth={3} />
          {formatShortTime(Math.abs(personalValue - generalValue))} (
          {calculatePercentageDifference(personalValue, generalValue)})
        </span>
      ) : (
        <span
          className={"text-danger font-semibold flex items-center flex-row"}
        >
          <ArrowUp size={18} strokeWidth={3} />
          {formatShortTime(Math.abs(generalValue - personalValue))} (
          {calculatePercentageDifference(personalValue, generalValue)})
        </span>
      )}
    </span>
  );
};

export default memo(function PersonalReport({ startDate, endDate }: Props) {
  const { data, isLoading } = useSWRImmutable<PersonalReport>(
    `/api/reports/personal?startDate=${startDate}&endDate=${endDate}`,
  );

  if (isLoading || !data) {
    return (
      <div className="h-[100%] flex justify-center items-center p-5">
        <Spinner label="Загружаем данные..." />
      </div>
    );
  }

  return (
    <article>
      <header className="p-5">
        <p className="text-default-500 text-sm mb-3">
          Ваши показатели в сравнении с общими
        </p>
        <div className={clsx("flex", "gap-3", "flex-col")}>
          <ProgressValueCard
            color={"primary"}
            generalValue={data.avgResponseTimeGeneral}
            label={"Среднее время ответа"}
            personalValue={data.avgResponseTimePersonal}
          />
          <ProgressValueCard
            color={"secondary"}
            generalValue={data.avgResolutionTimeGeneral}
            label={"Среднее время решения заявки"}
            personalValue={data.avgResolutionTimePersonal}
          />
        </div>
      </header>
      <Divider />
      <section
        className={clsx(
          "flex",
          "flex-row",
          "gap-5",
          "flex-wrap",
          "p-5",
          "justify-evenly",
          "items-center",
        )}
      >
        <StatisticItem
          subtitle={data?.ticketsCount}
          title={"Всего заявок за период"}
        />

        <StatisticItem
          subtitle={data?.completedTickets}
          title={"Закрытых заявок"}
        />

        <StatisticItem
          subtitle={data?.inProgressTickets}
          title={"Заявок в обработке"}
        />

        <StatisticItem
          subtitle={data?.cancelledTickets}
          title={"Отклоненных заявок"}
        />
      </section>
    </article>
  );
});

function calculatePercentageDifference(oldValue: number, newValue: number) {
  if (oldValue === 0) {
    return "";
  }
  const difference = ((newValue - oldValue) / oldValue) * 100;

  return `${difference > 0 ? "-" : "+"}${Math.round(Math.abs(difference))}%`;
}
