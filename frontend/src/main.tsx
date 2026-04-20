import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import "./index.css";
import "./i18n/index";
import { useThemeStore } from "@/app/store/useThemeStore";
import { ToastViewport } from "@/shared/ui/ToastViewport";
import { ENV } from "@/shared/config/env";

async function enableMocking() {
  if (import.meta.env.DEV && ENV.ENABLE_MSW) {
    const { worker } = await import("./mocks/browser");
    await worker.start();
  }
}

const theme = useThemeStore.getState().theme;
document.documentElement.classList.remove("light", "dark");
document.documentElement.classList.add(theme);

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
      <ToastViewport />
    </React.StrictMode>
  );
});
