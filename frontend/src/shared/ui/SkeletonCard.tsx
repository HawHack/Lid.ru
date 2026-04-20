export const SkeletonCard = () => {
  return (
    <div className="rounded-2xl border p-4 bg-white dark:bg-neutral-900 shadow-sm animate-pulse">
      <div className="h-5 w-40 rounded bg-neutral-200 dark:bg-neutral-800 mb-3" />
      <div className="h-4 w-28 rounded bg-neutral-200 dark:bg-neutral-800 mb-4" />
      <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
      <div className="h-3 w-4/5 rounded bg-neutral-200 dark:bg-neutral-800 mb-4" />
      <div className="flex gap-2">
        <div className="h-8 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-8 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
};