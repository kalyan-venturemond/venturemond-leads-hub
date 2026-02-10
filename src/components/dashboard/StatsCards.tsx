import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Briefcase } from "lucide-react";

interface StatsCardsProps {
  total: number;
  newLeads: number;
  topService: string;
}

export default function StatsCards({ total, newLeads, topService }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Leads",
      value: total.toString(),
      icon: Users,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "New (7 days)",
      value: newLeads.toString(),
      icon: TrendingUp,
      accent: "text-status-contacted",
      bg: "bg-status-contacted/10",
    },
    {
      label: "Top Service",
      value: topService,
      icon: Briefcase,
      accent: "text-status-qualified",
      bg: "bg-status-qualified/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="bg-card border-border p-5 hover:border-primary/20 transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 ${card.accent}`} />
            </div>
          </div>
          <p className="text-2xl font-semibold text-foreground">{card.value}</p>
        </Card>
      ))}
    </div>
  );
}
