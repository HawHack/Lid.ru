import { useThemeStore } from "@/app/store/useThemeStore";
import { useEffect } from "react";

export const ThemeToggle = () => {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-[#dbe4f2] transition hover:bg-white/10"
      title={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
    >
      {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
    </button>
  );
};