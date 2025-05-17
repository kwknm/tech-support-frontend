import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string | ReactNode;
  subtitle: string | ReactNode;
};

export default function StatisticItem({ title, subtitle }: Props) {
  return (
    <div className="max-w-[150px] shadow-none rounded-lg dark: border-default-200 text-center">
      <p className="text-md">{title}</p>
      <h2 className="font-semibold text-3xl">{subtitle}</h2>
    </div>
  );
}
