'use client';

import { motion } from 'motion/react';

// Faz o conteúdo surgir de baixo, suave, quando entra na tela (uma vez só).
// Quem pediu "reduzir movimento" no aparelho vê só o esmaecer, sem deslizar (ver ProvedorMovimento).

const TAGS = { div: motion.div, li: motion.li, article: motion.article };

export default function Surgir({
  children,
  atraso = 0,
  className,
  como = 'div',
}: {
  children: React.ReactNode;
  atraso?: number;
  className?: string;
  como?: keyof typeof TAGS;
}) {
  const Tag = TAGS[como];
  return (
    <Tag
      // min-w-0: dentro de grades, não deixa o conteúdo (ex.: carrossel) alargar a coluna
      className={`min-w-0 ${className ?? ''}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
