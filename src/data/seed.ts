import type { DataState } from "./types";

// Helper: ISO date N days from today (negative = past)
const d = (offset: number) => {
  const x = new Date();
  x.setDate(x.getDate() + offset);
  return x.toISOString();
};

const departments = [
  { id: "DEP-BWSSB", name: "Bangalore Water Supply & Sewerage Board", short: "BWSSB" },
  { id: "DEP-BBMP", name: "Bruhat Bengaluru Mahanagara Palike", short: "BBMP" },
  { id: "DEP-BESCOM", name: "Bangalore Electricity Supply Company", short: "BESCOM" },
  { id: "DEP-POLICE", name: "Bengaluru City Police", short: "Police" },
  { id: "DEP-HEALTH", name: "Karnataka Health Department", short: "Health" },
  { id: "DEP-EDU", name: "Education Department", short: "DDPI" },
  { id: "DEP-REV", name: "Revenue Department", short: "Revenue" },
  { id: "DEP-SW", name: "Social Welfare Department", short: "Soc. Welfare" },
] as const;

const schemes = [
  { id: "SCH-PMAY", name: "PMAY (Housing)", portal: "pmaymis.gov.in", departmentId: "DEP-BBMP" },
  { id: "SCH-AYUSH", name: "Ayushman Bharat", portal: "pmjay.gov.in", departmentId: "DEP-HEALTH" },
  { id: "SCH-PENSION", name: "Widow / Old-Age Pension", portal: "sevasindhu.karnataka.gov.in", departmentId: "DEP-SW" },
  { id: "SCH-SCHOLAR", name: "Post-Matric Scholarship", portal: "ssp.postmatric.karnataka.gov.in", departmentId: "DEP-EDU" },
];

const staff: DataState["staff"] = [
  { id: "STF-1", name: "Suresh Gowda", role: "Water Desk", desk: "Water" },
  { id: "STF-2", name: "Anita Reddy", role: "Police Desk", desk: "Police" },
  { id: "STF-3", name: "Ravi Kumar", role: "Roads Desk", desk: "Roads" },
  { id: "STF-4", name: "Priya Menon", role: "Sanitation Desk", desk: "Sanitation" },
  { id: "STF-5", name: "Rakesh Nair", role: "Electricity Desk", desk: "Electricity" },
  { id: "STF-6", name: "Deepa Shetty", role: "Health Desk", desk: "Health" },
  { id: "STF-7", name: "Manjula Iyer", role: "Education Desk", desk: "Education" },
  { id: "STF-8", name: "Lakshmi Rao", role: "Land/Revenue Desk", desk: "Land/Revenue" },
  { id: "STF-9", name: "Harish Bhat", role: "General Desk", desk: "General" },
  { id: "STF-10", name: "Kavya Hegde", role: "Letters Desk", desk: "Letters" },
  { id: "STF-11", name: "Imran Khan", role: "Emergency Desk", desk: "Emergency" },
  { id: "STF-12", name: "Geetha Iyer", role: "Scheme Desk", desk: "Scheme" },
];

