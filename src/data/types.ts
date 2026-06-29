// Shared in-memory data model for Citizen Pulse.
// Records hold reference ids (e.g. citizenId) — never embedded copies.

export type Id = string;

export type Ward =
  | "Whitefield"
  | "KR Puram"
  | "Mahadevapura"
  | "Marathahalli"
  | "Bellandur";

export const WARDS: Ward[] = [
  "Whitefield",
  "KR Puram",
  "Mahadevapura",
  "Marathahalli",
  "Bellandur",
];

export type Channel =
  | "Walk-in"
  | "WhatsApp"
  | "Call"
  | "Email"
  | "Social";

export type RecordType =
  | "Grievance"
  | "SchemeRequest"
  | "RecommendationRequest"
  | "Emergency"
  | "GeneralEnquiry";

export type CaseStatus =
  | "New"
  | "Assigned"
  | "In Progress"
  | "Action Taken"
  | "Pending Citizen Confirmation"
  | "Resolved"
  | "Reopened"
  | "Auto-Closed";

export type Priority = "High" | "Medium" | "Low";

export type Category =
  | "Water"
  | "Roads"
  | "Electricity"
  | "Sanitation"
  | "Health"
  | "Education"
  | "Police"
  | "Land/Revenue"
  | "Pension/Ration"
  | "Housing"
  | "Civic/BBMP"
  | "Other";

export interface Department {
  id: Id;
  name: string;
  short: string;
}

export interface Scheme {
  id: Id;
  name: string;
  portal: string;
  departmentId: Id;
}

export interface Staff {
  id: Id;
  name: string;
  role: string;
  desk: Category | "General" | "Emergency" | "Scheme" | "Letters";
}

export interface Template {
  id: Id;
  name: string;
  recipientType: "Officer" | "Department" | "Citizen" | "Other";
  body: string;
}

export interface Citizen {
  id: Id;
  name: string;
  family: { name: string; relation: string }[];
  address: string;
  ward: Ward;
  mobiles: string[];
  affiliationNote?: string;
}

export interface Case {
  id: Id;
  recordType: RecordType;
  channel: Channel;
  status: CaseStatus;
  citizenId: Id;
  wardId: Ward;
  category: Category;
  departmentId?: Id;
  officerId?: Id;
  ownerId: Id; // Staff
  priority: Priority;
  slaDue: string; // ISO date
  resolutionAction?: string;
  satisfaction?: number; // 1-5
  description: string;
  createdAt: string; // ISO
  classification?: string[]; // AI tags (Inbox)
  resolvedAt?: string;
}

export interface Contact {
  id: Id;
  name: string;
  role: string;
  category: "Corporator" | "Journalist" | "Community" | "Donor" | "Other";
  tier: "VIP" | "Key" | "Regular";
  phone?: string;
}

export interface Organisation {
  id: Id;
  name: string;
  area: Ward;
  officeBearers: { name: string; role: string }[];
  influence: "High" | "Medium" | "Low";
  relationshipHealth: "Strong" | "Neutral" | "Strained";
  pendingIssues?: string[];
}

export interface Officer {
  id: Id;
  name: string;
  designation: string;
  departmentId: Id;
  jurisdiction: Ward | "Constituency";
  phone: string;
  email: string;
  tenure: string;
  responsiveness: number; // 1-5
  transferHistory: { date: string; from: string; to: string }[];
}

export interface Letter {
  id: Id;
  templateType: string;
  recipientType: "Officer" | "Department" | "Citizen" | "Other";
  caseId?: Id;
  citizenId?: Id;
  officerId?: Id;
  commitmentId?: Id;
  subject: string;
  body: string;
  status: "Draft" | "Approved" | "Dispatched" | "Acknowledged";
  dispatchMode: "Post" | "Hand" | "Email" | "WhatsApp";
  dispatchNo?: string;
  date: string;
}

export interface Commitment {
  id: Id;
  text: string;
  type: "Public" | "Private" | "Letter" | "Event";
  madeBy: string;
  toWhomId?: Id; // citizen or org
  location?: string;
  eventId?: Id;
  caseId?: Id;
  dueDate: string;
  status: "Open" | "In Progress" | "Fulfilled" | "Lapsed";
  responsibleStaffId?: Id;
  closureProof?: string;
}

export interface Event {
  id: Id;
  name: string;
  type: string;
  date: string;
  location: string;
  organiserId?: Id; // org or contact
  stage: "Planned" | "Confirmed" | "Live" | "Closed";
}

export interface Demand {
  id: Id;
  type: string;
  ward: Ward;
  requestedBy: string;
  impact: "High" | "Medium" | "Low";
  classification: string[];
  status: "New" | "Triaged" | "In Plan" | "Sanctioned" | "Rejected";
  projectId?: Id;
}

export interface Project {
  id: Id;
  name: string;
  ward: Ward;
  sanctioned: number;
  spent: number;
  status: "Sanctioned" | "Ongoing" | "Delayed" | "Completed";
  fundsSource: "MPLADS" | "MLA" | "BBMP" | "State" | "Other";
  demandId?: Id;
}

export interface DeptFile {
  id: Id;
  refNo: string;
  subject: string;
  departmentId: Id;
  officerId?: Id;
  caseId?: Id;
  submittedDate: string;
  lastFollowUp: string;
  bottleneck?: string;
  escalationLevel: 1 | 2 | 3;
  status: "Pending" | "Moved" | "Returned" | "Closed";
}

export interface DataState {
  departments: Department[];
  schemes: Scheme[];
  staff: Staff[];
  templates: Template[];
  citizens: Citizen[];
  cases: Case[];
  contacts: Contact[];
  organisations: Organisation[];
  officers: Officer[];
  letters: Letter[];
  commitments: Commitment[];
  events: Event[];
  demands: Demand[];
  projects: Project[];
  deptFiles: DeptFile[];
}
