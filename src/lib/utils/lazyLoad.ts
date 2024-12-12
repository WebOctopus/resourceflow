import { lazy, Suspense } from 'react';
import type { ComponentType } from 'react';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
}

export function lazyLoadComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const LazyComponent = lazy(importFn);

  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={options.fallback || <div>Loading...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

export function preloadComponent(importFn: () => Promise<{ default: any }>) {
  const component = lazy(importFn);
  component.preload?.();
}