'use client';

import { motion, useAnimationFrame, useMotionValue, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { CartaoFerramenta, FERRAMENTAS_CARTOES, type Ferramenta } from './cartoes-ferramentas';

// Cena "presa" na tela enquanto a pessoa rola (no estilo da paypath.ai):
// - os cartões das ferramentas formam uma roda perto das bordas, que gira sozinha devagar;
// - ao rolar, as palavras do meio aparecem uma a uma (chegam coloridas e depois ficam brancas)
//   e a roda se abre, com os cartões crescendo;
// - no fim, tudo se desfaz em desfoque e dá lugar aos números.
// Com "reduzir movimento", vira uma faixa parada com tudo à mostra.

export type Numero = { valor: number; sufixo: string; texto: string };

// Trechos da rolagem (0 = a seção começa a entrar na tela; 1 = a seção termina).
const FASES = {
  palavras: [0.26, 0.7], // as palavras aparecem neste trecho
  saida: [0.8, 0.9], // frase e cartões se desfazem
  numeros: [0.84, 0.94], // os números aparecem
};

// Raio da roda (fração da largura/altura da tela), no começo e no fim da rolagem.
const RODA = {
  largo: { x: [0.4, 0.62], y: [0.42, 0.62] },
  estreito: { x: [0.62, 0.8], y: [0.4, 0.55] }, // celular: cartões dos lados ficam quase fora da tela
};

// Preferências do aparelho lidas sem atrapalhar a montagem da página.
function useConsulta(consulta: string, noServidor: boolean) {
  return useSyncExternalStore(
    (aviso) => {
      const m = window.matchMedia(consulta);
      m.addEventListener('change', aviso);
      return () => m.removeEventListener('change', aviso);
    },
    () => window.matchMedia(consulta).matches,
    () => noServidor,
  );
}

type Roda = (typeof RODA)['largo'];

function CartaoNaRoda({ f, i, roda, progresso, tempo, largura, altura }: {
  f: Ferramenta; i: number; roda: Roda; progresso: MotionValue<number>; tempo: MotionValue<number>; largura: MotionValue<number>; altura: MotionValue<number>;
}) {
  const base = (i / FERRAMENTAS_CARTOES.length) * Math.PI * 2;
  const giroProprio = [-18, 14, -10, 22, -24, 12, -14, 20][i % 8];
  const entre = (de: number, ate: number, p: number) => de + (ate - de) * Math.min(1, Math.max(0, p));
  // Ângulo na roda: gira sozinho com o tempo (uma volta a cada ~100 s) e um pouco mais ao rolar.
  const angulo = useTransform([tempo, progresso], ([t, p]: number[]) => base + t * 0.00006 + p * 0.9);
  const x = useTransform([angulo, progresso, largura], ([a, p, w]: number[]) => Math.cos(a) * entre(roda.x[0], roda.x[1], p) * w);
  const y = useTransform([angulo, progresso, altura], ([a, p, h]: number[]) => Math.sin(a) * entre(roda.y[0], roda.y[1], p) * h);
  const rotate = useTransform([tempo, progresso], ([t, p]: number[]) => giroProprio + Math.sin(t * 0.0004 + i) * 6 + p * 40);
  const scale = useTransform(progresso, [0, 0.8, 0.92], [0.9, 1.35, 1.9]);
  const opacity = useTransform(progresso, [0.02, 0.18, FASES.saida[0], FASES.saida[1]], [0, 1, 1, 0]);
  const filter = useTransform(progresso, FASES.saida, ['blur(0px)', 'blur(14px)']);
  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity, filter }}
      className="absolute left-1/2 top-1/2 -ml-[clamp(2.25rem,5vw,4.75rem)] -mt-[clamp(2.25rem,5vw,4.75rem)] w-[clamp(4.5rem,10vw,9.5rem)]"
    >
      <CartaoFerramenta f={f} />
    </motion.div>
  );
}

// Uma palavra: aparece no seu momento, chega colorida e depois fica branca
// (as destacadas com *asteriscos* continuam coloridas).
function Palavra({ texto, destaque, progresso, momento }: { texto: string; destaque: boolean; progresso: MotionValue<number>; momento: number }) {
  const opacity = useTransform(progresso, [momento - 0.03, momento], [0, 1]);
  const y = useTransform(progresso, [momento - 0.03, momento], [10, 0]);
  const color = useTransform(progresso, [momento, momento + 0.08], ['#5eead4', destaque ? '#5eead4' : '#f8fafc']);
  return (
    <motion.span style={{ opacity, y, color }} className="inline-block whitespace-pre">
      {texto}
    </motion.span>
  );
}

