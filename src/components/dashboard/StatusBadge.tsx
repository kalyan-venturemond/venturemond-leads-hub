import { Badge } from "@/components/ui/badge";
import { LeadStatus } from "@/types/lead";

const statusConfig: Record<LeadStatus, { className: string }> = {
  New: { className: "bg-status-new/15 text-status-new border-status-new/20 hover:bg-status-new/20" },
  Contacted: { className: "bg-status-contacted/15 text-status-contacted border-status-contacted/20 hover:bg-status-contacted/20" },
  Qualified: { className: "bg-status-qualified/15 text-status-qualified border-status-qualified/20 hover:bg-status-qualified/20" },
  Closed: { className: "bg-status-closed/15 text-status-closed border-status-closed/20 hover:bg-status-closed/20" },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${statusConfig[status].className} transition-colors`}>
      {status}
    </Badge>
  );
}

export function isNewLead(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}
