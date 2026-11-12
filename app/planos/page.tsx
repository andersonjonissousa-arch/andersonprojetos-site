import type { Metadata } from 'next';
import Link from 'next/link';
import { PALETAS_URL, PERFIL, PLANOS, PLANOS_COMPARATIVO, PLANOS_DUVIDAS, PLANOS_TODOS_INCLUEM, linkWhatsApp, type PlanoId } from '@/conteudo';
import Surgir from '../movimento/Surgir';

// Planos de site: andersonprojetos.com.br/planos. Textos e preços em /conteudo.ts (PLANOS...).

const URL_PAGINA = `${PERFIL.site}/planos`;
const titulo = `Planos de site: Básico, Médio e Avançado | ${PERFIL.marca}`;
const descricao = 'Compare os planos de site da Anderson Projetos: o que cada um inclui, efeitos, número de páginas e preço da criação e da mensalidade.';

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: URL_PAGINA },
  openGraph: { title: titulo, description: descricao, url: URL_PAGINA, siteName: PERFIL.marca, locale: 'pt_BR', type: 'website' },
};

const ORDEM: PlanoId[] = ['basico', 'medio', 'avancado'];
const nivel = (id: PlanoId) => ORDEM.indexOf(id);
// "R$ 1.000 a R$ 1.500" → "R$ 1.000 a 1.500" (cabe numa linha do cartão)
const curto = (preco: string) => preco.replace(' a R$ ', ' a ');
const faixa = (preco: string) => preco.includes(' a ');
const mensagemPlano = (nome: string) => `Olá, Anderson! Vi a página de planos e quero um site no plano ${nome}.`;

function IconeWhats({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.12 1.52 5.85L.06 23.08a.75.75 0 00.92.92l5.33-1.45A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12S18.63 0 12 0zm0 21.75c-1.77 0-3.47-.48-4.95-1.36l-.36-.21-3.68 1 1.03-3.57-.23-.37A9.71 9.71 0 012.25 12C2.25 6.62 6.62 2.25 12 2.25S21.75 6.62 21.75 12 17.38 21.75 12 21.75z" />
    </svg>
  );
}

function Seta() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" /></svg>;
}

