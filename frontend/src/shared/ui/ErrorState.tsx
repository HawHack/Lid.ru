import { useTranslation } from "react-i18next";

type Props = {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
};

export const ErrorState = ({ title, description, actionText, onAction }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="grid gap-2">
        <h2 className="text-lg font-semibold">{title ?? t("somethingWentWrong")}</h2>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {description ?? t("pleaseTryAgain")}
        </p>
      </div>

      {actionText && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  );
};
