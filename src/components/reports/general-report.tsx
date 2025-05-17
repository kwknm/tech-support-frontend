import {
  ClockIcon,
  FileClockIcon,
  TicketCheckIcon,
  TicketPlusIcon,
  TicketsIcon,
  TicketXIcon,
} from "lucide-react";
import clsx from "clsx";
import useSWRImmutable from "swr/immutable";
import { memo } from "react";
import { Divider, Spinner } from "@heroui/react";
import moment from "moment/min/moment-with-locales";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import StatisticItem from "@/components/reports/statistic-item.tsx";
import { useTheme } from "@/hooks/use-theme.ts";
import { convertStatusToString, formatShortTime } from "@/lib/utils.tsx";

type Props = {
  startDate?: Date;
  endDate?: Date;
};

type GeneralReport = {
  ticketsCount: number;
  completedTickets: number;
  cancelledTickets: number;
  inProgressTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  newTicketsChartData: { name: string; value: number }[];
  ticketsByStatus: { name: string; value: number }[];
  ticketsByIssueType: { name: string; value: number }[];
};

const colors1 = ["#ae7ede", "#9353d3", "#7828c8", "#6020a0"].sort();
const colors2 = ["#74DFA2", "#45D483", "#17C964", "#12A150"].sort();

export default memo(function GeneralReport({ startDate, endDate }: Props) {
  const { isDark } = useTheme();

  const { data, isLoading } = useSWRImmutable<GeneralReport>(
    `/api/reports/general?startDate=${startDate}&endDate=${endDate}`,
  );

  console.log(data);

  if (isLoading) {
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
          <LineChart className="manrope font-medium" data={mappedChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" stroke={isDark ? "#D4D4D8" : "#71717A"} />
            <YAxis stroke={isDark ? "#D4D4D8" : "#71717A"} />
            <Tooltip wrapperClassName="rounded-md dark:text-black" />
            <Legend />
            <Line
              activeDot={{ r: 8 }}
              dataKey="tickets"
              dot={({ cx, cy, value }) => {
                if (value < 1) return <></>;

                return (
                  <circle
                    key={cx + cy}
                    cx={cx}
                    cy={cy}
                    fill={isDark ? "black" : "white"}
                    r={value > 0 ? 4 : 0}
                    stroke={value > 0 ? "#006FEE" : "transparent"}
                    strokeWidth={2}
                  />
                );
              }}
              name="Заявки"
              stroke="#006FEE"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
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
        <StatisticItem
          icon={<TicketsIcon className="text-primary" size={52} />}
          subtitle={data?.ticketsCount}
          title={"Всего заявок"}
        />

        <StatisticItem
          icon={<TicketCheckIcon className="text-success" size={52} />}
          subtitle={data?.completedTickets}
          title={"Закрытых заявок"}
        />

        <StatisticItem
          icon={<TicketPlusIcon className="text-primary" size={52} />}
          subtitle={data?.inProgressTickets}
          title={"Заявок в обработке"}
        />

        <StatisticItem
          icon={<TicketXIcon className="text-danger" size={52} />}
          subtitle={data?.cancelledTickets}
          title={"Отклоненных заявок"}
        />

        <StatisticItem
          icon={<ClockIcon className="text-default-500" size={52} />}
          subtitle={formatShortTime(data?.avgResponseTime!)}
          title={"Сред. время ответа"}
        />

        <StatisticItem
          icon={<FileClockIcon className="text-primary" size={52} />}
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
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              vertical={true}
            />
            <XAxis
              stroke={isDark ? "#D4D4D8" : "#71717A"}
              tickFormatter={(value) => value}
              type="number"
            />
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
              fill="#7828c8"
              name="Заявки"
              radius={[0, 5, 5, 0]}
            >
              {data?.ticketsByStatus.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors1[index % colors1.length]}
                />
              ))}
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
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              vertical={true}
            />
            <XAxis
              stroke={isDark ? "#D4D4D8" : "#71717A"}
              tickFormatter={(value) => value}
              type="number"
            />
            <YAxis
              dataKey="name"
              stroke={isDark ? "#D4D4D8" : "#71717A"}
              type="category"
              width={300}
            />
            <Tooltip wrapperClassName="rounded-md dark:text-black" />
            <Bar
              dataKey="value"
              fill="#7828c8"
              name="Заявки"
              radius={[0, 5, 5, 0]}
            >
              {data?.ticketsByStatus.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors2[index % colors2.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>
    </article>
  );
});
