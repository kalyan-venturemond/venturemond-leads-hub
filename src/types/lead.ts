export type LeadStatus = "New" | "Contacted" | "Qualified" | "Closed";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  division: string;
  budget: string;
  timeline: string;
  description: string;
  otherDescription?: string;
  status: LeadStatus;
  createdAt: string;
}