const officers: DataState["officers"] = [
  { id: "OFF-1", name: "Smt. Rajalakshmi P.", designation: "Engineer-in-Chief", departmentId: "DEP-BWSSB", jurisdiction: "KR Puram", phone: "+91 80 2222 1111", email: "ee.krp@bwssb.gov.in", tenure: "Since Mar 2024", responsiveness: 3, transferHistory: [{ date: "2024-03-12", from: "Hebbal", to: "KR Puram" }] },
  { id: "OFF-2", name: "Sri Mahesh K.", designation: "AEE", departmentId: "DEP-BWSSB", jurisdiction: "Whitefield", phone: "+91 80 2222 2233", email: "aee.wf@bwssb.gov.in", tenure: "Since Jan 2025", responsiveness: 4, transferHistory: [] },
  { id: "OFF-3", name: "Smt. Vanishree N.", designation: "Asst. Executive Engineer", departmentId: "DEP-BBMP", jurisdiction: "Mahadevapura", phone: "+91 80 2233 5544", email: "aee.mhdpr@bbmp.gov.in", tenure: "Since Aug 2023", responsiveness: 2, transferHistory: [{ date: "2023-08-01", from: "Yelahanka", to: "Mahadevapura" }] },
  { id: "OFF-4", name: "Sri Prakash B.", designation: "Executive Engineer", departmentId: "DEP-BBMP", jurisdiction: "Bellandur", phone: "+91 80 2233 7788", email: "ee.bel@bbmp.gov.in", tenure: "Since Nov 2024", responsiveness: 3, transferHistory: [] },
  { id: "OFF-5", name: "Sri Narayan Swamy", designation: "AE", departmentId: "DEP-BESCOM", jurisdiction: "Marathahalli", phone: "+91 80 2244 9911", email: "ae.mrh@bescom.org", tenure: "Since Feb 2025", responsiveness: 4, transferHistory: [] },
  { id: "OFF-6", name: "Sri Lokesh M.", designation: "AE", departmentId: "DEP-BESCOM", jurisdiction: "KR Puram", phone: "+91 80 2244 1010", email: "ae.krp@bescom.org", tenure: "Since Jun 2024", responsiveness: 3, transferHistory: [] },
  { id: "OFF-7", name: "Sri ACP Rakesh", designation: "Asst. Commissioner of Police", departmentId: "DEP-POLICE", jurisdiction: "Whitefield", phone: "+91 80 2255 0001", email: "acp.wf@ksp.gov.in", tenure: "Since Apr 2025", responsiveness: 4, transferHistory: [] },
  { id: "OFF-8", name: "Smt. Inspector Pavithra", designation: "Inspector", departmentId: "DEP-POLICE", jurisdiction: "Mahadevapura", phone: "+91 80 2255 0042", email: "insp.mhdpr@ksp.gov.in", tenure: "Since Sep 2024", responsiveness: 3, transferHistory: [] },
  { id: "OFF-9", name: "Dr. Shankar G.", designation: "District Health Officer", departmentId: "DEP-HEALTH", jurisdiction: "Constituency", phone: "+91 80 2266 7700", email: "dho.bbe@kar.nic.in", tenure: "Since Jul 2023", responsiveness: 3, transferHistory: [] },
  { id: "OFF-10", name: "Smt. Sudha BEO", designation: "Block Education Officer", departmentId: "DEP-EDU", jurisdiction: "Bellandur", phone: "+91 80 2277 8800", email: "beo.bel@kar.nic.in", tenure: "Since Aug 2024", responsiveness: 4, transferHistory: [] },
  { id: "OFF-11", name: "Sri Tahsildar Murthy", designation: "Tahsildar", departmentId: "DEP-REV", jurisdiction: "Marathahalli", phone: "+91 80 2288 1100", email: "tah.mrh@kar.nic.in", tenure: "Since Oct 2024", responsiveness: 2, transferHistory: [] },
  { id: "OFF-12", name: "Smt. CDPO Asha", designation: "Child Dev. Project Officer", departmentId: "DEP-SW", jurisdiction: "KR Puram", phone: "+91 80 2299 4400", email: "cdpo.krp@kar.nic.in", tenure: "Since Jan 2024", responsiveness: 4, transferHistory: [] },
];

const citizens: DataState["citizens"] = [
  { id: "CTZ-1", name: "Manjunath Reddy", family: [{ name: "Kavya Reddy", relation: "Spouse" }, { name: "Arjun Reddy", relation: "Son" }], address: "Sai Layout, KR Puram", ward: "KR Puram", mobiles: ["+91 98•••• 4521"] },
  { id: "CTZ-2", name: "Lakshmi Narayanan", family: [{ name: "Ravi N.", relation: "Spouse" }], address: "ITPL Main Rd, Whitefield", ward: "Whitefield", mobiles: ["+91 90•••• 8812"] },
  { id: "CTZ-3", name: "Mohammed Iqbal", family: [], address: "Sector 7, Mahadevapura", ward: "Mahadevapura", mobiles: ["+91 98•••• 3399"] },
  { id: "CTZ-4", name: "Anitha Krishnan", family: [{ name: "K. Krishnan", relation: "Spouse" }], address: "HAL 3rd Stage, Marathahalli", ward: "Marathahalli", mobiles: ["+91 99•••• 1208"] },
  { id: "CTZ-5", name: "Prakash Hegde", family: [], address: "Bellandur Gate", ward: "Bellandur", mobiles: ["+91 80•••• 5567"] },
  { id: "CTZ-6", name: "Geetha Sharma", family: [{ name: "Late R. Sharma", relation: "Spouse" }], address: "Varthur Rd, Bellandur", ward: "Bellandur", mobiles: ["+91 96•••• 7723"], affiliationNote: "Self-declared party supporter" },
  { id: "CTZ-7", name: "Ramesh Kumar", family: [], address: "Hoodi Circle, KR Puram", ward: "KR Puram", mobiles: ["+91 98•••• 0091"] },
  { id: "CTZ-8", name: "Sushma Bhat", family: [{ name: "Anil Bhat", relation: "Spouse" }], address: "Whitefield Main Rd", ward: "Whitefield", mobiles: ["+91 90•••• 3344"] },
  { id: "CTZ-9", name: "Venkatesh M.", family: [], address: "KR Puram Main", ward: "KR Puram", mobiles: ["+91 80•••• 1145"] },
  { id: "CTZ-10", name: "Fathima Banu", family: [{ name: "Yusuf Banu", relation: "Son" }], address: "AECS Layout, Mahadevapura", ward: "Mahadevapura", mobiles: ["+91 99•••• 6612"] },
  { id: "CTZ-11", name: "Krishnamurthy R.", family: [], address: "Bellandur Signal", ward: "Bellandur", mobiles: ["+91 98•••• 4499"] },
  { id: "CTZ-12", name: "Shilpa Gowda", family: [{ name: "Vinay Gowda", relation: "Spouse" }], address: "Marathahalli Bridge", ward: "Marathahalli", mobiles: ["+91 90•••• 7780"] },
  { id: "CTZ-13", name: "Naveen Joshi", family: [], address: "Varthur, Bellandur", ward: "Bellandur", mobiles: ["+91 96•••• 2231"] },
  { id: "CTZ-14", name: "Bhagya Lakshmi", family: [{ name: "L. Mohan", relation: "Spouse" }, { name: "Asha", relation: "Daughter" }], address: "Hoodi, KR Puram", ward: "KR Puram", mobiles: ["+91 98•••• 5520"] },
  { id: "CTZ-15", name: "Imran Pasha", family: [], address: "Whitefield Main Rd", ward: "Whitefield", mobiles: ["+91 91•••• 7733"] },
];

