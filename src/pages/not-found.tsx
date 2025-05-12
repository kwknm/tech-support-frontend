import { Link } from "@heroui/react";

import { ExternalIcon } from "@/components/icons.tsx";

export default function NotFound() {
  return (
    <>
      <div className={"font-light text-xl"}>Страница не найдена...</div>
      <Link href={"/"}>
        На главную <ExternalIcon />
      </Link>
    </>
  );
}
