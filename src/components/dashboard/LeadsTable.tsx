import { Lead, LeadStatus } from "@/types/lead";
import { StatusBadge, isNewLead } from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface LeadsTableProps {
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Closed"];

export default function LeadsTable({ leads, onViewDetails, onUpdateStatus }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <p className="text-muted-foreground text-sm">No leads yet.</p>
        <p className="text-muted-foreground/60 text-xs mt-1">
          New inquiries will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Date", "Name", "Company", "Service", "Budget", "Status", "Actions"].map((h) => (
              <th
                key={h}
                className="text-left text-xs text-muted-foreground font-medium uppercase tracking-wider px-4 py-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr
              key={lead.id}
              onClick={() => onViewDetails(lead)}
              className="border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors group"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                {format(new Date(lead.createdAt), "MMM d, yyyy")}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{lead.name}</span>
                  {isNewLead(lead.createdAt) && (
                    <Badge className="bg-primary/20 text-primary border-0 text-[10px] px-1.5 py-0 h-4 uppercase tracking-wider">
                      New
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3.5 text-muted-foreground">
                {lead.company || "—"}
              </td>
              <td className="px-4 py-3.5 text-muted-foreground">{lead.service}</td>
              <td className="px-4 py-3.5">
                <Badge variant="outline" className="text-xs font-normal border-border text-muted-foreground">
                  {lead.budget}
                </Badge>
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => onViewDetails(lead)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border min-w-[120px]">
                      {statuses.map((s) => (
                        <DropdownMenuItem
                          key={s}
                          onClick={() => onUpdateStatus(lead.id, s)}
                          className="text-xs cursor-pointer"
                        >
                          Mark as {s}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
