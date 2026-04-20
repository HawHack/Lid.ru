type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
};

export const SectionTitle = ({ eyebrow, title, subtitle, description }: Props) => {
  const text = subtitle ?? description;

  return (
    <div className="grid gap-2">
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {eyebrow}
        </div>
      ) : null}

      <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
        {title}
      </h1>

      {text ? (
        <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
          {text}
        </p>
      ) : null}
    </div>
  );
};