const cases: DataState["cases"] = [
  // Grievances
  { id: "CASE-2026-0418", recordType: "Grievance", channel: "WhatsApp", status: "In Progress", citizenId: "CTZ-1", wardId: "KR Puram", category: "Water", departmentId: "DEP-BWSSB", officerId: "OFF-1", ownerId: "STF-1", priority: "High", slaDue: d(-1), description: "Contaminated water supply for 5 days, multiple households affected.", createdAt: d(-4) },
  { id: "CASE-2026-0417", recordType: "Grievance", channel: "WhatsApp", status: "Assigned", citizenId: "CTZ-2", wardId: "Whitefield", category: "Roads", departmentId: "DEP-BBMP", officerId: "OFF-3", ownerId: "STF-3", priority: "High", slaDue: d(4), description: "Large pothole near ITPL gate causing accidents.", createdAt: d(-6) },
  { id: "CASE-2026-0416", recordType: "Grievance", channel: "Walk-in", status: "In Progress", citizenId: "CTZ-3", wardId: "Mahadevapura", category: "Sanitation", departmentId: "DEP-BBMP", officerId: "OFF-3", ownerId: "STF-4", priority: "Medium", slaDue: d(-1), description: "Garbage not collected for 9 days in sector 7.", createdAt: d(-5) },
  { id: "CASE-2026-0415", recordType: "Grievance", channel: "Call", status: "Resolved", citizenId: "CTZ-4", wardId: "Marathahalli", category: "Electricity", departmentId: "DEP-BESCOM", officerId: "OFF-5", ownerId: "STF-5", priority: "High", slaDue: d(-7), description: "Frequent power outages 6-8 hours daily.", createdAt: d(-10), resolutionAction: "Referred to department", resolvedAt: d(-3), satisfaction: 4 },
  { id: "CASE-2026-0414", recordType: "Grievance", channel: "WhatsApp", status: "Action Taken", citizenId: "CTZ-5", wardId: "Bellandur", category: "Health", departmentId: "DEP-HEALTH", officerId: "OFF-9", ownerId: "STF-6", priority: "Medium", slaDue: d(0), description: "PHC out of essential medicines.", createdAt: d(-4), resolutionAction: "Site visit conducted" },
  { id: "CASE-2026-0413", recordType: "SchemeRequest", channel: "Walk-in", status: "Pending Citizen Confirmation", citizenId: "CTZ-6", wardId: "Bellandur", category: "Pension/Ration", departmentId: "DEP-SW", officerId: "OFF-12", ownerId: "STF-12", priority: "Low", slaDue: d(1), description: "Widow pension not credited for 3 months.", createdAt: d(-9), resolutionAction: "Scheme/benefit facilitated" },
  { id: "CASE-2026-0412", recordType: "Grievance", channel: "WhatsApp", status: "In Progress", citizenId: "CTZ-7", wardId: "KR Puram", category: "Police", departmentId: "DEP-POLICE", officerId: "OFF-8", ownerId: "STF-2", priority: "High", slaDue: d(2), description: "Chain-snatching near Hoodi metro; need patrolling.", createdAt: d(-3) },
  { id: "CASE-2026-0411", recordType: "RecommendationRequest", channel: "Social", status: "Resolved", citizenId: "CTZ-8", wardId: "Whitefield", category: "Education", departmentId: "DEP-EDU", officerId: "OFF-10", ownerId: "STF-10", priority: "Medium", slaDue: d(-5), description: "Govt school needs Kannada-medium teacher.", createdAt: d(-12), resolutionAction: "Recommendation letter issued", resolvedAt: d(-5), satisfaction: 5 },
  { id: "CASE-2026-0410", recordType: "Grievance", channel: "Walk-in", status: "New", citizenId: "CTZ-9", wardId: "KR Puram", category: "Land/Revenue", departmentId: "DEP-REV", officerId: "OFF-11", ownerId: "STF-8", priority: "Low", slaDue: d(13), description: "Khata transfer stuck at sub-registrar for 7 months.", createdAt: d(-1) },
  { id: "CASE-2026-0409", recordType: "Grievance", channel: "WhatsApp", status: "Action Taken", citizenId: "CTZ-10", wardId: "Mahadevapura", category: "Water", departmentId: "DEP-BWSSB", officerId: "OFF-2", ownerId: "STF-1", priority: "High", slaDue: d(-2), description: "Cauvery water not supplied to AECS Layout for 8 days.", createdAt: d(-5) },
  { id: "CASE-2026-0408", recordType: "Grievance", channel: "Call", status: "Resolved", citizenId: "CTZ-11", wardId: "Bellandur", category: "Civic/BBMP", departmentId: "DEP-BBMP", officerId: "OFF-4", ownerId: "STF-9", priority: "Medium", slaDue: d(-6), description: "Stormwater drain blocked, waterlogging.", createdAt: d(-13), resolutionAction: "Site visit conducted", resolvedAt: d(-6), satisfaction: 4 },
  { id: "CASE-2026-0407", recordType: "Grievance", channel: "WhatsApp", status: "Reopened", citizenId: "CTZ-12", wardId: "Marathahalli", category: "Roads", departmentId: "DEP-BBMP", officerId: "OFF-3", ownerId: "STF-3", priority: "Medium", slaDue: d(0), description: "Footpath dug up, left unrepaired 2 weeks.", createdAt: d(-8) },
  { id: "CASE-2026-0406", recordType: "Grievance", channel: "WhatsApp", status: "Auto-Closed", citizenId: "CTZ-13", wardId: "Bellandur", category: "Electricity", departmentId: "DEP-BESCOM", officerId: "OFF-5", ownerId: "STF-5", priority: "Low", slaDue: d(-9), description: "Streetlights non-functional 3 weeks.", createdAt: d(-16) },
  { id: "CASE-2026-0405", recordType: "Grievance", channel: "Walk-in", status: "Pending Citizen Confirmation", citizenId: "CTZ-14", wardId: "KR Puram", category: "Health", departmentId: "DEP-HEALTH", officerId: "OFF-9", ownerId: "STF-6", priority: "High", slaDue: d(0), description: "Hospital bed needed for elderly father.", createdAt: d(-6) },
  // Scheme requests
  { id: "CASE-2026-0404", recordType: "SchemeRequest", channel: "Walk-in", status: "Assigned", citizenId: "CTZ-2", wardId: "Whitefield", category: "Housing", ownerId: "STF-12", priority: "Medium", slaDue: d(7), description: "PMAY housing application support.", createdAt: d(-2) },
  { id: "CASE-2026-0403", recordType: "SchemeRequest", channel: "WhatsApp", status: "New", citizenId: "CTZ-15", wardId: "Whitefield", category: "Health", ownerId: "STF-12", priority: "Medium", slaDue: d(10), description: "Ayushman Bharat card application.", createdAt: d(0), classification: ["scheme", "health"] },
  // Recommendation requests
  { id: "CASE-2026-0402", recordType: "RecommendationRequest", channel: "Email", status: "New", citizenId: "CTZ-9", wardId: "KR Puram", category: "Education", ownerId: "STF-10", priority: "Low", slaDue: d(14), description: "Recommendation letter for college admission.", createdAt: d(0), classification: ["letter", "education"] },
  // Emergencies
  { id: "CASE-2026-0401", recordType: "Emergency", channel: "Call", status: "In Progress", citizenId: "CTZ-3", wardId: "Mahadevapura", category: "Other", ownerId: "STF-11", priority: "High", slaDue: d(0), description: "Fire at scrap godown near ITPL — fire dept dispatched.", createdAt: d(0), classification: ["urgent", "fire"] },
  { id: "CASE-2026-0400", recordType: "Emergency", channel: "WhatsApp", status: "Action Taken", citizenId: "CTZ-11", wardId: "Bellandur", category: "Other", ownerId: "STF-11", priority: "High", slaDue: d(0), description: "Hongasandra underpass flooded — dewatering team engaged.", createdAt: d(0) },
  // General enquiry
  { id: "CASE-2026-0399", recordType: "GeneralEnquiry", channel: "Social", status: "New", citizenId: "CTZ-15", wardId: "Whitefield", category: "Other", ownerId: "STF-9", priority: "Low", slaDue: d(7), description: "Enquiry on upcoming road-widening project timeline.", createdAt: d(0), classification: ["enquiry", "roads"] },
];

