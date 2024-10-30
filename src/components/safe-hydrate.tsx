// src/components/safe-hydrate.tsx
'use client';

import React from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-effect';

export function SafeHydrate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div suppressHydrationWarning>
      {mounted ? children : null}
    </div>
  );
}