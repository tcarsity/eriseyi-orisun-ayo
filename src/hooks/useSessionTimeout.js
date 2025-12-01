import React, { useEffect, useRef, useState } from "react";
import useActivityTracker from "./useActivityTracker";

export default function useSessionTimeout({
  timeout = 15 * 60 * 1000,
  warningDuration = 60 * 1000,
  onTimeout,
  onWarning,
}) {
  const [timeLeft, setTimeLeft] = useState(timeout);
  const timerRef = useRef(null);
  const lastActive = useRef(Date.now());

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    lastActive.current = Date.now();
    setTimeLeft(timeout);
  };

  useActivityTracker(resetTimer);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      clearTimer();
      return;
    }

    const tick = () => {
      const elapsed = Date.now() - lastActive.current;
      const remaining = timeout - elapsed;
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearTimer();
        onTimeout?.();
      } else if (remaining <= warningDuration) {
        onWarning?.(Math.ceil(remaining / 1000));
      }
    };

    timerRef.current = setInterval(tick, 1000);

    return () => clearTimer();
  }, [timeout, warningDuration, onTimeout, onWarning]);

  return { timeLeft, resetTimer, clearTimer };
}