const letters: DataState["letters"] = [
  { id: "LET-2026-014", templateType: "Departmental request", recipientType: "Officer", caseId: "CASE-2026-0418", citizenId: "CTZ-1", officerId: "OFF-1", subject: "Urgent — Contaminated water supply, KR Puram", body: "Respected Engineer-in-Chief…", status: "Dispatched", dispatchMode: "Email", dispatchNo: "DSP-2412", date: d(-3) },
  { id: "LET-2026-013", templateType: "Recommendation", recipientType: "Officer", caseId: "CASE-2026-0411", citizenId: "CTZ-8", officerId: "OFF-10", subject: "Recommendation — Kannada-medium teacher posting", body: "Smt. BEO…", status: "Acknowledged", dispatchMode: "Post", dispatchNo: "DSP-2411", date: d(-9) },
  { id: "LET-2026-012", templateType: "Pension follow-up", recipientType: "Officer", caseId: "CASE-2026-0413", citizenId: "CTZ-6", officerId: "OFF-12", subject: "Widow pension release request", body: "Smt. CDPO…", status: "Dispatched", dispatchMode: "Hand", dispatchNo: "DSP-2410", date: d(-7) },
  { id: "LET-2026-011", templateType: "Recommendation", recipientType: "Department", citizenId: "CTZ-15", subject: "Recommendation — PMAY support", body: "Respected sir…", status: "Draft", dispatchMode: "Post", date: d(-1) },
  { id: "LET-2026-010", templateType: "Reminder", recipientType: "Officer", caseId: "CASE-2026-0417", officerId: "OFF-3", subject: "Reminder — Pothole near ITPL gate", body: "Respected AE…", status: "Approved", dispatchMode: "Email", date: d(-2) },
  { id: "LET-2026-009", templateType: "Site visit request", recipientType: "Officer", caseId: "CASE-2026-0414", officerId: "OFF-9", subject: "Stock-out of essential drugs — Bellandur PHC", body: "Dr. DHO…", status: "Dispatched", dispatchMode: "Email", dispatchNo: "DSP-2408", date: d(-3) },
  { id: "LET-2026-008", templateType: "Recommendation", recipientType: "Officer", citizenId: "CTZ-7", officerId: "OFF-8", subject: "Recommendation — Patrolling at Hoodi metro", body: "Respected Inspector…", status: "Dispatched", dispatchMode: "Hand", dispatchNo: "DSP-2407", date: d(-1) },
  { id: "LET-2026-007", templateType: "Cong­ratulations", recipientType: "Citizen", citizenId: "CTZ-4", subject: "Congratulations on UPSC clearance", body: "Dear citizen…", status: "Dispatched", dispatchMode: "Post", dispatchNo: "DSP-2406", date: d(-11) },
  { id: "LET-2026-006", templateType: "Condolence", recipientType: "Citizen", citizenId: "CTZ-6", subject: "Condolence message", body: "Dear family…", status: "Dispatched", dispatchMode: "Hand", dispatchNo: "DSP-2405", date: d(-14) },
  { id: "LET-2026-005", templateType: "Sanction follow-up", recipientType: "Department", commitmentId: "COM-002", subject: "Sanction request — KR Puram drinking water augmentation", body: "Respected Secretary…", status: "Dispatched", dispatchMode: "Email", dispatchNo: "DSP-2404", date: d(-15) },
  { id: "LET-2026-004", templateType: "Escalation", recipientType: "Officer", caseId: "CASE-2026-0410", officerId: "OFF-11", subject: "Escalation — Khata transfer pending 7 months", body: "Sri Tahsildar…", status: "Draft", dispatchMode: "Post", date: d(0) },
  { id: "LET-2026-003", templateType: "Thank you", recipientType: "Officer", officerId: "OFF-5", subject: "Appreciation — BESCOM transformer replacement", body: "Sri AE…", status: "Acknowledged", dispatchMode: "Email", date: d(-2) },
  { id: "LET-2026-002", templateType: "Departmental request", recipientType: "Officer", caseId: "CASE-2026-0409", officerId: "OFF-2", subject: "Emergency water tanker dispatch — AECS Layout", body: "Sri AEE…", status: "Acknowledged", dispatchMode: "Email", date: d(-4) },
  { id: "LET-2026-001", templateType: "Site visit request", recipientType: "Officer", caseId: "CASE-2026-0412", officerId: "OFF-7", subject: "Beat patrol enhancement — Hoodi metro vicinity", body: "Respected ACP…", status: "Dispatched", dispatchMode: "Email", dispatchNo: "DSP-2401", date: d(-2) },
];

