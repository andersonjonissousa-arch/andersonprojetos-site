'use client';

import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';

// Cartões dos serviços em roda, em volta de um conteúdo. Ao rolar a página eles giram
// (no lugar e em volta do centro) e se afastam. No celular viram uma fileira acima do texto.

const CARTOES = [
  { rotulo: 'Sites', icone: 'M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01' },
  { rotulo: 'Sistemas', icone: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5' },
  { rotulo: 'Planilhas', icone: 'M4 4h16v16H4zM4 10h16M4 15h16M10 4v16' },
  { rotulo: 'Automação', icone: 'M13 3L4 14h7l-1 7 9-11h-7l1-7z' },
  { rotulo: 'WhatsApp', icone: 'M21 12a9 9 0 01-13.3 7.9L3 21l1.2-4.5A9 9 0 1121 12z' },
  { rotulo: 'Dashboards', icone: 'M5 20V10m5 10V4m5 16v-7m5 7V8' },
  { rotulo: 'Agenda', icone: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4' },
  { rotulo: 'Apps', icone: 'M8 3h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2zm3 15h2' },
];

function Cartao({ rotulo, icone, pequeno }: { rotulo: string; icone: string; pequeno?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-teal-300/25 bg-[linear-gradient(135deg,#0d2b27_0%,#081a18_55%,#10463e_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.55),0_0_40px_rgba(45,212,191,0.14)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_42%,rgba(45,212,191,0.38),transparent_58%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_32%,rgba(255,255,255,0.10)_46%,transparent_60%)]" />
      <span className={`absolute inset-y-0 left-0 flex rotate-180 items-center justify-center font-semibold uppercase text-teal-100/60 [writing-mode:vertical-rl] ${pequeno ? 'w-4 text-[6px] tracking-[0.18em]' : 'w-6 text-[9px] tracking-[0.25em]'}`}>
        {rotulo}
      </span>
      <svg className={`absolute left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-200 drop-shadow-[0_0_10px_rgba(45,212,191,0.9)] ${pequeno ? 'h-7 w-7' : 'h-12 w-12'}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d={icone} />
      </svg>
    </div>
  );
}

function CartaoNaRoda({ c, i, progresso, rx, ry }: { c: (typeof CARTOES)[number]; i: number; progresso: MotionValue<number>; rx: MotionValue<number>; ry: MotionValue<number> }) {
  const angulo = (i / CARTOES.length) * Math.PI * 2 - Math.PI / 2 + 0.3;
  const sentido = i % 2 === 0 ? 1 : -1;
  const x = useTransform([progresso, rx], ([p, r]: number[]) => Math.cos(angulo + p * 0.9) * r * (0.84 + p * 0.3));
  const y = useTransform([progresso, ry], ([p, r]: number[]) => Math.sin(angulo + p * 0.9) * r * (0.84 + p * 0.3));
  const rotate = useTransform(progresso, [0, 1], [i * 11 - 40 * sentido, i * 11 + 60 * sentido]);
  const rotateX = useTransform(progresso, [0, 1], [20, -20]);
  const rotateY = useTransform(progresso, [0, 1], [-25 * sentido, 25 * sentido]);
  return (
    <motion.div style={{ x, y, rotate, rotateX, rotateY }} className="absolute left-1/2 top-1/2 -ml-[60px] -mt-[60px] h-[120px] w-[120px]">
      <Cartao rotulo={c.rotulo} icone={c.icone} />
    </motion.div>
  );
}

function CartaoNaFileira({ c, i, progresso }: { c: (typeof CARTOES)[number]; i: number; progresso: MotionValue<number> }) {
  const sentido = i % 2 === 0 ? 1 : -1;
  const rotate = useTransform(progresso, [0, 1], [-30 * sentido, 45 * sentido]);
  const rotateY = useTransform(progresso, [0, 1], [-30 * sentido, 30 * sentido]);
  const y = useTransform(progresso, [0, 1], [24 * sentido, -24 * sentido]);
  return (
    <motion.div style={{ rotate, rotateY, y }} className="h-16 w-16 shrink-0">
      <Cartao rotulo={c.rotulo} icone={c.icone} pequeno />
    </motion.div>
  );
}

export default function CartoesGirando({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rx = useMotionValue(520);
  const ry = useMotionValue(330);

  // O tamanho da roda acompanha o tamanho da faixa.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      rx.set(Math.min(el.clientWidth * 0.44, 600));
      ry.set(el.clientHeight * 0.36);
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, [rx, ry]);

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <div className="pointer-events-none absolute inset-0 hidden [perspective:900px] lg:block" aria-hidden="true">
        {CARTOES.map((c, i) => <CartaoNaRoda key={c.rotulo} c={c} i={i} progresso={scrollYProgress} rx={rx} ry={ry} />)}
      </div>
      <div className="pointer-events-none mb-12 flex justify-center gap-5 [perspective:600px] lg:hidden" aria-hidden="true">
        {CARTOES.slice(0, 4).map((c, i) => <CartaoNaFileira key={c.rotulo} c={c} i={i} progresso={scrollYProgress} />)}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
