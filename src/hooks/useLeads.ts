import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "@/services/api";
import { Lead, LeadStatus } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";

export function useLeads() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [serviceFilter, setServiceFilter] = useState<string>("All");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch leads from API
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getLeads,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mutation for updating lead status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      leadsApi.updateLeadStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['leads'] });

      // Snapshot the previous value
      const previousLeads = queryClient.getQueryData<Lead[]>(['leads']);

      // Optimistically update to the new value
      queryClient.setQueryData<Lead[]>(['leads'], (old) =>
        old?.map((lead) => (lead.id === id ? { ...lead, status } : lead)) || []
      );

      // Return a context object with the snapshotted value
      return { previousLeads };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousLeads) {
        queryClient.setQueryData(['leads'], context.previousLeads);
      }
      toast({
        title: "Error",
        description: "Failed to update lead status. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lead status updated successfully.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  // Mutation for deleting a lead
  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['leads'] });

      // Snapshot the previous value
      const previousLeads = queryClient.getQueryData<Lead[]>(['leads']);

      // Optimistically update to the new value
      queryClient.setQueryData<Lead[]>(['leads'], (old) =>
        old?.filter((lead) => lead.id !== id) || []
      );

      // Return a context object with the snapshotted value
      return { previousLeads };
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousLeads) {
        queryClient.setQueryData(['leads'], context.previousLeads);
      }
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lead deleted successfully.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const services = useMemo(() => {
    const s = new Set(leads.map((l) => l.service).filter(Boolean));
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
    updateStatusMutation.mutate({ id, status });
  }, [updateStatusMutation]);

  const deleteLead = useCallback((id: string) => {
    deleteLeadMutation.mutate(id);
  }, [deleteLeadMutation]);

  const stats = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const newLeadsCount = leads.filter(
      (l) => new Date(l.createdAt).getTime() > weekAgo
    ).length;
    const serviceCounts: Record<string, number> = {};
    leads.forEach((l) => {
      if (l.service) {
        serviceCounts[l.service] = (serviceCounts[l.service] || 0) + 1;
      }
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
    deleteLead,
    stats,
    isLoading,
    error,
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
