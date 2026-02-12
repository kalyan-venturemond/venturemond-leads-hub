import { Lead, LeadStatus } from "@/types/lead";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mail, Phone, Building2, Calendar, Clock, DollarSign, Layers, FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface LeadDetailPanelProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Closed"];

export default function LeadDetailPanel({ lead, open, onClose, onUpdateStatus, onDelete }: LeadDetailPanelProps) {
  if (!lead) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-card border-l border-border w-full sm:max-w-lg overflow-y-auto p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <div>
            <SheetTitle className="text-lg font-semibold text-foreground">
              {lead.name}
            </SheetTitle>
            <p className="text-sm text-muted-foreground mt-0.5">{lead.company || "No company"}</p>
          </div>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Contact</h3>
            <div className="space-y-2">
              <a href={`mailto:${lead.email}`} className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors group">
                <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                {lead.email}
              </a>
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors group">
                  <Phone className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  {lead.phone}
                </a>
              )}
              {lead.company && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  {lead.company}
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-3">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Project</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem icon={Layers} label="Service" value={lead.service} />
              <DetailItem
                icon={Building2}
                label="Division"
                value={lead.division ? (lead.division.includes("Services") ? "Services" : "Studio") : "—"}
              />
              <DetailItem icon={DollarSign} label="Budget" value={lead.budget} />
              <DetailItem icon={Clock} label="Timeline" value={lead.timeline} />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Status</h3>
            <Select
              value={lead.status}
              onValueChange={(v) => onUpdateStatus(lead.id, v as LeadStatus)}
            >
              <SelectTrigger className="w-full bg-background border-border h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {statuses.map((s) => (
                  <SelectItem key={s} value={s} className="cursor-pointer">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Description</h3>
            <p className="text-sm text-foreground/80 leading-relaxed bg-background rounded-lg p-4 border border-border">
              {lead.description}
            </p>
          </div>

          {lead.otherDescription && (
            <div className="space-y-3">
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Additional Notes</h3>
              <p className="text-sm text-foreground/80 leading-relaxed bg-background rounded-lg p-4 border border-border">
                {lead.otherDescription}
              </p>
            </div>
          )}

          {/* Submission Info */}
          <div className="space-y-3">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Submitted</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {format(new Date(lead.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <a href={`mailto:${lead.email}`} className="flex-1">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 active:scale-[0.98] transition-all">
                <Mail className="w-4 h-4 mr-2" />
                Email Lead
              </Button>
            </a>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the lead
                    <strong> {lead.name}</strong> and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      onDelete(lead.id);
                      onClose();
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-background rounded-lg p-3 border border-border">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
