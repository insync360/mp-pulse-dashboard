import { Bell, ChevronDown, Search, Calendar } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="text-foreground" />
      <div className="hidden md:flex flex-col leading-tight">
        <span className="text-sm font-semibold text-foreground">Hon'ble MP – Bengaluru</span>
        <span className="text-[11px] text-muted-foreground">Lok Sabha · Karnataka</span>
      </div>

      <div className="ml-4 hidden lg:flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 w-72 text-muted-foreground">
        <Search className="h-3.5 w-3.5" />
        <input
          placeholder="Search posts, issues, hashtags…"
          className="bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 w-full"
        />
        <kbd className="text-[10px] rounded border border-border px-1.5 py-0.5 bg-muted">⌘K</kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-border bg-card text-foreground hover:bg-muted"
        >
          <Calendar className="h-3.5 w-3.5 text-saffron" />
          <span className="hidden sm:inline">Last 30 days</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-saffron ring-2 ring-background" />
        </Button>

        <div className="flex items-center gap-2.5 rounded-full border border-border bg-card pl-1 pr-3 py-1">
          <Avatar className="h-7 w-7">
            <AvatarImage src="" />
            <AvatarFallback className="bg-navy text-navy-foreground text-[11px] font-semibold">
              MP
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-xs font-medium">Office of the MP</span>
            <span className="text-[10px] text-muted-foreground">Bengaluru Central</span>
          </div>
          <Badge className="hidden md:inline-flex bg-saffron/15 text-saffron border-0 text-[9px] uppercase tracking-wider">
            Live
          </Badge>
        </div>
      </div>
    </header>
  );
}
