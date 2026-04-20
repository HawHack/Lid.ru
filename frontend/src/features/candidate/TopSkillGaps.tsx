import type { SkillGapItem } from "./growth";

type Props = {
  items: SkillGapItem[];
};

export const TopSkillGaps = ({ items }: Props) => {
  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-neutral-900 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Top skill gaps</h2>
      <p className="text-sm text-neutral-500 mb-4">
        Skills that appear most often in your saved vacancies as missing.
      </p>

      {items.length === 0 ? (
        <div className="text-neutral-500">
          No major gaps detected in your current shortlist.
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item.name} className="grid gap-1">
              <div className="flex items-center justify-between text-sm">
                <span>{item.name}</span>
                <span className="text-neutral-500">{item.count} roles</span>
              </div>

              <div className="h-2 rounded bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-2 rounded bg-gradient-to-r from-red-500 to-orange-400"
                  style={{ width: `${Math.min(item.count * 20, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};