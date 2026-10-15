'use client';

import { MotionConfig } from 'motion/react';

// Respeita a opção "reduzir movimento" do aparelho em todas as animações do site.
export default function ProvedorMovimento({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
