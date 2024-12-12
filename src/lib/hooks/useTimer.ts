import { useState, useEffect } from 'react';

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
  pausedTime: number;
}

export function useTimer(initialTime: number = 0) {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsedTime: initialTime,
    pausedTime: 0,
  });

  useEffect(() => {
    let intervalId: number;

    if (state.isRunning && state.startTime) {
      intervalId = window.setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - state.startTime + state.pausedTime) / 1000);
        setState(prev => ({ ...prev, elapsedTime: elapsed }));
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.isRunning, state.startTime]);

  const start = () => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      startTime: Date.now(),
      pausedTime: prev.elapsedTime * 1000,
    }));
  };

  const pause = () => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      pausedTime: prev.elapsedTime * 1000,
    }));
  };

  const resume = () => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      startTime: Date.now(),
    }));
  };

  const stop = () => {
    const finalTime = state.elapsedTime;
    setState({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      pausedTime: 0,
    });
    return finalTime;
  };

  const reset = () => {
    setState({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      pausedTime: 0,
    });
  };

  return {
    isRunning: state.isRunning,
    elapsedTime: state.elapsedTime,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}