import { format } from 'date-fns';

export interface PerformanceMetrics {
  loadTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  largestContentfulPaint: number;
}

export interface LoadTestResult {
  totalTime: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  successfulRequests: number;
  failedRequests: number;
  requestsPerSecond: number;
}

export class LoadTester {
  private concurrentUsers: number;
  private metrics: { duration: number }[] = [];

  constructor(concurrentUsers: number = 100) {
    this.concurrentUsers = concurrentUsers;
  }

  async simulateLoad(callback: () => Promise<void>): Promise<LoadTestResult> {
    const startTime = performance.now();
    const promises = Array(this.concurrentUsers).fill(null).map(async () => {
      const userStartTime = performance.now();
      try {
        await callback();
        const userEndTime = performance.now();
        this.metrics.push({ duration: userEndTime - userStartTime });
        return true;
      } catch (error) {
        return false;
      }
    });

    const results = await Promise.all(promises);
    const endTime = performance.now();
    const totalTime = endTime - startTime;

    const successfulRequests = results.filter(Boolean).length;
    const failedRequests = this.concurrentUsers - successfulRequests;

    const durations = this.metrics.map(m => m.duration);
    const averageResponseTime = durations.reduce((sum, time) => sum + time, 0) / durations.length;
    const maxResponseTime = Math.max(...durations);
    const minResponseTime = Math.min(...durations);
    const requestsPerSecond = (successfulRequests / totalTime) * 1000;

    return {
      totalTime,
      averageResponseTime,
      maxResponseTime,
      minResponseTime,
      successfulRequests,
      failedRequests,
      requestsPerSecond,
    };
  }
}

export const measurePerformance = (): Promise<PerformanceMetrics> => {
  return new Promise((resolve) => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const metrics: PerformanceMetrics = {
        loadTime: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        timeToInteractive: 0,
        largestContentfulPaint: 0,
      };

      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'navigation':
            metrics.loadTime = entry.duration;
            metrics.timeToInteractive = (entry as PerformanceNavigationTiming).domInteractive;
            break;
          case 'paint':
            if (entry.name === 'first-paint') {
              metrics.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
              metrics.firstContentfulPaint = entry.startTime;
            }
            break;
          case 'largest-contentful-paint':
            metrics.largestContentfulPaint = entry.startTime;
            break;
        }
      });

      observer.disconnect();
      resolve(metrics);
    });

    observer.observe({
      entryTypes: ['navigation', 'paint', 'largest-contentful-paint'],
    });
  });
};

export const measureResourceTiming = () => {
  const resources = performance.getEntriesByType('resource');
  return resources.map((resource) => ({
    name: resource.name,
    duration: resource.duration,
    size: resource.transferSize,
    type: resource.initiatorType,
  }));
};

export const measureMemoryUsage = async () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }
  return null;
};

export const formatMetrics = (metrics: LoadTestResult): string => {
  return `
Load Test Results:
-----------------
Total Time: ${format(metrics.totalTime, 'mm:ss.SSS')}
Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms
Max Response Time: ${metrics.maxResponseTime.toFixed(2)}ms
Min Response Time: ${metrics.minResponseTime.toFixed(2)}ms
Successful Requests: ${metrics.successfulRequests}
Failed Requests: ${metrics.failedRequests}
Requests/Second: ${metrics.requestsPerSecond.toFixed(2)}
  `.trim();
};