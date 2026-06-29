import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Gauge, Sun, Inbox, ClipboardList, Users, Contact, FileSignature, ListChecks,
  CalendarCheck, Calendar, Mic, PiggyBank, Landmark, HardHat,
  FolderOpen, Users2, BookUser,
  BarChart3, Smile, Radar, Target, Newspaper, TrendingUp, Database, Send,
  ListTodo, Archive, BookOpen, Settings, Building2, FileText,
  ChevronRight, Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

type NavItem = { title: string; url: string; icon: LucideIcon; badge?: number };
type NavSection = { label: string; items: NavItem[]; standalone?: boolean };

// 13 entries — single items render flat; grouped items collapse.
const sections: NavSection[] = [
  { label: "Command Center", standalone: true, items: [{ title: "Command Center", url: "/", icon: Gauge }] },
  { label: "Daily Briefing", standalone: true, items: [{ title: "Daily Briefing", url: "/daily-briefing", icon: Sun, badge: 5 }] },
  { label: "Inbox", standalone: true, items: [{ title: "Inbox", url: "/inbox", icon: Inbox }] },
  { label: "Cases", standalone: true, items: [{ title: "Cases", url: "/cases", icon: ClipboardList, badge: 3 }] },
  { label: "Citizens", standalone: true, items: [{ title: "Citizens", url: "/citizen-database", icon: Users }] },
  { label: "Relationships", standalone: true, items: [{ title: "CRM — People / Orgs / Officers", url: "/stakeholder-crm", icon: Contact }] },
  { label: "Letters", standalone: true, items: [{ title: "Letters & Correspondence", url: "/recommendation-letters", icon: FileSignature }] },
  { label: "Commitments", standalone: true, items: [{ title: "Commitments", url: "/commitment-tracker", icon: ListChecks }] },
  {
    label: "Events & Visits",
    items: [
      { title: "Event Lifecycle", url: "/event-lifecycle", icon: CalendarCheck },
      { title: "Calendar & Visits", url: "/calendar", icon: Calendar },
      { title: "Briefings & Speeches", url: "/briefings-speeches", icon: Mic },
    ],
  },
  {
    label: "Development",
    items: [
      { title: "Demand Bank", url: "/development-demand-bank", icon: PiggyBank },
      { title: "Funds & Projects", url: "/funds-projects", icon: Landmark },
      { title: "Work Inspections", url: "/work-inspection", icon: HardHat },
    ],
  },
  {
    label: "Government",
    items: [
      { title: "Department Files", url: "/department-files", icon: FolderOpen },
      { title: "Local Body Meetings", url: "/local-body-meetings", icon: Users2 },
      { title: "Officer Directory", url: "/officer-directory", icon: BookUser },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Post Analytics", url: "/post-analytics", icon: BarChart3 },
      { title: "Sentiment", url: "/sentiment", icon: Smile },
      { title: "Issue Radar + Heatmap", url: "/issue-radar", icon: Radar },
      { title: "Opportunities", url: "/opportunities", icon: Target },
      { title: "Media Desk", url: "/media-watch", icon: Newspaper },
      { title: "Positioning", url: "/positioning", icon: TrendingUp },
      { title: "Citizen Database", url: "/citizen-database", icon: Database },
      { title: "Broadcasts", url: "/broadcasts", icon: Send },
    ],
  },
  {
    label: "Office & Governance",
    items: [
      { title: "Staff Tasks", url: "/staff-tasks", icon: ListTodo },
      { title: "Document Vault", url: "/document-vault", icon: Archive },
      { title: "Knowledge Base", url: "/knowledge-base", icon: BookOpen },
      { title: "Settings & Team", url: "/settings-team", icon: Settings },
      { title: "Parliament Tracker", url: "/parliament-tracker", icon: Building2 },
      { title: "Reports", url: "/reports", icon: FileText },
    ],
  },
];

