import { DailyViewsChart } from "./charts/DailyViewsChart";
import { CategoryDistributionChart } from "./charts/CategoryDistributionChart";
import { MonthlyEngagementChart } from "./charts/MonthlyEngagementChart";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { ContentModeration } from "./ContentModeration";
import { ReportingSystem } from "./ReportingSystem";

export function Analytics() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics & Moderation</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <PerformanceMetrics />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContentModeration />
          <ReportingSystem />
        </div>
        
        <DailyViewsChart />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CategoryDistributionChart />
          <MonthlyEngagementChart />
        </div>
      </div>
    </div>
  );
}