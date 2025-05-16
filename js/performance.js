// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.observePageLoad();
    this.observePaint();
    this.observeLayout();
    this.observeResources();
    this.observeLongTasks();
  }

  observePageLoad() {
    // Navigation Timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const metrics = {
        // Time to First Byte
        ttfb: navigation.responseStart - navigation.requestStart,
        // DOM Content Loaded
        dcl: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        // Load Complete
        loadComplete: navigation.loadEventEnd - navigation.fetchStart
      };
      
      this.sendMetrics('navigation', metrics);
    });
  }

  observePaint() {
    // Paint Timing
    const paintObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.sendMetrics('paint', {
          [entry.name]: entry.startTime
        });
      });
    });

    paintObserver.observe({ entryTypes: ['paint'] });
  }

  observeLayout() {
    // Layout Shifts
    const layoutObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          this.sendMetrics('layout-shift', {
            value: entry.value,
            timestamp: entry.startTime
          });
        }
      });
    });

    layoutObserver.observe({ entryTypes: ['layout-shift'] });
  }

  observeResources() {
    // Resource Timing
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 1000) { // Log slow resources (>1s)
          this.sendMetrics('slow-resource', {
            name: entry.name,
            duration: entry.duration,
            type: entry.initiatorType
          });
        }
      });
    });

    resourceObserver.observe({ entryTypes: ['resource'] });
  }

  observeLongTasks() {
    // Long Tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        this.sendMetrics('long-task', {
          duration: entry.duration,
          timestamp: entry.startTime
        });
      });
    });

    longTaskObserver.observe({ entryTypes: ['longtask'] });
  }

  sendMetrics(type, data) {
    // Send to Google Analytics
    if (window.gtag) {
      gtag('event', `performance_${type}`, {
        event_category: 'Performance',
        ...data
      });
    }

    // Log to console in development
    if (location.hostname === 'localhost') {
      console.log(`Performance ${type}:`, data);
    }
  }
}

// Initialize performance monitoring
window.addEventListener('load', () => {
  new PerformanceMonitor();
}); 