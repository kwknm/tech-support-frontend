import { ReactNode } from "react";
import { Link } from "@heroui/react";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="bg-gray-100 w-full p-5 mt-10 dark:bg-zinc-900">
        &copy; 2025 Tech.Support | КПИЯП{" "}
        <Link href="https://github.com/kwknm/tech-support-frontend">
          https://github.com/kwknm/tech-support-frontend
        </Link>
      </footer>
    </div>
  );
}
