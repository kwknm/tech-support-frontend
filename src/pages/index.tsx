import { Snippet } from "@heroui/react";
import { Code } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { Link } from "react-router-dom";
import { ClipboardListIcon } from "lucide-react";

import { title, subtitle } from "@/components/primitives";
import { useAuthStore } from "@/hooks/use-auth-store.ts";

export default function IndexPage() {
  const { isSupport } = useAuthStore();

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Служба&nbsp;</span>
          <span className={title({ color: "violet" })}>
            технической поддержки&nbsp;
          </span>
          <br />
          <span className={title()}>пользователей</span>
          <div className={subtitle({ class: "mt-4" })}>
            Если у вас есть вопросы, мы всегда на связи
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            className={
              buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                size: "lg",
              }) + " hover:scale-110"
            }
            to={"/tickets"}
          >
            <ClipboardListIcon />
            {isSupport ? "К заявкам" : "Оставить заявку"}
          </Link>
        </div>

        <div className="mt-4">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Часто задаваемые вопросы вы можете найти в разделе &nbsp;
              <Link to={"/faq"}>
                <Code color="primary">FAQ</Code>
              </Link>
            </span>
          </Snippet>
        </div>
      </section>
    </>
  );
}
