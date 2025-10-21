// components/dashboard/MetricsOverview.tsx
import { FileText, DollarSign, Calendar, TrendingUp } from "lucide-react";

export default function MetricsOverview({
  totalCount,
  avgSettlement,
  monthlyCount,
  highPriorityCount,
}) {
  const cards = [
    { label: "Total Cases", value: totalCount, icon: FileText, color: "blue" },
    {
      label: "Avg Settlement",
      value: `$${avgSettlement.toLocaleString()}`,
      icon: DollarSign,
      color: "green",
    },
    {
      label: "This Month",
      value: monthlyCount,
      icon: Calendar,
      color: "purple",
    },
    {
      label: "High Priority",
      value: highPriorityCount,
      icon: TrendingUp,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">{label}</p>
              <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`bg-${color}-100 p-3 rounded-lg`}>
              <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
