import { useState, useEffect, useCallback } from "react";
import TopBar from "@/components/dashboard/TopBar";
import StatsCards from "@/components/dashboard/StatsCards";
import FiltersBar from "@/components/dashboard/FiltersBar";
import LeadsTable from "@/components/dashboard/LeadsTable";
import LeadDetailPanel from "@/components/dashboard/LeadDetailPanel";
import { useLeads, exportToCsv } from "@/hooks/useLeads";
import { Lead } from "@/types/lead";

export default function DashboardPage() {
  const {
    leads,
    allLeads,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    services,
    updateStatus,
    stats,
  } = useLeads();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleViewDetails = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setPanelOpen(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setPanelOpen(false);
    setTimeout(() => setSelectedLead(null), 300);
  }, []);

  const handleExport = useCallback(() => {
    exportToCsv(leads.length > 0 ? leads : allLeads);
  }, [leads, allLeads]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const active = document.activeElement;
        if (active?.tagName !== "INPUT" && active?.tagName !== "TEXTAREA") {
          e.preventDefault();
          const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
          searchInput?.focus();
        }
      }
      if (e.key === "Escape") {
        handleClosePanel();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClosePanel]);

  // Keep selected lead in sync after status updates
  useEffect(() => {
    if (selectedLead) {
      const updated = allLeads.find((l) => l.id === selectedLead.id);
      if (updated) setSelectedLead(updated);
    }
  }, [allLeads, selectedLead]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="animate-fade-in">
          <StatsCards total={stats.total} newLeads={stats.newLeads} topService={stats.topService} />
        </div>

        {/* Filters */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <FiltersBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            serviceFilter={serviceFilter}
            onServiceChange={setServiceFilter}
            services={services}
            onExport={handleExport}
          />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: "150ms" }}>
          <LeadsTable
            leads={leads}
            onViewDetails={handleViewDetails}
            onUpdateStatus={updateStatus}
          />
        </div>
      </main>

      {/* Detail Panel */}
      <LeadDetailPanel
        lead={selectedLead}
        open={panelOpen}
        onClose={handleClosePanel}
        onUpdateStatus={(id, status) => {
          updateStatus(id, status);
        }}
      />
    </div>
  );
}
