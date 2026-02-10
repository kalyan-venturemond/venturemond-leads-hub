import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download } from "lucide-react";
import { LeadStatus } from "@/types/lead";

interface FiltersBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: LeadStatus | "All";
  onStatusChange: (v: LeadStatus | "All") => void;
  serviceFilter: string;
  onServiceChange: (v: string) => void;
  services: string[];
  onExport: () => void;
}

const statuses: (LeadStatus | "All")[] = ["All", "New", "Contacted", "Qualified", "Closed"];

export default function FiltersBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  serviceFilter,
  onServiceChange,
  services,
  onExport,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search leads…  ( / )"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card border-border focus:border-primary focus:ring-primary/20 h-9 text-sm transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as LeadStatus | "All")}>
          <SelectTrigger className="w-[130px] bg-card border-border h-9 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {statuses.map((s) => (
              <SelectItem key={s} value={s} className="text-xs cursor-pointer">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={serviceFilter} onValueChange={onServiceChange}>
          <SelectTrigger className="w-[150px] bg-card border-border h-9 text-xs">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {services.map((s) => (
              <SelectItem key={s} value={s} className="text-xs cursor-pointer">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="border-border text-muted-foreground hover:text-foreground h-9 px-3 text-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export
        </Button>
      </div>
    </div>
  );
}