const commitments: DataState["commitments"] = [
  { id: "COM-001", text: "Footpath repair at Marathahalli bridge in 30 days", type: "Public", madeBy: "Hon'ble MP", caseId: "CASE-2026-0407", dueDate: d(20), status: "In Progress", responsibleStaffId: "STF-3" },
  { id: "COM-002", text: "KR Puram drinking water augmentation by Q3", type: "Public", madeBy: "Hon'ble MP", location: "KR Puram", dueDate: d(60), status: "In Progress", responsibleStaffId: "STF-1" },
  { id: "COM-003", text: "Resolve PHC stock-outs in Bellandur by month-end", type: "Letter", madeBy: "Hon'ble MP", caseId: "CASE-2026-0414", dueDate: d(8), status: "In Progress", responsibleStaffId: "STF-6" },
  { id: "COM-004", text: "Patrolling enhancement at Hoodi metro", type: "Public", madeBy: "Hon'ble MP", caseId: "CASE-2026-0412", dueDate: d(15), status: "Open", responsibleStaffId: "STF-2" },
  { id: "COM-005", text: "Replace BESCOM transformer HAL 3rd Stage", type: "Letter", madeBy: "Hon'ble MP", caseId: "CASE-2026-0415", dueDate: d(-5), status: "Fulfilled", responsibleStaffId: "STF-5", closureProof: "Photo + citizen confirmation" },
  { id: "COM-006", text: "Sanction for Whitefield Govt School Kannada teacher", type: "Event", madeBy: "Hon'ble MP", caseId: "CASE-2026-0411", dueDate: d(-2), status: "Fulfilled", responsibleStaffId: "STF-10" },
  { id: "COM-007", text: "Pension release for Smt. Geetha Sharma", type: "Private", madeBy: "Hon'ble MP", caseId: "CASE-2026-0413", dueDate: d(5), status: "In Progress", responsibleStaffId: "STF-12" },
  { id: "COM-008", text: "Lake clean-up at Varthur — start within 90 days", type: "Public", madeBy: "Hon'ble MP", location: "Bellandur", dueDate: d(70), status: "Open", responsibleStaffId: "STF-9" },
  { id: "COM-009", text: "Cauvery line repair AECS Layout", type: "Letter", madeBy: "Hon'ble MP", caseId: "CASE-2026-0409", dueDate: d(2), status: "In Progress", responsibleStaffId: "STF-1" },
  { id: "COM-010", text: "Stormwater drain audit — Bellandur signal", type: "Public", madeBy: "Hon'ble MP", caseId: "CASE-2026-0408", dueDate: d(-10), status: "Fulfilled", responsibleStaffId: "STF-9" },
];

