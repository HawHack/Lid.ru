import type { CandidateStatus } from "@/entities/vacancy/types";

type Props = {
  value: CandidateStatus;
  onChange: (status: CandidateStatus) => void;
};

const options: { value: CandidateStatus; label: string }[] = [
  { value: "applied", label: "Отклик получен" },
  { value: "interview", label: "Интервью" },
  { value: "offer", label: "Оффер" },
  { value: "rejected", label: "Отклонён" },
];

export const CandidateStatusSelect = ({ value, onChange }: Props) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CandidateStatus)}
      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-200"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
