import type { NextConfig } from "next";

// STATIC_EXPORT=1 gera o site como arquivos prontos na pasta "out" (usado na Cloudflare Pages).
const estatico = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = estatico
  ? { output: "export", images: { unoptimized: true } }
  : {};

export default nextConfig;
