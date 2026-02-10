import { useState, useMemo, useCallback } from "react";
import { mockLeads } from "@/data/mockLeads";
import { Lead, LeadStatus } from "@/types/lead";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [serviceFilter, setServiceFilter] = useState<string>("All");

  const services = useMemo(() => {
    const s = new Set(leads.map((l) => l.service));
    return ["All", ...Array.from(s)];
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.company || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      const matchesService = serviceFilter === "All" || lead.service === serviceFilter;
      return matchesSearch && matchesStatus && matchesService;
    });
  }, [leads, search, statusFilter, serviceFilter]);

  const updateStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const newLeadsCount = leads.filter(
      (l) => new Date(l.createdAt).getTime() > weekAgo
    ).length;
    const serviceCounts: Record<string, number> = {};
    leads.forEach((l) => {
      serviceCounts[l.service] = (serviceCounts[l.service] || 0) + 1;
    });
    const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    return { total: leads.length, newLeads: newLeadsCount, topService };
  }, [leads]);

  return {
    leads: filtered,
    allLeads: leads,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    services,
    updateStatus,
    stats,
  };
}

export function exportToCsv(leads: Lead[]) {
  const headers = ["Date", "Name", "Email", "Phone", "Company", "Service", "Division", "Budget", "Timeline", "Status", "Description"];
  const rows = leads.map((l) => [
    new Date(l.createdAt).toLocaleDateString(),
    l.name,
    l.email,
    l.phone || "",
    l.company || "",
    l.service,
    l.division,
    l.budget,
    l.timeline,
    l.status,
    `"${l.description.replace(/"/g, '""')}"`,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `venturemond-leads-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