function Check({ className = 'text-teal-600' }: { className?: string }) {
  return <svg className={`h-5 w-5 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
}

function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-base font-extrabold text-slate-950" aria-hidden="true">A</span>
      <span className="text-lg font-bold tracking-tight text-white">{PERFIL.marca}</span>
    </span>
  );
}

export default function Planos() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOPO */}
      <header className="absolute inset-x-0 top-0 z-30">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label={`${PERFIL.marca}, voltar para o site`}><Marca /></Link>
          <div className="hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex">
            <a href="#planos" className="hover:text-white">Planos</a>
            <a href="#comparar" className="hover:text-white">Comparar</a>
            <a href="#duvidas" className="hover:text-white">Dúvidas</a>
          </div>
          <a href={linkWhatsApp('Olá, Anderson! Vi a página de planos e quero tirar uma dúvida.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15">
            <IconeWhats className="h-4 w-4" /> <span className="hidden sm:inline">Fale comigo</span><span className="sm:hidden">Contato</span>
          </a>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-slate-950 pb-44 pt-32 sm:pt-40">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-teal-500/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
            <p className="surgir inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-teal-300 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" aria-hidden="true" /> Planos de site
            </p>
            <h1 className="surgir mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl" style={{ animationDelay: '0.08s' }}>
              Um site do <span className="text-teal-400">tamanho do seu negócio</span>
            </h1>
            <p className="surgir mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300" style={{ animationDelay: '0.16s' }}>
              Três níveis, com preço fechado. Todos com domínio, hospedagem, WhatsApp e cartão digital. A diferença está nos efeitos, no número de páginas e nas funções.
            </p>
          </div>
        </section>

        {/* CARTÕES DOS PLANOS */}
        <section id="planos" className="relative z-10 -mt-32 scroll-mt-4">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:items-stretch">
            {PLANOS.map((p, i) => {
              const escuro = p.destaque;
              return (
                <Surgir
                  como="article"
                  key={p.id}
                  atraso={i * 0.08}
                  className={`relative flex flex-col rounded-3xl p-6 sm:p-8 ${escuro ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-teal-400 lg:-my-4' : 'bg-white text-slate-900 shadow-xl ring-1 ring-slate-200'}`}
                >
                  {p.destaque && (
                    <span className="absolute -top-3 left-6 rounded-full bg-teal-400 px-3 py-1 text-xs font-bold text-slate-950 sm:left-8">Mais escolhido</span>
                  )}
                  <h2 className="text-2xl font-bold">{p.nome}</h2>
                  <p className={`mt-1 text-sm ${escuro ? 'text-teal-300' : 'text-teal-700'}`}>{p.chamada}</p>
                  <div className="mt-6">
                    <p className="text-sm font-medium opacity-70">Criação</p>
                    <p className={`whitespace-nowrap font-extrabold tracking-tight ${faixa(p.construcao) ? 'text-3xl' : 'text-4xl'}`}>{curto(p.construcao)}</p>
                    <p className={`mt-1 text-base font-semibold ${escuro ? 'text-slate-200' : 'text-slate-700'}`}>+ {curto(p.mensal)} por mês</p>
                  </div>
                  <p className={`mt-5 text-sm leading-relaxed ${escuro ? 'text-slate-300' : 'text-slate-600'}`}>{p.paraQuem}</p>
                  <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                    {p.inclui.map((x) => (
                      <li key={x} className="flex gap-2.5"><Check className={escuro ? 'text-teal-400' : 'text-teal-600'} />{x}</li>
                    ))}
                  </ul>
                  <a
                    href={linkWhatsApp(mensagemPlano(p.nome))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-bold ${escuro ? 'bg-teal-400 text-slate-950 hover:bg-teal-300' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
                  >
                    <IconeWhats /> Quero o plano {p.nome}
                  </a>
                  <a href={p.exemplo} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold hover:underline ${escuro ? 'text-teal-300' : 'text-teal-700'}`}>
                    Ver um site de exemplo neste plano <Seta />
                  </a>
                </Surgir>
              );
            })}
          </div>

          <Surgir className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wider text-teal-600">Todos os planos incluem</p>
              <ul className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                {PLANOS_TODOS_INCLUEM.map((x) => (
                  <li key={x} className="flex gap-2.5"><Check />{x}</li>
                ))}
              </ul>
            </div>
          </Surgir>
        </section>

        {/* COMPARATIVO */}
        <section id="comparar" className="scroll-mt-4">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Surgir>
              <p className="text-sm font-bold uppercase tracking-wider text-teal-600">Comparar</p>
              <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">O que tem em cada plano</h2>
              <p className="mt-3 max-w-2xl text-slate-600">Quer um efeito específico? Veja a partir de qual plano ele entra.</p>
            </Surgir>

            <Surgir atraso={0.1} className="mt-10 overflow-clip rounded-2xl bg-white ring-1 ring-slate-200">
              <div className="sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_repeat(3,3.75rem)] items-end gap-1 border-b border-slate-200 bg-white px-4 py-3 text-center text-xs font-bold text-slate-900 sm:grid-cols-[minmax(0,1fr)_repeat(3,7rem)] sm:px-6 sm:text-sm">
                <span />
                {PLANOS.map((p) => (
                  <span key={p.id} className={p.destaque ? 'text-teal-700' : undefined}>{p.nome}</span>
                ))}
              </div>
              {PLANOS_COMPARATIVO.map((g) => (
                <div key={g.grupo}>
                  <p className="bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6">{g.grupo}</p>
                  <ul>
                    {g.itens.map((item) => (
                      <li key={item.nome} className="grid grid-cols-[minmax(0,1fr)_repeat(3,3.75rem)] items-center gap-1 border-t border-slate-100 px-4 py-3 text-sm text-slate-700 sm:grid-cols-[minmax(0,1fr)_repeat(3,7rem)] sm:px-6">
                        <span>{item.nome}</span>
                        {ORDEM.map((id) => (
                          <span key={id} className="flex justify-center">
                            {nivel(id) >= nivel(item.desde) ? (
                              <><Check /><span className="sr-only">Incluso no {PLANOS[nivel(id)].nome}</span></>
                            ) : (
                              <><span className="text-slate-300" aria-hidden="true">—</span><span className="sr-only">Não incluso no {PLANOS[nivel(id)].nome}</span></>
                            )}
                          </span>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Surgir>
          </div>
        </section>

        {/* CORES E FONTES */}
        <section className="bg-slate-950">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
            <Surgir>
              <p className="text-sm font-bold uppercase tracking-wider text-teal-400">Cores e fontes</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Monte o visual do seu site antes de fechar</h2>
              <p className="mt-4 leading-relaxed text-slate-300">
                Escolha a paleta de cores, a fonte e o formato dos cantos e veja na hora como fica. A página mostra em qual plano a combinação entra e manda a escolha direto para o meu WhatsApp.
              </p>
              <a href={PALETAS_URL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 text-base font-bold text-slate-950 hover:bg-teal-400">
                Escolher cores e fonte <Seta />
              </a>
            </Surgir>
            <Surgir atraso={0.15} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['#2F5D3A', '#4E7D4A', '#A84B24', 'Sálvia'],
                ['#1B2A41', '#2D4263', '#86662C', 'Marinho'],
                ['#6E2F45', '#B07A8C', '#93445C', 'Rosé'],
                ['#1F4E55', '#2E6B70', '#83613A', 'Petróleo'],
                ['#0F3B2E', '#1A6B50', '#B45309', 'Floresta'],
                ['#16285A', '#1D5FBF', '#C2410C', 'Confiança'],
                ['#4A2C1D', '#8A5A3C', '#9A4E2A', 'Café'],
                ['#C2311A', '#8F2410', '#9A5B08', 'Forno'],
              ].map(([a, b, c, nome]) => (
                <div key={nome} className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <div className="flex h-16">
                    <span className="flex-[2]" style={{ background: a }} />
                    <span className="flex-1" style={{ background: b }} />
                    <span className="flex-1" style={{ background: c }} />
                  </div>
                  <p className="bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">{nome}</p>
                </div>
              ))}
            </Surgir>
          </div>
        </section>

        {/* DÚVIDAS */}
        <section id="duvidas" className="scroll-mt-4 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <Surgir>
              <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">Dúvidas sobre os planos</h2>
            </Surgir>
            <Surgir atraso={0.1} className="mt-10 divide-y divide-slate-100 rounded-2xl ring-1 ring-slate-200">
              {PLANOS_DUVIDAS.map((d) => (
                <details key={d.p} className="group px-5 py-4 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                    {d.p}
                    <span className="text-xl text-teal-600 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{d.r}</p>
                </details>
              ))}
            </Surgir>
          </div>
        </section>

        {/* CHAMADA FINAL */}
        <section className="bg-teal-500">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <Surgir>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Não sabe qual plano escolher?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-900/80">Me conte sobre o seu negócio. Eu indico o plano que faz sentido, sem empurrar o mais caro.</p>
              <a href={linkWhatsApp('Olá, Anderson! Vi a página de planos e quero ajuda para escolher o meu.')} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 text-base font-bold text-white hover:bg-slate-800">
                <IconeWhats /> Me ajuda a escolher
              </a>
            </Surgir>
          </div>
        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:px-6">
          <Link href="/"><Marca /></Link>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/" className="hover:text-white">Início</Link>
            <Link href="/#cases" className="hover:text-white">Projetos</Link>
            <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
          </div>
          <p>© {new Date().getFullYear()} {PERFIL.marca}</p>
        </div>
      </footer>

      <a href={linkWhatsApp('Olá, Anderson! Vi a página de planos e quero conversar.')} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp" className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl hover:bg-[#1ebe5b]">
        <IconeWhats className="h-7 w-7" />
      </a>
    </div>
  );
}
