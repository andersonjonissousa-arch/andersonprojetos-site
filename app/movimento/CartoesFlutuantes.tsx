'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';

// Telas de projetos flutuando em volta de um conteúdo, cada uma numa velocidade
// (efeito de profundidade ao rolar a página). Só aparecem em telas médias e grandes.

export type CartaoFlutuante = { src: string; alt: string; lugar: string; largura: number; velocidade: number; giro: number };

function Cartao({ c, progresso }: { c: CartaoFlutuante; progresso: MotionValue<number> }) {
  const y = useTransform(progresso, [0, 1], [c.velocidade, -c.velocidade]);
  const rotate = useTransform(progresso, [0, 1], [c.giro, -c.giro]);
  return (
    <motion.div style={{ y, rotate, width: c.largura }} className={`absolute hidden lg:block ${c.lugar}`}>
      <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/15">
        <Image src={c.src} alt={c.alt} width={1200} height={750} sizes={`${c.largura}px`} className="h-auto w-full" />
      </div>
    </motion.div>
  );
}

export default function CartoesFlutuantes({ cartoes, children, className }: { cartoes: CartaoFlutuante[]; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <div aria-hidden="true">
        {cartoes.map((c) => <Cartao key={c.src} c={c} progresso={scrollYProgress} />)}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
