import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (totalSeconds) => {
  const [remSec, setRemSec] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemSec(totalSeconds);
    setIsComplete(false);
    setIsPaused(false);
  }, [totalSeconds]);

  const toggle = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setRemSec(totalSeconds);
    setIsPaused(false);
    setIsComplete(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (remSec <= 0) {
      setIsComplete(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setRemSec((prev) => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, remSec]);

  return {
    remSec,
    isPaused,
    toggle,
    reset,
    isComplete,
    elapsed: totalSeconds - remSec
  };
};
