import clsx from "clsx";

type Props = {
  name: string;
  level?: number;
  matched?: boolean;
};

export const SkillTag = ({ name, level, matched }: Props) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm",
        matched === true && "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
        matched === false && "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
        matched === undefined && "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
      )}
    >
      <span>{name}</span>
      {typeof level === "number" ? <span className="text-xs opacity-70">{level}/5</span> : null}
    </span>
  );
};
