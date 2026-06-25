// Local subject catalog — mirrors the mobile app's kSubjects (subject_data.dart).
// Header/summary metadata only; lessons/curriculum come later from the backend.

export interface SubjectInfo {
  name: string;
  category: "science" | "arts";
  color: string;
  percent: number;
  trend: string;
  trendUp: boolean;
  topicsLabel: string;
  lastStudied: string;
}

export const SUBJECTS: SubjectInfo[] = [
  { name: "English Language", category: "arts", color: "#185FA5", percent: 91, trend: "+3%", trendUp: true, topicsLabel: "37/40 topics", lastStudied: "Today" },
  { name: "Mathematics", category: "science", color: "#E05B5B", percent: 78, trend: "+4%", trendUp: true, topicsLabel: "41/52 topics", lastStudied: "Yesterday" },
  { name: "Physics", category: "science", color: "#185FA5", percent: 83, trend: "+3%", trendUp: true, topicsLabel: "38/45 topics", lastStudied: "2 days ago" },
  { name: "Chemistry", category: "science", color: "#C0396A", percent: 91, trend: "+2%", trendUp: true, topicsLabel: "32/48 topics", lastStudied: "3 days ago" },
  { name: "Biology", category: "science", color: "#059669", percent: 95, trend: "+4%", trendUp: true, topicsLabel: "44/50 topics", lastStudied: "Today" },
  { name: "Literature in English", category: "arts", color: "#7C3AED", percent: 62, trend: "+1%", trendUp: true, topicsLabel: "18/30 topics", lastStudied: "4 days ago" },
  { name: "Economics", category: "arts", color: "#0891B2", percent: 55, trend: "+2%", trendUp: true, topicsLabel: "22/40 topics", lastStudied: "5 days ago" },
  { name: "Government", category: "arts", color: "#1D4ED8", percent: 48, trend: "+1%", trendUp: true, topicsLabel: "19/40 topics", lastStudied: "1 week ago" },
  { name: "Agricultural Science", category: "science", color: "#65A30D", percent: 42, trend: "+2%", trendUp: true, topicsLabel: "17/40 topics", lastStudied: "1 week ago" },
  { name: "Further Mathematics", category: "science", color: "#4F46E5", percent: 35, trend: "+3%", trendUp: true, topicsLabel: "14/40 topics", lastStudied: "2 weeks ago" },
];
