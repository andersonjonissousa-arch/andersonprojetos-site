import type { Metadata } from 'next';
import Link from 'next/link';
import { DEMONSTRACAO, PERFIL, linkWhatsApp } from '@/conteudo';
import MolduraDemonstracao from './MolduraDemonstracao';

// Demonstração ao vivo: andersonprojetos.com.br/demonstracao
// O sistema roda no Google Apps Script e aparece aqui dentro (assim some o aviso do Google no topo).

const URL_PAGINA = `${PERFIL.site}/demonstracao`;
const titulo = `Demonstração: ${DEMONSTRACAO.titulo} | ${PERFIL.marca}`;
const descricao = 'Teste um sistema de ordens de serviço feito em cima de uma planilha do Google: painel, ordens, clientes e aviso pelo WhatsApp.';

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: URL_PAGINA },
  openGraph: { title: titulo, description: descricao, url: URL_PAGINA, siteName: PERFIL.marca, locale: 'pt_BR', type: 'website' },
};

function IconeWhats() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.1-1.2-.2-.2-.5-.3z" />
    </svg>
  );
}

export default function Demonstracao() {
  return (
    <div className="flex h-dvh flex-col bg-slate-950">
      <header className="shrink-0 border-b border-white/10 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label={`${PERFIL.marca}, voltar para o site`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500 text-sm font-extrabold text-slate-950" aria-hidden="true">A</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">{PERFIL.marca}</span>
              <span className="block truncate text-xs text-slate-400">Demonstração · {DEMONSTRACAO.titulo}</span>
            </span>
          </Link>
          <a
            href={linkWhatsApp(DEMONSTRACAO.mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-500 px-3.5 py-2 text-sm font-bold text-slate-950 hover:bg-teal-400"
          >
            <IconeWhats /> <span className="hidden sm:inline">Quero um sistema assim</span><span className="sm:hidden">Quero um assim</span>
          </a>
        </div>
      </header>
      <MolduraDemonstracao url={DEMONSTRACAO.url} titulo={DEMONSTRACAO.titulo} />
    </div>
  );
}
