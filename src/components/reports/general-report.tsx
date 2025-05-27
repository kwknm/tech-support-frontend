import clsx from "clsx";
import useSWRImmutable from "swr/immutable";
import { memo } from "react";
import { Divider, Spinner } from "@heroui/react";
import moment from "moment/min/moment-with-locales";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@heroui/use-theme";

import StatisticItem from "@/components/reports/statistic-item.tsx";
import { convertStatusToString, formatShortTime } from "@/lib/utils.tsx";
import { GeneralReport } from "@/types";

type Props = {
  startDate?: Date;
  endDate?: Date;
};

const colors1 = ["#ae7ede", "#9353d3", "#7828c8", "#6020a0"].sort();
const colors2 = ["#74DFA2", "#45D483", "#17C964", "#12A150"].sort();

export default memo(function GeneralReport({ startDate, endDate }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading } = useSWRImmutable<GeneralReport>(
    `/api/reports/general?startDate=${startDate}&endDate=${endDate}`,
  );

  if (isLoading || !data) {
    return (
      <div className="h-[100%] flex justify-center items-center p-5">
        <Spinner label="Загружаем данные..." />
      </div>
    );
  }

  const mappedChartData = data?.newTicketsChartData.map((x) => ({
    date: moment(x.name).format("Do MMM"),
    tickets: x.value,
  }));

  return (
    <article>
      <header className="p-5">
        <p className="text-default-500 mb-2 text-sm">
          Статистика по новым заявкам в системе
        </p>
        <ResponsiveContainer height={300} width={"100%"}>
          <AreaChart className="manrope font-medium" data={mappedChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" stroke={isDark ? "#D4D4D8" : "#71717A"} />
            <YAxis stroke={isDark ? "#D4D4D8" : "#71717A"} />
            <Tooltip wrapperClassName="rounded-md dark:text-black" />
            <Legend />
            <Area
              animationDuration={1000}
              dataKey="tickets"
              fill="#0083ee"
              name="Заявки"
              stroke="#006FEE"
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
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
        <StatisticItem subtitle={data?.ticketsCount} title={"Всего заявок"} />

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

        <StatisticItem
          subtitle={formatShortTime(data?.avgResponseTime!)}
          title={"Сред. время ответа"}
        />

        <StatisticItem
          subtitle={formatShortTime(data?.avgResolutionTime!)}
          title={"Сред. время решения заявки"}
        />
      </section>
      <Divider />
      <section className={clsx("p-5")}>
        <p className="text-default-500 mb-2 text-sm">
          Статистика заявок по статусу
        </p>
        <ResponsiveContainer className="p-5" height={250} width={"100%"}>
          <BarChart
            className="manrope font-medium"
            data={data?.ticketsByStatus}
            layout="vertical"
          >
            <XAxis hide type="number" />
            <YAxis
              dataKey="name"
              stroke={isDark ? "#D4D4D8" : "#71717A"}
              tickFormatter={(label) => convertStatusToString(label)}
              type="category"
            />
            <Tooltip
              labelFormatter={(label, _) => convertStatusToString(label)}
              wrapperClassName="rounded-md dark:text-black"
            />
            <Bar
              dataKey="value"
              fill={colors1[0]}
              name="Заявки"
              radius={[0, 5, 5, 0]}
            >
              {data?.ticketsByStatus.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors1[index % colors1.length]}
                />
              ))}
              <LabelList dataKey="value" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>
      <Divider />
      <section className={clsx("p-5")}>
        <p className="text-default-500 mb-2 text-sm">
          Статистика заявок по типу проблемы
        </p>
        <ResponsiveContainer className="p-5" height={250} width={"100%"}>
          <BarChart
            className="manrope font-medium"
            data={data?.ticketsByIssueType}
            layout="vertical"
          >
            <XAxis hide type="number" />
            <YAxis
              dataKey="name"
              stroke={isDark ? "#D4D4D8" : "#71717A"}
              type="category"
              width={300}
            />
            <Tooltip wrapperClassName="rounded-md dark:text-black" />
            <Bar
              dataKey="value"
              fill={colors2[0]}
              name="Заявки"
              radius={[0, 5, 5, 0]}
            >
              {data?.ticketsByStatus.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors2[index % colors2.length]}
                />
              ))}
              <LabelList dataKey="value" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>
    </article>
  );
});
