import type { Case, CaseStatus, RecordType } from "./types";

const OPEN: CaseStatus[] = ["New", "Assigned", "In Progress", "Action Taken", "Reopened"];

export const isOpen = (c: Case) => OPEN.includes(c.status);
export const isAwaitingClosure = (c: Case) => c.status === "Pending Citizen Confirmation";
export const isNew = (c: Case) => c.status === "New";

export const filterByType = (cases: Case[], t: RecordType) =>
  cases.filter((c) => c.recordType === t);

export const countOpen = (cases: Case[]) => cases.filter(isOpen).length;
export const countByType = (cases: Case[], t: RecordType) =>
  filterByType(cases, t).filter(isOpen).length;

export const slaBreached = (c: Case) =>
  isOpen(c) && new Date(c.slaDue).getTime() < Date.now();

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const daysAgo = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.round(ms / 86400000));
};
