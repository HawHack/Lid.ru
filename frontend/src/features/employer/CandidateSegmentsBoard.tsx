import type { Candidate, CandidateStatus } from "@/entities/vacancy/types";
import { CandidateStatusSelect } from "@/features/employer/CandidateStatusSelect";
import { SkillTag } from "@/shared/ui/SkillTag";
import { useTranslation } from "react-i18next";

type Props = {
  candidate?: Candidate;
  candidates?: Candidate[];
  onStatusChange: (candidateId: number, status: CandidateStatus) => void;
};

export const CandidateSegmentsBoard = ({
  candidate,
  candidates = [],
  onStatusChange,
}: Props) => {
  const { t } = useTranslation();

  const items = candidate ? [candidate] : candidates;
  const strong = items.filter((item) => item.matchScore >= 75);
  const medium = items.filter((item) => item.matchScore >= 45 && item.matchScore < 75);
  const weak = items.filter((item) => item.matchScore < 45);

  const sections = [
    { key: "strong", title: t("strongMatch"), items: strong },
    { key: "medium", title: t("mediumMatch"), items: medium },
    { key: "weak", title: t("weakMatch"), items: weak },
  ] as const;

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">{t("candidateSegments")}</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {sections.map((section) => (
          <section
            key={section.key}
            className="rounded-2xl border p-4 bg-white dark:bg-neutral-900 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="font-medium">{section.title}</div>
              <span className="text-xs px-2 py-1 rounded-full border">
                {section.items.length}
              </span>
            </div>

            <div className="grid gap-3">
              {section.items.length === 0 ? (
                <div className="rounded-xl border p-3 text-sm text-neutral-500">
                  {t("noCandidatesYet")}
                </div>
              ) : (
                section.items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border p-3 bg-neutral-50 dark:bg-neutral-950"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-neutral-500 mt-1">
                          {item.title}
                        </div>
                      </div>

                      <div className="text-sm font-semibold">{item.matchScore}%</div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.skills.slice(0, 5).map((skill) => (
                        <SkillTag
                          key={`${item.id}-${skill.id ?? skill.name}-${skill.name}`}
                          name={skill.name}
                          level={skill.level}
                          matched={skill.matched}
                        />
                      ))}
                    </div>

                    <div className="mt-3">
                      <CandidateStatusSelect
                        value={item.status}
                        onChange={(status) => onStatusChange(item.id, status)}
                      />
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};