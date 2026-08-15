import {
  ClipboardList,
  Users,
  Rocket,
  RefreshCw,
  GitMerge,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type CategoryStyle = {
  icon: LucideIcon;
  dot: string;
  iconWrap: string;
  softBg: string;
  text: string;
  border: string;
  bar: string;
};

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "assessment-planning": {
    icon: ClipboardList,
    dot: "bg-blue-500",
    iconWrap: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    softBg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-500/30",
    bar: "bg-blue-500",
  },
  "governance-tracking": {
    icon: Users,
    dot: "bg-violet-500",
    iconWrap: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    softBg: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-500/30",
    bar: "bg-violet-500",
  },
  "day1-readiness": {
    icon: Rocket,
    dot: "bg-cyan-500",
    iconWrap: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    softBg: "bg-cyan-50 dark:bg-cyan-500/10",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-500/30",
    bar: "bg-cyan-500",
  },
  "org-change-management": {
    icon: RefreshCw,
    dot: "bg-pink-500",
    iconWrap: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
    softBg: "bg-pink-50 dark:bg-pink-500/10",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-500/30",
    bar: "bg-pink-500",
  },
  "post-day1-core-integration": {
    icon: GitMerge,
    dot: "bg-indigo-500",
    iconWrap: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    softBg: "bg-indigo-50 dark:bg-indigo-500/10",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-500/30",
    bar: "bg-indigo-500",
  },
  "security-compliance": {
    icon: ShieldCheck,
    dot: "bg-teal-500",
    iconWrap: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    softBg: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-500/30",
    bar: "bg-teal-500",
  },
};

export const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  icon: ClipboardList,
  dot: "bg-slate-500",
  iconWrap: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  softBg: "bg-slate-50 dark:bg-slate-500/10",
  text: "text-slate-700 dark:text-slate-300",
  border: "border-slate-200 dark:border-slate-500/30",
  bar: "bg-slate-500",
};

export function getCategoryStyle(slug: string): CategoryStyle {
  return CATEGORY_STYLES[slug] ?? DEFAULT_CATEGORY_STYLE;
}
