'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

// Número que conta do zero até o valor quando aparece na tela.
// Sem JavaScript (ou com "reduzir movimento"), mostra direto o valor final.
export default function Contador({ valor, sufixo = '' }: { valor: number; sufixo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visivel = useInView(ref, { once: true, amount: 0.6 });
  const reduzir = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduzir) return;
    const escrever = (v: number) => (el.textContent = Math.round(v) + sufixo);
    if (!visivel) {
      escrever(0);
      return;
    }
    const controle = animate(0, valor, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: escrever });
    return () => controle.stop();
  }, [visivel, reduzir, valor, sufixo]);

  return (
    <span ref={ref} className="tabular-nums">
      {valor}
      {sufixo}
    </span>
  );
}
