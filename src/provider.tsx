import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { ToastProvider } from "@heroui/toast";
import React from "react";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} spinnerVariant="dots" useHref={useHref}>
      <ToastProvider placement={"top-center"} toastProps={{ timeout: 2500 }} />
      {children}
    </HeroUIProvider>
  );
}