const events: DataState["events"] = [
  { id: "EVT-1", name: "RWA Federation Town Hall", type: "Public meeting", date: d(2), location: "Whitefield Community Hall", stage: "Confirmed" },
  { id: "EVT-2", name: "Bellandur Lake Clean-up Drive", type: "Field visit", date: d(7), location: "Bellandur Lake", stage: "Planned" },
  { id: "EVT-3", name: "Mahadevapura Health Camp", type: "Camp", date: d(14), location: "Sector 7", stage: "Planned" },
  { id: "EVT-4", name: "KR Puram Foundation Day", type: "Ceremony", date: d(-3), location: "KR Puram", stage: "Closed" },
  { id: "EVT-5", name: "Marathahalli Senior Citizens' Meet", type: "Outreach", date: d(21), location: "HAL Layout", stage: "Planned" },
  { id: "EVT-6", name: "MPLADS Sanction Review", type: "Internal", date: d(5), location: "MP Office", stage: "Confirmed" },
  { id: "EVT-7", name: "Whitefield Tech Park CSR Roundtable", type: "Meeting", date: d(11), location: "ITPL", stage: "Planned" },
  { id: "EVT-8", name: "Door-to-door — KR Puram Ward 84", type: "Outreach", date: d(28), location: "KR Puram", stage: "Planned" },
];

