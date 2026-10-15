'use client';

import { useEffect, useRef } from 'react';

// Bolinhas animadas no fundo da primeira tela. Elas fogem do mouse e se espalham
// quando a pessoa clica ou toca no fundo. Param quando a tela sai de vista e ficam
// paradas para quem pediu "reduzir movimento" no aparelho.

type Bolinha = { x: number; y: number; vx: number; vy: number; base: number; r: number; cor: string; brilho: number };
type Onda = { x: number; y: number; raio: number; vida: number };
type Faisca = { x: number; y: number; vx: number; vy: number; vida: number; cor: string };

const CORES = ['45,212,191', '94,234,212', '129,140,248', '226,232,240']; // teal-400, teal-300, indigo-400, slate-200
const DISTANCIA_LINHA = 110;
const RAIO_MOUSE = 130;
const RAIO_CLIQUE = 220;

export default function BolinhasHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const area = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !area || !ctx) return;

    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bolinhas: Bolinha[] = [];
    const ondas: Onda[] = [];
    let faiscas: Faisca[] = [];
    let largura = 0;
    let altura = 0;
    let mouse: { x: number; y: number } | null = null;
    let visivel = true;
    let quadro = 0;

    const criarBolinha = (): Bolinha => {
      const angulo = Math.random() * Math.PI * 2;
      const base = 0.15 + Math.random() * 0.25;
      return {
        x: Math.random() * largura,
        y: Math.random() * altura,
        vx: Math.cos(angulo) * base,
        vy: Math.sin(angulo) * base,
        base,
        r: 1.2 + Math.random() * 2,
        cor: CORES[Math.floor(Math.random() * CORES.length)],
        brilho: 0,
      };
    };

    const mover = () => {
      for (const b of bolinhas) {
        if (mouse) {
          const dx = b.x - mouse.x;
          const dy = b.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d > 0.1 && d < RAIO_MOUSE) {
            const forca = (1 - d / RAIO_MOUSE) * 0.12;
            b.vx += (dx / d) * forca;
            b.vy += (dy / d) * forca;
          }
        }
        // Depois de empurrada, a bolinha desacelera até voltar ao passeio de antes.
        const velocidade = Math.hypot(b.vx, b.vy);
        if (velocidade > b.base) {
          const freio = Math.max(0.95, b.base / velocidade);
          b.vx *= freio;
          b.vy *= freio;
        }
        b.brilho *= 0.96;
        b.x += b.vx;
        b.y += b.vy;
        // Saiu por um lado, volta pelo outro.
        if (b.x < -10) b.x = largura + 10;
        else if (b.x > largura + 10) b.x = -10;
        if (b.y < -10) b.y = altura + 10;
        else if (b.y > altura + 10) b.y = -10;
      }
      for (const o of ondas) {
        o.raio += 5;
        o.vida -= 0.025;
      }
      while (ondas.length && ondas[0].vida <= 0) ondas.shift();
      for (const f of faiscas) {
        f.x += f.vx;
        f.y += f.vy;
        f.vx *= 0.94;
        f.vy *= 0.94;
        f.vida -= 0.025;
      }
      faiscas = faiscas.filter((f) => f.vida > 0);
    };

    const desenhar = () => {
      ctx.clearRect(0, 0, largura, altura);
      ctx.lineWidth = 1;
      for (let i = 0; i < bolinhas.length; i++) {
        const a = bolinhas[i];
        for (let j = i + 1; j < bolinhas.length; j++) {
          const b = bolinhas[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < DISTANCIA_LINHA) {
            ctx.strokeStyle = `rgba(94,234,212,${(1 - d / DISTANCIA_LINHA) * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (mouse) {
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (d < RAIO_MOUSE * 1.4) {
            ctx.strokeStyle = `rgba(45,212,191,${(1 - d / (RAIO_MOUSE * 1.4)) * 0.4})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      for (const b of bolinhas) {
        ctx.fillStyle = `rgba(${b.cor},${0.55 + b.brilho * 0.45})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * (1 + b.brilho * 1.5), 0, Math.PI * 2);
        ctx.fill();
      }
      for (const f of faiscas) {
        ctx.fillStyle = `rgba(${f.cor},${f.vida})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 0.6 + f.vida * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const o of ondas) {
        ctx.strokeStyle = `rgba(45,212,191,${o.vida * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.raio, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const animar = () => {
      mover();
      desenhar();
      quadro = visivel ? requestAnimationFrame(animar) : 0;
    };

    const iniciar = () => {
      if (!quadro && !reduzirMovimento) quadro = requestAnimationFrame(animar);
    };

    const ajustarTamanho = () => {
      const escala = Math.min(window.devicePixelRatio || 1, 2);
      largura = area.clientWidth;
      altura = area.clientHeight;
      canvas.width = Math.round(largura * escala);
      canvas.height = Math.round(altura * escala);
      ctx.setTransform(escala, 0, 0, escala, 0, 0);
      // Mais bolinhas em telas grandes, menos no celular.
      const quantidade = Math.round(Math.min(130, Math.max(35, (largura * altura) / 9000)));
      while (bolinhas.length < quantidade) bolinhas.push(criarBolinha());
      bolinhas.length = quantidade;
      if (reduzirMovimento) desenhar();
    };

    const posicao = (e: PointerEvent) => {
      const caixa = canvas.getBoundingClientRect();
      return { x: e.clientX - caixa.left, y: e.clientY - caixa.top };
    };

    const aoMover = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') mouse = posicao(e);
    };
    const aoSair = () => {
      mouse = null;
    };
    const aoClicar = (e: PointerEvent) => {
      if (reduzirMovimento || (e.target as Element).closest('a, button')) return;
      const { x, y } = posicao(e);
      ondas.push({ x, y, raio: 0, vida: 1 });
      for (let i = 0; i < 16; i++) {
        const angulo = (i / 16) * Math.PI * 2 + Math.random() * 0.4;
        const velocidade = 2 + Math.random() * 4;
        faiscas.push({
          x,
          y,
          vx: Math.cos(angulo) * velocidade,
          vy: Math.sin(angulo) * velocidade,
          vida: 1,
          cor: CORES[i % 3],
        });
      }
      for (const b of bolinhas) {
        const dx = b.x - x;
        const dy = b.y - y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < RAIO_CLIQUE) {
          const forca = 1 - d / RAIO_CLIQUE;
          b.vx += (dx / d) * forca * 9;
          b.vy += (dy / d) * forca * 9;
          b.brilho = Math.max(b.brilho, forca);
        }
      }
    };

    ajustarTamanho();
    iniciar();

    const tamanho = new ResizeObserver(ajustarTamanho);
    tamanho.observe(area);
    const vista = new IntersectionObserver(([entrada]) => {
      visivel = entrada.isIntersecting;
      if (visivel) iniciar();
    });
    vista.observe(area);
    area.addEventListener('pointermove', aoMover);
    area.addEventListener('pointerleave', aoSair);
    area.addEventListener('pointerdown', aoClicar);

    return () => {
      cancelAnimationFrame(quadro);
      tamanho.disconnect();
      vista.disconnect();
      area.removeEventListener('pointermove', aoMover);
      area.removeEventListener('pointerleave', aoSair);
      area.removeEventListener('pointerdown', aoClicar);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
