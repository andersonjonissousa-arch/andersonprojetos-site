'use client';

import { useEffect, useRef } from 'react';

// Fio de luz verde-água que ondula devagar no fundo da primeira tela (desenhado pela placa de vídeo).
// Para quando sai de vista, fica parado com "reduzir movimento" e some sem WebGL.

const VERTICE = 'attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }';

const FRAGMENTO = `
precision mediump float;
uniform vec2 u_tam;
uniform float u_t;
float ruido(vec2 q) { return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec2 uv = gl_FragCoord.xy / u_tam;
  float x = uv.x * (u_tam.x / u_tam.y);
  vec3 cor = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    float f = float(i);
    float centro = 0.16 + 0.40 * uv.x + 0.09 * sin(x * 1.3 + u_t * 0.22 + f * 1.9) + 0.04 * sin(x * 3.1 - u_t * 0.31 + f * 0.7);
    float d = uv.y - centro;
    float largura = 0.075 + 0.035 * sin(x * 1.7 + u_t * 0.18 + f * 2.3);
    float halo = exp(-(d * d) / (largura * largura));
    float fio = exp(-(d * d) / 0.0005) * (0.6 + 0.4 * sin(x * 2.0 - u_t * 0.5 + f));
    vec3 tom = mix(vec3(0.05, 0.58, 0.52), vec3(0.20, 0.80, 0.55), f / 2.0);
    float peso = f == 0.0 ? 1.0 : 0.5;
    cor += tom * (halo * 0.30 + fio * 0.85) * peso;
  }
  cor *= smoothstep(0.0, 0.2, uv.x) * (0.6 + 0.4 * smoothstep(1.0, 0.7, uv.x));
  float grao = (ruido(gl_FragCoord.xy + floor(u_t * 24.0)) - 0.5) * 0.03;
  vec3 c = max(cor + grao, 0.0);
  float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
  gl_FragColor = vec4(min(c, vec3(a)), a);
}`;

export default function OndaDeLuz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { premultipliedAlpha: true, antialias: false });
    if (!canvas || !gl) return;

    const compilar = (tipo: number, codigo: string) => {
      const s = gl.createShader(tipo)!;
      gl.shaderSource(s, codigo);
      gl.compileShader(s);
      return s;
    };
    const programa = gl.createProgram()!;
    gl.attachShader(programa, compilar(gl.VERTEX_SHADER, VERTICE));
    gl.attachShader(programa, compilar(gl.FRAGMENT_SHADER, FRAGMENTO));
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
      canvas.style.display = 'none';
      return;
    }
    gl.useProgram(programa);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posicao = gl.getAttribLocation(programa, 'p');
    gl.enableVertexAttribArray(posicao);
    gl.vertexAttribPointer(posicao, 2, gl.FLOAT, false, 0, 0);
    const uTam = gl.getUniformLocation(programa, 'u_tam');
    const uT = gl.getUniformLocation(programa, 'u_t');

    const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let quadro = 0;
    let visivel = true;
    const inicio = performance.now();

    const desenhar = (segundos: number) => {
      gl.uniform1f(uT, segundos);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const animar = () => {
      desenhar((performance.now() - inicio) / 1000 + 8);
      quadro = visivel ? requestAnimationFrame(animar) : 0;
    };
    const iniciar = () => {
      if (!quadro && !parado) quadro = requestAnimationFrame(animar);
    };
    // Metade da resolução: a luz é suave, e assim pesa pouco no celular.
    const ajustar = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * 0.5));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * 0.5));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uTam, canvas.width, canvas.height);
      if (parado) desenhar(8);
    };

    ajustar();
    iniciar();
    const tamanho = new ResizeObserver(ajustar);
    tamanho.observe(canvas);
    const vista = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel) iniciar();
    });
    vista.observe(canvas);
    return () => {
      cancelAnimationFrame(quadro);
      tamanho.disconnect();
      vista.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
