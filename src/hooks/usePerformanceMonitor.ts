import { useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
}

export function usePerformanceMonitor() {
  const { toast } = useToast();
  const metricsRef = useRef<PerformanceMetrics>({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    timeToInteractive: 0,
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          metricsRef.current.pageLoadTime = navEntry.loadEventEnd - navEntry.startTime;
        }
        
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          metricsRef.current.firstContentfulPaint = entry.startTime;
        }

        if (entry.entryType === 'largest-contentful-paint') {
          metricsRef.current.timeToInteractive = entry.startTime;
        }
      });

      // Log performance metrics to console for debugging
      console.log('Performance Metrics:', metricsRef.current);

      // Show toast if page load time is too high
      if (metricsRef.current.pageLoadTime > 3000) {
        toast({
          title: "Performance Alert",
          description: "Page load time is higher than expected. This might affect user experience.",
          variant: "destructive",
        });
      }
    });

    // Observe different types of performance entries
    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });

    return () => {
      observer.disconnect();
    };
  }, [toast]);

  return metricsRef.current;
}