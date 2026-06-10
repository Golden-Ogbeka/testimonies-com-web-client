'use client';

import { useEffect, useState } from 'react';

export function useCooldown(seconds: number) {
  const [cooldown, setCooldown] = useState(0);
  const isRunning = cooldown > 0;

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const reset = () => setCooldown(seconds);

  const fmt = () => {
    const m = Math.floor(cooldown / 60);
    const s = cooldown % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return { cooldown, isRunning, reset, fmt };
}
