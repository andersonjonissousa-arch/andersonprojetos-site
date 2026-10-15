'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';

// Frase grande que "acende" palavra por palavra conforme a pessoa rola a página.

function Palavra({ texto, progresso, inicio, fim, destaque }: { texto: string; progresso: MotionValue<number>; inicio: number; fim: number; destaque: boolean }) {
  const opacidade = useTransform(progresso, [inicio, fim], [0.16, 1]);
  return (
    <motion.span style={{ opacity: opacidade }} className={destaque ? 'text-teal-400' : undefined}>
      {texto}{' '}
    </motion.span>
  );
}

export default function FraseRevelada({ frase, destaques = [], className }: { frase: string; destaques?: string[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const palavras = frase.split(' ');
  return (
    <p ref={ref} className={className}>
      {palavras.map((p, i) => (
        <Palavra
          key={i}
          texto={p}
          progresso={scrollYProgress}
          inicio={i / palavras.length}
          fim={(i + 1) / palavras.length}
          destaque={destaques.includes(p.replace(/[.,!?]/g, ''))}
        />
      ))}
    </p>
  );
}
