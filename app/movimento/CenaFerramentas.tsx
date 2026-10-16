'use client';

import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { CartaoFerramenta, FERRAMENTAS_CARTOES, type Ferramenta } from './cartoes-ferramentas';

// Cena "presa" na tela enquanto a pessoa rola: os cartões das ferramentas crescem e se afastam
// do centro (como se a câmera avançasse por eles) e as frases do meio vão aparecendo, uma por uma.
// Com "reduzir movimento", vira uma faixa parada com tudo à mostra.

// Onde cada cartão fica em volta do centro: ângulo (graus), distância relativa e inclinação.
// Telas largas: roda completa em volta do texto.
const LUGARES_LARGO = [
  { angulo: -150, distancia: 1.0, giro: -12 },
  { angulo: -97, distancia: 0.92, giro: 9 },
  { angulo: -38, distancia: 1.05, giro: 14 },
  { angulo: 8, distancia: 0.95, giro: -7 },
  { angulo: 48, distancia: 1.0, giro: 11 },
  { angulo: 96, distancia: 0.9, giro: -13 },
  { angulo: 142, distancia: 1.05, giro: 6 },
  { angulo: 188, distancia: 0.92, giro: -9 },
];
// Celular: o texto ocupa a largura toda, então os cartões ficam só acima e abaixo dele.
const LUGARES_ESTREITO = [
  { angulo: -140, distancia: 1.0, giro: -12 },
  { angulo: -108, distancia: 0.95, giro: 9 },
  { angulo: -72, distancia: 1.0, giro: 14 },
  { angulo: -40, distancia: 0.95, giro: -7 },
  { angulo: 40, distancia: 1.0, giro: 11 },
  { angulo: 72, distancia: 0.95, giro: -13 },
  { angulo: 108, distancia: 1.0, giro: 6 },
  { angulo: 140, distancia: 0.95, giro: -9 },
];
// Raio da roda (fração da largura e da altura da tela): começa em "inicio" e cresce "cresce" ao rolar.
const RODA = {
  largo: { x: { inicio: 0.3, cresce: 0.3 }, y: { inicio: 0.28, cresce: 0.3 } },
  estreito: { x: { inicio: 0.36, cresce: 0.1 }, y: { inicio: 0.36, cresce: 0.18 } },
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

type Lugar = (typeof LUGARES_LARGO)[number];
type Roda = (typeof RODA)['largo'];

function CartaoNaCena({ f, lugar, roda, progresso, largura, altura }: { f: Ferramenta; lugar: Lugar; roda: Roda; progresso: MotionValue<number>; largura: MotionValue<number>; altura: MotionValue<number> }) {
  const rad = (lugar.angulo * Math.PI) / 180;
  const raio = (r: Roda['x'], p: number) => r.inicio + r.cresce * Math.pow(p, 1.3);
  const x = useTransform([progresso, largura], ([p, w]: number[]) => Math.cos(rad) * lugar.distancia * raio(roda.x, p) * w);
  const y = useTransform([progresso, altura], ([p, h]: number[]) => Math.sin(rad) * lugar.distancia * raio(roda.y, p) * h);
  const scale = useTransform(progresso, [0, 1], [0.35, 1.7]);
  const opacity = useTransform(progresso, [0, 0.2], [0, 1]);
  const rotate = useTransform(progresso, [0, 1], [lugar.giro, lugar.giro * -1.4]);
  return (
    <motion.div
      style={{ x, y, scale, opacity, rotate }}
      className="absolute left-1/2 top-1/2 -ml-[clamp(2.5rem,7vw,6rem)] -mt-[clamp(2.5rem,7vw,6rem)] w-[clamp(5rem,14vw,12rem)]"
    >
      <CartaoFerramenta f={f} />
    </motion.div>
  );
}

// Uma linha do texto: surge de baixo, sem desfoque, no seu trecho da rolagem.
// Trechos entre *asteriscos* ficam destacados em verde.
function Linha({ texto, progresso, inicio }: { texto: string; progresso: MotionValue<number>; inicio: number }) {
  const faixa = [inicio, inicio + 0.1];
  const opacity = useTransform(progresso, faixa, [0, 1]);
  const y = useTransform(progresso, faixa, [36, 0]);
  const filter = useTransform(progresso, faixa, ['blur(10px)', 'blur(0px)']);
  return (
    <motion.span style={{ opacity, y, filter }} className="block">
      {texto.split('*').map((parte, i) => (i % 2 ? <span key={i} className="text-teal-300">{parte}</span> : parte))}
    </motion.span>
  );
}

export default function CenaFerramentas({ linhas }: { linhas: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLDivElement>(null);
  const parado = useConsulta('(prefers-reduced-motion: reduce)', false);
  const largo = useConsulta('(min-width: 768px)', true);
  const lugares = largo ? LUGARES_LARGO : LUGARES_ESTREITO;
  const roda = largo ? RODA.largo : RODA.estreito;
  const largura = useMotionValue(1280);
  const altura = useMotionValue(800);

  // Tamanho da área da cena, para a roda caber na tela.
  useEffect(() => {
    const el = tela.current;
    if (!el) return;
    const medir = () => {
      largura.set(el.clientWidth);
      altura.set(el.clientHeight);
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, [largura, altura]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const fixo = useMotionValue(0.62);
  const progresso = parado ? fixo : scrollYProgress;

  return (
    <div ref={ref} className={parado ? 'relative' : 'relative h-[320vh]'}>
      <div ref={tela} className={parado ? 'relative h-[80vh] overflow-hidden' : 'sticky top-0 h-svh overflow-hidden'}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_115%,rgba(45,212,191,0.3),transparent_62%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {FERRAMENTAS_CARTOES.map((f, i) => (
            <CartaoNaCena key={f.nome} f={f} lugar={lugares[i]} roda={roda} progresso={progresso} largura={largura} altura={altura} />
          ))}
        </div>
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <p className="max-w-4xl text-center text-[1.65rem] font-semibold leading-snug tracking-tight text-white [text-shadow:0_2px_30px_rgba(2,6,23,0.9)] sm:text-5xl sm:leading-tight lg:text-6xl">
            {linhas.map((l, i) => <Linha key={l} texto={l} progresso={progresso} inicio={0.34 + i * 0.11} />)}
          </p>
        </div>
      </div>
    </div>
  );
}