const STORAGE_KEY = "mp-pulse-sidebar-groups-v2";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state: sidebarState } = useSidebar();
  const collapsedRail = sidebarState === "collapsed";

  const activeSectionLabel = useMemo(
    () => sections.find((s) => s.items.some((i) => i.url === pathname))?.label ?? "",
    [pathname],
  );

  // Default: ALL collapsed. Active group auto-expands.
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  });
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!activeSectionLabel) return;
    setOpenMap((prev) => (prev[activeSectionLabel] ? prev : { ...prev, [activeSectionLabel]: true }));
  }, [activeSectionLabel]);

  useEffect(() => {
    try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(openMap)); } catch {}
  }, [openMap]);

  const toggle = (label: string) => setOpenMap((p) => ({ ...p, [label]: !p[label] }));
  const setAll = (open: boolean) => {
    const next: Record<string, boolean> = {};
    sections.forEach((s) => { if (!s.standalone) next[s.label] = open; });
    setOpenMap(next);
  };

  const q = query.trim().toLowerCase();
  const filtered = q
    ? sections
        .map((s) => ({ ...s, items: s.items.filter((i) => i.title.toLowerCase().includes(q)) }))
        .filter((s) => s.items.length > 0)
    : sections;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-saffron text-saffron-foreground font-bold text-sm shadow-sm shrink-0">
            CP
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">Citizen Pulse</span>
            <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Intelligence Suite</span>
          </div>
        </Link>
      </SidebarHeader>

      {!collapsedRail && (
        <div className="px-3 pt-3 pb-2 space-y-2 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-sidebar-foreground/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search navigation…"
              className="h-8 pl-7 bg-sidebar-accent/40 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40 text-xs"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
            <span>Navigation</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setAll(true)} className="hover:text-saffron transition-colors">Expand all</button>
              <span className="text-sidebar-foreground/30">·</span>
              <button onClick={() => setAll(false)} className="hover:text-saffron transition-colors">Collapse all</button>
            </div>
          </div>
        </div>
      )}

      <SidebarContent className="px-2 py-2 overflow-y-auto">
        {filtered.map((section) => {
          // Standalone: render flat menu item
          if (section.standalone) {
            const item = section.items[0];
            const active = pathname === item.url;
            return (
              <SidebarGroup key={section.label} className="py-0.5">
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className="relative data-[active=true]:bg-saffron/15 data-[active=true]:text-saffron data-[active=true]:font-medium hover:bg-sidebar-accent/60"
                      >
                        <Link to={item.url}>
                          {active && <span aria-hidden className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-saffron" />}
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{item.title}</span>
                          {item.badge !== undefined && (
                            <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-saffron px-1 text-[10px] font-semibold text-saffron-foreground group-data-[collapsible=icon]:hidden">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }

          const isOpen = q ? true : !!openMap[section.label];
          return (
            <SidebarGroup key={section.label} className="py-0.5">
              {!collapsedRail && (
                <button
                  onClick={() => !q && toggle(section.label)}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-left hover:bg-sidebar-accent/40 transition-colors group-data-[collapsible=icon]:hidden"
                >
                  <ChevronRight className={`h-3 w-3 text-sidebar-foreground/50 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  <span className="flex-1 text-[10px] uppercase tracking-[0.12em] font-medium text-sidebar-foreground/60">
                    {section.label}
                  </span>
                  <span className="text-[10px] text-sidebar-foreground/40 tabular-nums">{section.items.length}</span>
                </button>
              )}
              {(isOpen || collapsedRail) && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => {
                      const active = pathname === item.url;
                      return (
                        <SidebarMenuItem key={`${section.label}:${item.url}`}>
                          <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={item.title}
                            className="relative data-[active=true]:bg-saffron/15 data-[active=true]:text-saffron data-[active=true]:font-medium hover:bg-sidebar-accent/60"
                          >
                            <Link to={item.url}>
                              {active && <span aria-hidden className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-saffron" />}
                              <item.icon className="h-4 w-4" />
                              <span className="flex-1 truncate">{item.title}</span>
                              {item.badge !== undefined && (
                                <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-saffron px-1 text-[10px] font-semibold text-saffron-foreground group-data-[collapsible=icon]:hidden">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          );
        })}
        {q && filtered.length === 0 && (
          <div className="px-3 py-6 text-center text-xs text-sidebar-foreground/50">No matches for "{query}"</div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:hidden">
        <div className="rounded-lg bg-sidebar-accent/50 p-3 text-xs text-sidebar-foreground/80">
          <div className="font-medium text-sidebar-foreground">Live monitoring</div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>14 sources active</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
