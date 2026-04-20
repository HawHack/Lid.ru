import i18n from "@/i18n";

export const tStatus = (status: string) => {
  const map: Record<string, string> = {
    new: "statusNew",
    reviewing: "statusReviewing",
    interview: "statusInterview",
    rejected: "statusRejected",
    hired: "statusHired",
    pending: "statusPending",
    approved: "statusApproved",
  };

  return i18n.t(map[status] || status);
};