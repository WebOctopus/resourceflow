import { useState, useCallback } from 'react';
import { LoadTester } from '../utils/performance';

export function useLoadTest(concurrentUsers: number = 100) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTest = useCallback(async (testFn: () => Promise<void>) => {
    setIsRunning(true);
    try {
      const tester = new LoadTester(concurrentUsers);
      const testResults = await tester.simulateLoad(testFn);
      setResults(testResults);
    } catch (error) {
      console.error('Load test failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [concurrentUsers]);

  return {
    isRunning,
    results,
    runTest,
  };
}