const demands: DataState["demands"] = [
  { id: "DEM-1", type: "Road widening", ward: "Whitefield", requestedBy: "Whitefield RWA Federation", impact: "High", classification: ["Roads"], status: "In Plan" },
  { id: "DEM-2", type: "Cauvery line augmentation", ward: "KR Puram", requestedBy: "Citizen petition (412 signatures)", impact: "High", classification: ["Water"], status: "Triaged" },
  { id: "DEM-3", type: "Lake rejuvenation", ward: "Bellandur", requestedBy: "Lake Action Forum", impact: "High", classification: ["Environment"], status: "Sanctioned", projectId: "PRJ-2" },
  { id: "DEM-4", type: "Park development", ward: "Mahadevapura", requestedBy: "AECS Layout RWA", impact: "Medium", classification: ["Civic"], status: "New" },
  { id: "DEM-5", type: "PHC upgrade", ward: "Bellandur", requestedBy: "Local NGO", impact: "High", classification: ["Health"], status: "Triaged" },
  { id: "DEM-6", type: "Govt school infrastructure", ward: "Marathahalli", requestedBy: "School Dev. Committee", impact: "Medium", classification: ["Education"], status: "In Plan" },
  { id: "DEM-7", type: "Traffic signal", ward: "Mahadevapura", requestedBy: "Whitefield Traffic Forum", impact: "Medium", classification: ["Traffic"], status: "Sanctioned", projectId: "PRJ-4" },
  { id: "DEM-8", type: "Footpath repair", ward: "Marathahalli", requestedBy: "Citizen group", impact: "Medium", classification: ["Roads"], status: "In Plan" },
  { id: "DEM-9", type: "Streetlights", ward: "Bellandur", requestedBy: "Varthur Residents", impact: "Low", classification: ["Civic"], status: "Sanctioned", projectId: "PRJ-5" },
  { id: "DEM-10", type: "Community hall", ward: "KR Puram", requestedBy: "Ward Committee", impact: "Medium", classification: ["Civic"], status: "New" },
];

const projects: DataState["projects"] = [
  { id: "PRJ-1", name: "KR Puram Cauvery line phase-3", ward: "KR Puram", sanctioned: 4_50_00_000, spent: 1_20_00_000, status: "Ongoing", fundsSource: "MPLADS", demandId: "DEM-2" },
  { id: "PRJ-2", name: "Bellandur Lake rejuvenation phase-2", ward: "Bellandur", sanctioned: 12_00_00_000, spent: 4_20_00_000, status: "Ongoing", fundsSource: "State", demandId: "DEM-3" },
  { id: "PRJ-3", name: "Whitefield road widening Pkg A", ward: "Whitefield", sanctioned: 8_50_00_000, spent: 2_10_00_000, status: "Delayed", fundsSource: "BBMP", demandId: "DEM-1" },
  { id: "PRJ-4", name: "Mahadevapura traffic signal upgrade", ward: "Mahadevapura", sanctioned: 75_00_000, spent: 65_00_000, status: "Completed", fundsSource: "MPLADS", demandId: "DEM-7" },
  { id: "PRJ-5", name: "Bellandur streetlight retrofit", ward: "Bellandur", sanctioned: 50_00_000, spent: 22_00_000, status: "Ongoing", fundsSource: "MPLADS", demandId: "DEM-9" },
  { id: "PRJ-6", name: "Marathahalli school block", ward: "Marathahalli", sanctioned: 2_00_00_000, spent: 30_00_000, status: "Sanctioned", fundsSource: "MPLADS", demandId: "DEM-6" },
  { id: "PRJ-7", name: "KR Puram community hall", ward: "KR Puram", sanctioned: 1_20_00_000, spent: 0, status: "Sanctioned", fundsSource: "MLA" },
  { id: "PRJ-8", name: "Bellandur PHC equipment", ward: "Bellandur", sanctioned: 90_00_000, spent: 12_00_000, status: "Ongoing", fundsSource: "State", demandId: "DEM-5" },
];

