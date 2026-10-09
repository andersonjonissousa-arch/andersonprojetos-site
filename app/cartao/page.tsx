import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PERFIL, linkWhatsApp } from '@/conteudo';
import Compartilhar from './Compartilhar';

// Cartão digital: andersonprojetos.com.br/cartao

const URL_CARTAO = `${PERFIL.site}/cartao`;
const titulo = `${PERFIL.nome} · Cartão digital`;
const descricao = `${PERFIL.marca}: sites, sistemas e automações em ${PERFIL.regiao}.`;

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: URL_CARTAO },
  openGraph: { title: titulo, description: descricao, url: URL_CARTAO, siteName: PERFIL.marca, locale: 'pt_BR', type: 'profile' },
};

const MENSAGEM = `Olá, Anderson! Vim pelo seu cartão digital e quero conversar sobre um projeto.`;

function Icone({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const D = {
  contato: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6',
  site: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 010 18M12 3a14 14 0 000 18',
  instagram: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm9 4h.01M12 16a4 4 0 100-8 4 4 0 000 8z',
  projetos: 'M3 7h18v13H3zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2',
  compartilhar: 'M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
};

function IconeWhats() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.12 1.52 5.85L.06 23.08a.75.75 0 00.92.92l5.33-1.45A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12S18.63 0 12 0zm0 21.75c-1.77 0-3.47-.48-4.95-1.36l-.36-.21-3.68 1 1.03-3.57-.23-.37A9.71 9.71 0 012.25 12C2.25 6.62 6.62 2.25 12 2.25S21.75 6.62 21.75 12 17.38 21.75 12 21.75z" />
    </svg>
  );
}

const botaoClaro = 'flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-200 bg-white px-4 text-base font-bold text-slate-900 hover:border-teal-400';

export default function Cartao() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-teal-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-sm overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-900/5">
        {/* Topo colorido com a marca */}
        <div className="relative h-32 bg-gradient-to-br from-teal-500 to-indigo-600">
          <div className="flex justify-center pt-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-lg font-extrabold text-slate-950" aria-hidden="true">A</span>
          </div>
          <Image src="/anderson-rosto.webp" alt={PERFIL.nome} width={240} height={240} priority className="absolute left-1/2 top-[4.5rem] h-28 w-28 -translate-x-1/2 rounded-full object-cover ring-4 ring-white" />
        </div>

        <div className="px-6 pb-8 pt-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{PERFIL.nome}</h1>
          <p className="mt-1.5 text-lg font-semibold text-teal-700">Sites, sistemas e automações</p>
          <p className="mt-1 text-sm font-medium text-slate-500">{PERFIL.marca}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{PERFIL.regiao} · Atendo também a distância</p>

          <div className="mt-7 space-y-3">
            <a href={linkWhatsApp(MENSAGEM)} target="_blank" rel="noopener noreferrer" className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-4 text-base font-bold text-white hover:bg-emerald-700">
              <IconeWhats /> Chamar no WhatsApp
            </a>
            <a href="/anderson-sousa.vcf" download="Anderson Sousa.vcf" className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-slate-950 px-4 text-base font-bold text-white hover:bg-slate-800">
              <Icone d={D.contato} /> Salvar contato
            </a>
            <Link href="/" className={botaoClaro}>
              <Icone d={D.site} /> Conhecer o site
            </Link>
            <div className="grid grid-cols-2 gap-3">
              {PERFIL.instagram && (
                <a href={PERFIL.instagram} target="_blank" rel="noopener noreferrer" className={botaoClaro}>
                  <Icone d={D.instagram} /> Instagram
                </a>
              )}
              <Link href="/#cases" className={`${botaoClaro} ${PERFIL.instagram ? '' : 'col-span-2'}`}>
                <Icone d={D.projetos} /> Projetos
              </Link>
            </div>
            <Compartilhar url={URL_CARTAO} titulo={titulo} className={botaoClaro}>
              <Icone d={D.compartilhar} /> Compartilhar cartão
            </Compartilhar>
          </div>
        </div>
      </div>

      {/* QR Code: aparece em telas maiores, para abrir o cartão no celular */}
      <div className="mx-auto mt-8 hidden max-w-sm items-center gap-4 rounded-2xl bg-white p-4 shadow ring-1 ring-slate-900/5 sm:flex">
        <Image src="/cartao-qr.svg" alt="QR Code do cartão digital" width={96} height={96} className="h-24 w-24 shrink-0" unoptimized />
        <p className="text-sm leading-relaxed text-slate-600">Aponte a câmera do celular para abrir este cartão e <strong className="text-slate-900">salvar o contato</strong>.</p>
      </div>
    </main>
  );
}