// Número que conta conforme a rolagem (dentro da cena presa, o "contar ao aparecer" não serve).
function NumeroRolagem({ n, progresso }: { n: Numero; progresso: MotionValue<number> }) {
  const valor = useTransform(progresso, FASES.numeros, [0, n.valor], { clamp: true });
  const texto = useTransform(valor, (v) => Math.round(v) + n.sufixo);
  return (
    <div>
      <motion.p className="text-5xl font-extrabold text-white tabular-nums sm:text-7xl">{texto}</motion.p>
      <p className="mt-2 text-xs leading-snug text-slate-300 sm:text-base">{n.texto}</p>
    </div>
  );
}

export default function CenaFerramentas({ linhas, numeros }: { linhas: string[]; numeros: Numero[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLDivElement>(null);
  const parado = useConsulta('(prefers-reduced-motion: reduce)', false);
  const largo = useConsulta('(min-width: 768px)', true);
  const roda = largo ? RODA.largo : RODA.estreito;
  const largura = useMotionValue(1280);
  const altura = useMotionValue(800);
  const tempo = useMotionValue(0);
  const visivel = useRef(false);

  // Tamanho da área da cena (para a roda caber na tela) e se ela está à vista.
  useEffect(() => {
    const el = tela.current;
    if (!el) return;
    const medir = () => {
      largura.set(el.clientWidth);
      altura.set(el.clientHeight);
    };
    medir();
    const tamanho = new ResizeObserver(medir);
    tamanho.observe(el);
    const vista = new IntersectionObserver(([e]) => (visivel.current = e.isIntersecting));
    vista.observe(el);
    return () => {
      tamanho.disconnect();
      vista.disconnect();
    };
  }, [largura, altura]);

  // A roda gira sozinha (só quando a cena está à vista e sem "reduzir movimento").
  useAnimationFrame((_, delta) => {
    if (visivel.current && !parado) tempo.set(tempo.get() + Math.min(delta, 50));
  });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const fixo = useMotionValue(0.75);
  const um = useMotionValue(1);
  const progresso = parado ? fixo : scrollYProgress;

  // Frase e números: a frase some no fim e os números aparecem no lugar.
  const fraseOpacidade = useTransform(progresso, FASES.saida, [1, 0]);
  const fraseFiltro = useTransform(progresso, FASES.saida, ['blur(0px)', 'blur(12px)']);
  const numerosOpacidade = useTransform(progresso, FASES.numeros, [0, 1]);
  const numerosFiltro = useTransform(progresso, FASES.numeros, ['blur(12px)', 'blur(0px)']);
  const numerosY = useTransform(progresso, FASES.numeros, [30, 0]);

  // Todas as palavras em sequência, com o momento em que cada uma aparece.
  const palavras = linhas.map((l) => l.split('*').flatMap((parte, j) => (parte.match(/\S+\s*|\s+/g) ?? []).map((t) => ({ t, destaque: j % 2 === 1 }))));
  const total = palavras.reduce((n, l) => n + l.length, 0);
  let contador = 0;
  const [inicio, fim] = FASES.palavras;

  const frase = (
    <p className="max-w-4xl text-center text-[1.65rem] font-semibold leading-snug tracking-tight text-white [text-shadow:0_2px_30px_rgba(2,6,23,0.85)] sm:text-5xl sm:leading-tight lg:text-6xl">
      {palavras.map((linha, i) => (
        <span key={i} className="block">
          {linha.map((p) => {
            const momento = inicio + ((contador++ + 1) / total) * (fim - inicio);
            return <Palavra key={contador} texto={p.t} destaque={p.destaque} progresso={progresso} momento={momento} />;
          })}
        </span>
      ))}
    </p>
  );
  const blocoNumeros = (
    <div className="grid w-full max-w-4xl grid-cols-3 gap-4 text-center">
      {numeros.map((n) => <NumeroRolagem key={n.texto} n={n} progresso={parado ? um : progresso} />)}
    </div>
  );

  if (parado) {
    return (
      <div className="relative overflow-hidden px-4 py-24">
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-16">
          {frase}
          {blocoNumeros}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[420vh]">
      <div ref={tela} className="sticky top-0 h-svh overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#020617_0%,#04201c_45%,#0b4a40_80%,#11806a_100%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {FERRAMENTAS_CARTOES.map((f, i) => (
            <CartaoNaRoda key={f.nome} f={f} i={i} roda={roda} progresso={progresso} tempo={tempo} largura={largura} altura={altura} />
          ))}
        </div>
        <motion.div style={{ opacity: fraseOpacidade, filter: fraseFiltro }} className="relative z-10 flex h-full items-center justify-center px-4">
          {frase}
        </motion.div>
        <motion.div style={{ opacity: numerosOpacidade, filter: numerosFiltro, y: numerosY }} className="absolute inset-0 z-10 flex items-center justify-center px-4">
          {blocoNumeros}
        </motion.div>
      </div>
    </div>
  );
}
