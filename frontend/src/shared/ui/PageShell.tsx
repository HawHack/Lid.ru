import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const PageShell = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-transparent text-slate-950 dark:text-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
};