const deptFiles: DataState["deptFiles"] = [
  { id: "FIL-1", refNo: "BWSSB/2026/4421", subject: "KR Puram contamination — investigation report", departmentId: "DEP-BWSSB", officerId: "OFF-1", caseId: "CASE-2026-0418", submittedDate: d(-4), lastFollowUp: d(-1), bottleneck: "AEE response pending", escalationLevel: 2, status: "Pending" },
  { id: "FIL-2", refNo: "BBMP/RD/2026/8810", subject: "ITPL pothole — work order", departmentId: "DEP-BBMP", officerId: "OFF-3", caseId: "CASE-2026-0417", submittedDate: d(-6), lastFollowUp: d(-2), escalationLevel: 1, status: "Moved" },
  { id: "FIL-3", refNo: "BBMP/SW/2026/1102", subject: "Sector 7 sanitation route", departmentId: "DEP-BBMP", officerId: "OFF-3", caseId: "CASE-2026-0416", submittedDate: d(-5), lastFollowUp: d(-3), bottleneck: "Truck schedule conflict", escalationLevel: 2, status: "Pending" },
  { id: "FIL-4", refNo: "BESCOM/MRH/2026/331", subject: "HAL 3rd Stage transformer replacement", departmentId: "DEP-BESCOM", officerId: "OFF-5", caseId: "CASE-2026-0415", submittedDate: d(-10), lastFollowUp: d(-4), escalationLevel: 1, status: "Closed" },
  { id: "FIL-5", refNo: "HEAL/PHC/2026/220", subject: "Bellandur PHC drug stock", departmentId: "DEP-HEALTH", officerId: "OFF-9", caseId: "CASE-2026-0414", submittedDate: d(-4), lastFollowUp: d(-1), escalationLevel: 1, status: "Pending" },
  { id: "FIL-6", refNo: "SW/PEN/2026/55", subject: "Widow pension release — Smt. Sharma", departmentId: "DEP-SW", officerId: "OFF-12", caseId: "CASE-2026-0413", submittedDate: d(-9), lastFollowUp: d(-3), escalationLevel: 1, status: "Moved" },
  { id: "FIL-7", refNo: "POL/HOO/2026/77", subject: "Hoodi patrolling enhancement", departmentId: "DEP-POLICE", officerId: "OFF-8", caseId: "CASE-2026-0412", submittedDate: d(-3), lastFollowUp: d(-1), escalationLevel: 1, status: "Pending" },
  { id: "FIL-8", refNo: "EDU/BEO/2026/19", subject: "Kannada teacher posting", departmentId: "DEP-EDU", officerId: "OFF-10", caseId: "CASE-2026-0411", submittedDate: d(-12), lastFollowUp: d(-5), escalationLevel: 1, status: "Closed" },
  { id: "FIL-9", refNo: "REV/KHATA/2026/41", subject: "Khata transfer escalation", departmentId: "DEP-REV", officerId: "OFF-11", caseId: "CASE-2026-0410", submittedDate: d(-1), lastFollowUp: d(0), bottleneck: "Sub-registrar non-cooperation", escalationLevel: 3, status: "Pending" },
  { id: "FIL-10", refNo: "BWSSB/MHDPR/2026/12", subject: "AECS Layout pipeline repair", departmentId: "DEP-BWSSB", officerId: "OFF-2", caseId: "CASE-2026-0409", submittedDate: d(-5), lastFollowUp: d(-1), escalationLevel: 2, status: "Moved" },
];

const contacts: DataState["contacts"] = [
  { id: "CON-1", name: "Sri Manjunath M.", role: "Corporator — Ward 84", category: "Corporator", tier: "Key", phone: "+91 98•••• 1111" },
  { id: "CON-2", name: "Smt. Lakshmi K.", role: "Corporator — Bellandur", category: "Corporator", tier: "Key" },
  { id: "CON-3", name: "Anand Rao", role: "Bureau Chief — Deccan Herald", category: "Journalist", tier: "VIP" },
  { id: "CON-4", name: "Priya Mohan", role: "Chief — Whitefield RWA Fed.", category: "Community", tier: "Key" },
  { id: "CON-5", name: "Sri Rajiv Bhatt", role: "Donor", category: "Donor", tier: "VIP" },
];

const organisations: DataState["organisations"] = [
  { id: "ORG-1", name: "Whitefield RWA Federation", area: "Whitefield", officeBearers: [{ name: "Priya Mohan", role: "President" }], influence: "High", relationshipHealth: "Strong", pendingIssues: ["Road widening — Pkg A"] },
  { id: "ORG-2", name: "Bellandur Lake Action Forum", area: "Bellandur", officeBearers: [{ name: "Suresh Murthy", role: "Convener" }], influence: "High", relationshipHealth: "Neutral", pendingIssues: ["Lake phase-2 update"] },
  { id: "ORG-3", name: "KR Puram Trade Assn.", area: "KR Puram", officeBearers: [{ name: "Naveen Shetty", role: "President" }], influence: "Medium", relationshipHealth: "Strong" },
  { id: "ORG-4", name: "Mahadevapura Youth Sangha", area: "Mahadevapura", officeBearers: [{ name: "Arjun K.", role: "Secretary" }], influence: "Medium", relationshipHealth: "Strong" },
  { id: "ORG-5", name: "Marathahalli Senior Citizens' Forum", area: "Marathahalli", officeBearers: [{ name: "Smt. Padma", role: "President" }], influence: "Low", relationshipHealth: "Strong" },
];

const templates: DataState["templates"] = [
  { id: "TPL-1", name: "Departmental request", recipientType: "Officer", body: "Respected officer…" },
  { id: "TPL-2", name: "Recommendation", recipientType: "Officer", body: "Recommending the bearer…" },
  { id: "TPL-3", name: "Reminder", recipientType: "Officer", body: "This is a kind reminder…" },
  { id: "TPL-4", name: "Condolence", recipientType: "Citizen", body: "Heartfelt condolences…" },
  { id: "TPL-5", name: "Congratulations", recipientType: "Citizen", body: "Hearty congratulations…" },
];

export const seedData: DataState = {
  departments: [...departments],
  schemes,
  staff,
  templates,
  citizens,
  cases,
  contacts,
  organisations,
  officers,
  letters,
  commitments,
  events,
  demands,
  projects,
  deptFiles,
};
