import { DailyViewsChart } from "./charts/DailyViewsChart";
import { CategoryDistributionChart } from "./charts/CategoryDistributionChart";
import { MonthlyEngagementChart } from "./charts/MonthlyEngagementChart";
import { PerformanceMetrics } from "./PerformanceMetrics";

export function Analytics() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <PerformanceMetrics />
      <DailyViewsChart />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <CategoryDistributionChart />
        <MonthlyEngagementChart />
      </div>
    </div>
  );
}