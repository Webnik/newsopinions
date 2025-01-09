import { useEffect } from "react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

export function PerformanceMonitor() {
  const metrics = usePerformanceMonitor();

  useEffect(() => {
    // Send metrics to analytics service or log them
    const logMetrics = () => {
      if (process.env.NODE_ENV === 'development') {
        console.group('Performance Metrics');
        console.log('Page Load Time:', Math.round(metrics.pageLoadTime), 'ms');
        console.log('First Contentful Paint:', Math.round(metrics.firstContentfulPaint), 'ms');
        console.log('Time to Interactive:', Math.round(metrics.timeToInteractive), 'ms');
        console.groupEnd();
      }
    };

    logMetrics();
  }, [metrics]);

  // This component doesn't render anything visible
  return null;
}