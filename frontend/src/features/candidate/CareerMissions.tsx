import { useTranslation } from "react-i18next";
import type { CareerMission } from "@/features/candidate/growth";

type Props = {
  missions: CareerMission[];
};

const stateStyles: Record<CareerMission["state"], string> = {
  done: "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-800",
  in_progress:
    "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800",
  not_started:
    "bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700",
};

const stateKeys: Record<CareerMission["state"], string> = {
  done: "missionDone",
  in_progress: "missionInProgress",
  not_started: "missionNotStarted",
};

export const CareerMissions = ({ missions }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-neutral-900 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{t("careerMissions")}</h2>
        <p className="text-sm text-neutral-500 mt-1">{t("weeklyFocus")}</p>
      </div>

      <div className="grid gap-3">
        {missions.map((mission) => {
          const percent = Math.round((mission.progress / mission.target) * 100);

          return (
            <div
              key={mission.id}
              className="rounded-xl border p-4 bg-neutral-50 dark:bg-neutral-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid gap-2 flex-1">
                  <div className="font-medium">
                    {t(mission.titleKey, mission.value ? { count: mission.value } : {})}
                  </div>

                  <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
                      style={{ width: `${Math.max(percent, mission.progress > 0 ? 12 : 4)}%` }}
                    />
                  </div>

                  <div className="text-xs text-neutral-500">
                    {mission.progress}/{mission.target}
                  </div>
                </div>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${stateStyles[mission.state]}`}
                >
                  {t(stateKeys[mission.state])}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};