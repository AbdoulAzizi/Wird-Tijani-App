import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * usePracticeTimer
 *
 * A start/pause/reset stopwatch for timing dhikr sessions.
 * Designed to be embedded in StatsBar as a replacement for the streak stat.
 *
 * @returns
 *   elapsed    — total seconds accumulated so far
 *   isRunning  — whether the timer is currently ticking
 *   start      — start or resume the timer
 *   pause      — pause without resetting
 *   toggle     — convenience: start if paused, pause if running
 *   reset      — stop and set elapsed back to 0
 *   stop       — pause and return the final elapsed value (call before saving)
 *   formatted  — display string: "MM:SS" or "HH:MM:SS" when ≥ 1 hour
 */
export function usePracticeTimer() {
  const [elapsed,   setElapsed]   = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Wall-clock reference: when did the current run segment start?
  const startedAt   = useRef<number | null>(null);
  // How many seconds were already accumulated before the current run segment
  const accumulated = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // ── Tick every second ────────────────────────────────────────────────────
  useEffect(() => {
    if (isRunning) {
      startedAt.current = Date.now();
      intervalRef.current = setInterval(() => {
        const segmentSeconds = Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000);
        setElapsed(accumulated.current + segmentSeconds);
      }, 500); // poll at 500 ms for snappier display without extra cost
    } else {
      clearTick();
    }
    return clearTick;
  }, [isRunning]);

  // ── Controls ─────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    if (isRunning) return;
    startedAt.current = Date.now();
    setIsRunning(true);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    // Snapshot accumulated time before stopping
    const segmentSeconds = Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000);
    accumulated.current += segmentSeconds;
    setElapsed(accumulated.current);
    setIsRunning(false);
  }, [isRunning]);

  const toggle = useCallback(() => {
    if (isRunning) pause(); else start();
  }, [isRunning, start, pause]);

  /** Pause and return the final elapsed value — call this just before saving. */
  const stop = useCallback((): number => {
    if (isRunning) {
      const segmentSeconds = Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000);
      accumulated.current += segmentSeconds;
      setElapsed(accumulated.current);
      setIsRunning(false);
    }
    return accumulated.current;
  }, [isRunning]);

  const reset = useCallback(() => {
    clearTick();
    accumulated.current = 0;
    startedAt.current   = null;
    setElapsed(0);
    setIsRunning(false);
  }, []);

  // ── Formatting ───────────────────────────────────────────────────────────
  const formatted = formatElapsed(elapsed);

  return { elapsed, isRunning, start, pause, toggle, stop, reset, formatted };
}

/** "MM:SS" below 1 h, "HH:MM:SS" at or above 1 h */
export function formatElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');

  if (h > 0) {
    const hh = String(h).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}