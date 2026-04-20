type Props = {
  title: string;
  value: number;
  description?: string;
};

export const ProgressStatCard = ({ title, value, description }: Props) => {
  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-neutral-900 shadow-sm">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}%</div>

      <div className="mt-4 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400"
          style={{ width: `${Math.max(6, Math.min(value, 100))}%` }}
        />
      </div>

      {description && (
        <div className="text-xs text-neutral-500 mt-3">{description}</div>
      )}
    </div>
  );
};