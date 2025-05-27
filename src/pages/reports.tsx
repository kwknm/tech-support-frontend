import {
  Button,
  Card,
  CardBody,
  DateRangePicker,
  Tab,
  Tabs,
} from "@heroui/react";
import clsx from "clsx";
import { Chip } from "@heroui/chip";
import { CalendarIcon, ChartAreaIcon, ChartColumn } from "lucide-react";
import { ReactNode, useState } from "react";
import moment from "moment/min/moment-with-locales";
import { parseDate } from "@internationalized/date";

import { title } from "@/components/primitives.ts";
import GeneralReport from "@/components/reports/general-report.tsx";
import PersonalReport from "@/components/reports/personal-report.tsx";

export default function ReportsPage() {
  const [filterRangeDate, setFilterRangeDate] = useState<{
    start: any;
    end: any;
  } | null>(null);

  const setFilterDate = (days: number | null) => {
    if (days == null) {
      setFilterRangeDate(null);

      return;
    }
    const targetDate = moment().subtract(days, "days").format("YYYY-MM-DD");
    const now = moment().format("YYYY-MM-DD");

    setFilterRangeDate({
      start: parseDate(targetDate),
      end: parseDate(now),
    });
  };

  return (
    <div>
      <div className={title()}>
        Страница <span className={title({ color: "violet" })}>отчётности</span>
      </div>
      <section className={clsx("flex", "mt-10", "flex-col", "gap-5")}>
        <div className={clsx("flex flex-row", "gap-5", "items-center")}>
          <div className={clsx("flex flex-col", "gap-1")}>
            <DateRangePicker
              aria-label="Временной период"
              className={clsx("max-w-xs")}
              label="Временной период выборки"
              labelPlacement="outside"
              value={filterRangeDate}
              variant="bordered"
              onChange={(dateRange) => {
                setFilterRangeDate(dateRange);
              }}
            />
            <div className={clsx("flex flex-row", "gap-1")}>
              <Chip
                as={Button}
                color="primary"
                radius="sm"
                size="sm"
                startContent={<CalendarIcon size={16} />}
                variant="flat"
                onPress={() => setFilterDate(7)}
              >
                7 дней
              </Chip>
              <Chip
                as={Button}
                color="primary"
                radius="sm"
                size="sm"
                startContent={<CalendarIcon size={16} />}
                variant="flat"
                onPress={() => setFilterDate(30)}
              >
                30 дней
              </Chip>
              <Chip
                as={Button}
                color="primary"
                radius="sm"
                size="sm"
                startContent={<CalendarIcon size={16} />}
                variant="flat"
                onPress={() => setFilterDate(null)}
              >
                Все время
              </Chip>
            </div>
          </div>
        </div>
        <Tabs isVertical aria-label="Reports" variant="bordered">
          <Tab
            key="general"
            className="w-full justify-start"
            title={
              <div className="flex items-center space-x-2">
                <ChartColumn size={20} />
                <span>Общее</span>
              </div>
            }
          >
            <TabContent>
              <GeneralReport
                endDate={filterRangeDate?.end}
                startDate={filterRangeDate?.start}
              />
            </TabContent>
          </Tab>
          <Tab
            key="personal"
            className="w-full justify-start"
            title={
              <div className="flex items-center space-x-2">
                <ChartAreaIcon size={20} />
                <span>Персональное</span>
              </div>
            }
          >
            <TabContent>
              <PersonalReport
                endDate={filterRangeDate?.end}
                startDate={filterRangeDate?.start}
              />
            </TabContent>
          </Tab>
        </Tabs>
      </section>
    </div>
  );
}

const TabContent = ({ children }: { children: string | ReactNode }) => {
  return (
    <Card
      fullWidth
      className="shadow-none border-2 p-0 rounded-lg dark:bg-transparent dark:border-content2"
      radius="sm"
    >
      <CardBody className="p-0">{children}</CardBody>
    </Card>
  );
};
