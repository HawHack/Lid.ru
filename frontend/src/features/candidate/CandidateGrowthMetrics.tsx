type Metric = {
  label: string;
  value: string | number;
  hint?: string;
};

type Props = {
  items: Metric[];
};

export const CandidateGrowthMetrics = ({ items }: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border p-5 bg-white dark:bg-neutral-900 shadow-sm"
        >
          <div className="text-sm text-neutral-500">{item.label}</div>
          <div className="text-3xl font-bold mt-2">{item.value}</div>
          {item.hint && (
            <div className="text-xs text-neutral-500 mt-2">{item.hint}</div>
          )}
        </div>
      ))}
    </div>
  );
};