'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Tela } from '@/conteudo';

// Várias telas de um projeto, uma ao lado da outra. Dá para passar com o dedo,
// com as setas ou tocando nas bolinhas.

function BotaoSeta({ lado, onClick }: { lado: 'anterior' | 'proxima'; onClick: () => void }) {
  const anterior = lado === 'anterior';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={anterior ? 'Tela anterior' : 'Próxima tela'}
      className={`absolute top-1/2 ${anterior ? 'left-2' : 'right-2'} flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg ring-1 ring-slate-900/10 hover:bg-white`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={anterior ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  );
}

export default function CarrosselTelas({ nome, telas }: { nome: string; telas: Tela[] }) {
  const trilho = useRef<HTMLDivElement>(null);
  const [atual, setAtual] = useState(0);

  function irPara(indice: number) {
    const el = trilho.current;
    if (!el) return;
    const destino = (indice + telas.length) % telas.length;
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: destino * el.clientWidth, behavior: suave ? 'smooth' : 'auto' });
  }

  return (
    <div role="region" aria-roledescription="carrossel" aria-label={`Telas do projeto ${nome}`}>
      <div className="relative">
        <div
          ref={trilho}
          tabIndex={0}
          onScroll={(e) => {
            const el = e.currentTarget;
            setAtual(Math.min(telas.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {telas.map((t, i) => (
            <div key={t.src} role="group" aria-roledescription="tela" aria-label={`${i + 1} de ${telas.length}: ${t.legenda}`} className="w-full shrink-0 snap-center">
              <Image src={t.src} alt={`${nome}: ${t.legenda}`} width={1200} height={750} sizes="(min-width: 1024px) 560px, 100vw" className="h-auto w-full" />
            </div>
          ))}
        </div>
        <BotaoSeta lado="anterior" onClick={() => irPara(atual - 1)} />
        <BotaoSeta lado="proxima" onClick={() => irPara(atual + 1)} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-3 py-2">
        <p className="min-w-0 truncate text-xs font-medium text-slate-600" aria-live="polite">
          <span className="font-bold text-slate-900">{atual + 1}/{telas.length}</span> · {telas[atual].legenda}
        </p>
        <div className="flex shrink-0 items-center">
          {telas.map((t, i) => (
            <button key={t.src} type="button" onClick={() => irPara(i)} aria-label={`Ver tela ${i + 1}: ${t.legenda}`} aria-current={i === atual} className="p-1">
              <span className={`block h-2 rounded-full transition-all ${i === atual ? 'w-5 bg-teal-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
