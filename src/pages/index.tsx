import { Snippet } from "@heroui/react";
import { Code } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { Link } from "react-router-dom";

import { title, subtitle } from "@/components/primitives";

export default function IndexPage() {
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
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
            to={"/tickets"}
          >
            Оставить заявку
          </Link>
        </div>

        <div className="mt-4">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Часто задаваемые вопросы вы можете найти в разделе &nbsp;
              <Code color="primary">FAQ</Code>
            </span>
          </Snippet>
        </div>
      </section>
    </>
  );
}
