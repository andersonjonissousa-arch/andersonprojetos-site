import Image from 'next/image';
import { CASES, DUVIDAS, FERRAMENTAS, PASSOS, PERFIL, SERVICOS, SOBRE, linkWhatsApp } from '@/conteudo';

// Site profissional do Anderson: serviços, cases e contato. Conteúdo em /conteudo.ts.

const ICONES: Record<string, React.ReactNode> = {
  sites: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01" />,
  sistemas: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16M18 10l3 2-3 2" />,
  appsheet: <path strokeLinecap="round" strokeLinejoin="round" d="M8 3h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2zm3 15h2" />,
  automacoes: <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />,
  powerbi: <path strokeLinecap="round" strokeLinejoin="round" d="M5 20V10m5 10V4m5 16v-7m5 7V8" />,
};

function Seta() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" /></svg>;
}

function IconeWhats({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.12 1.52 5.85L.06 23.08a.75.75 0 00.92.92l5.33-1.45A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12S18.63 0 12 0zm0 21.75c-1.77 0-3.47-.48-4.95-1.36l-.36-.21-3.68 1 1.03-3.57-.23-.37A9.71 9.71 0 012.25 12C2.25 6.62 6.62 2.25 12 2.25S21.75 6.62 21.75 12 17.38 21.75 12 21.75z" />
    </svg>
  );
}

function Marca({ clara = false }: { clara?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-base font-extrabold text-slate-950" aria-hidden="true">A</span>
      <span className={`text-lg font-bold tracking-tight ${clara ? 'text-white' : 'text-slate-900'}`}>{PERFIL.marca}</span>
    </span>
  );
}

export default function Home() {
  const cases = CASES.filter(c => c.publicar);
  const iniciais = PERFIL.nome.split(' ').map(p => p[0]).slice(0, 2).join('');

  return (
    <div className="min-h-screen">
      {/* TOPO */}
      <header className="absolute inset-x-0 top-0 z-30">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#" aria-label={`${PERFIL.marca}, início`}><Marca clara /></a>
          <div className="hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex">
            <a href="#servicos" className="hover:text-white">Serviços</a>
            <a href="#cases" className="hover:text-white">Projetos</a>
            <a href="#como-trabalho" className="hover:text-white">Como trabalho</a>
            <a href="#sobre" className="hover:text-white">Sobre</a>
          </div>
          <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15">
            <IconeWhats className="h-4 w-4" /> <span className="hidden sm:inline">Fale comigo</span><span className="sm:hidden">Contato</span>
          </a>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-slate-950 pb-20 pt-32 sm:pt-40">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-teal-500/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-teal-300 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" aria-hidden="true" /> {PERFIL.regiao}
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
              Sites, sistemas e automações que <span className="text-teal-400">organizam a sua empresa</span> e economizam tempo.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Desenvolvo soluções sob medida para empresas de {PERFIL.cidade.split(' –')[0]} e região: do site que traz clientes ao sistema que tira o trabalho manual da rotina.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 text-base font-bold text-slate-950 hover:bg-teal-400">
                <IconeWhats /> Quero um orçamento
              </a>
              <a href="#cases" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold text-white ring-1 ring-white/20 hover:bg-white/5">
                Ver projetos <Seta />
              </a>
            </div>
            <ul className="mt-14 flex flex-wrap gap-2" aria-label="Ferramentas que utilizo">
              {FERRAMENTAS.map(f => (
                <li key={f} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10">{f}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* SERVIÇOS */}
        <section id="servicos" className="scroll-mt-4 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="text-sm font-bold uppercase tracking-wider text-teal-600">Serviços</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Tecnologia que resolve problemas do dia a dia da empresa</h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICOS.map(s => (
                <article key={s.id} className="flex flex-col rounded-2xl p-6 ring-1 ring-slate-200 transition-shadow hover:shadow-lg">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">{ICONES[s.id]}</svg>
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{s.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.texto}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {s.exemplos.map(e => <li key={e} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">{e}</li>)}
                  </ul>
                </article>
              ))}
              <a href={linkWhatsApp('Olá, Anderson! Tenho uma ideia de projeto e queria saber se você consegue fazer.')} target="_blank" rel="noopener noreferrer" className="flex flex-col justify-center rounded-2xl bg-slate-950 p-6 text-white hover:bg-slate-900">
                <p className="text-lg font-bold">Tem outra ideia?</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">Se o problema da sua empresa pode ser resolvido com tecnologia, vamos conversar.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-400">Falar no WhatsApp <Seta /></span>
              </a>
            </div>
          </div>
        </section>

        {/* CASES */}
        <section id="cases" className="scroll-mt-4 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="text-sm font-bold uppercase tracking-wider text-teal-600">Projetos</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Projetos reais, em uso</h2>
            <div className="mt-12 space-y-8">
              {cases.map(c => (
                <article key={c.id} className="grid overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 lg:grid-cols-2">
                  <div className="flex items-center bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-8">
                    {c.imagem ? (
                      <div className="w-full overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-white/10">
                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2" aria-hidden="true">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                          {c.link && <span className="ml-3 truncate rounded bg-white px-2 py-0.5 text-[11px] text-slate-500">{c.link.replace('https://', '')}</span>}
                        </div>
                        <Image src={c.imagem} alt={`Página do ${c.nome}`} width={1920} height={1200} sizes="(min-width: 1024px) 560px, 100vw" className="h-auto w-full" />
                      </div>
                    ) : (
                      <div className="flex min-h-48 w-full items-center justify-center">
                        <span className="text-4xl font-extrabold tracking-tight text-white/90">{c.nome}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="text-sm font-semibold text-teal-600">{c.tipo}</p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">{c.nome}</h3>
                    <p className="mt-3 text-slate-600">{c.resumo}</p>
                    <dl className="mt-5 space-y-3 text-sm">
                      <div><dt className="font-semibold text-slate-900">O desafio</dt><dd className="mt-0.5 text-slate-600">{c.problema}</dd></div>
                      <div><dt className="font-semibold text-slate-900">O que eu fiz</dt><dd className="mt-0.5 text-slate-600">{c.solucao}</dd></div>
                    </dl>
                    {c.resultados.length > 0 && (
                      <ul className="mt-5 space-y-1.5 text-sm text-slate-700">
                        {c.resultados.map(r => (
                          <li key={r} className="flex gap-2"><span className="text-teal-600" aria-hidden="true">✓</span>{r}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      {c.ferramentas.map(f => <span key={f} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{f}</span>)}
                      {c.link && (
                        <a href={c.link} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline">
                          Ver projeto <Seta />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* COMO TRABALHO */}
        <section id="como-trabalho" className="scroll-mt-4 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="text-sm font-bold uppercase tracking-wider text-teal-600">Como trabalho</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Do primeiro contato à entrega, sem complicação</h2>
            <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PASSOS.map((p, i) => (
                <li key={p.titulo} className="rounded-2xl bg-slate-50 p-6">
                  <span className="text-sm font-bold text-teal-600">0{i + 1}</span>
                  <p className="mt-2 text-lg font-bold text-slate-900">{p.titulo}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SOBRE */}
        <section id="sobre" className="scroll-mt-4 bg-slate-950">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-[auto_1fr]">
            {SOBRE.foto ? (
              <Image src={SOBRE.foto} alt={PERFIL.nome} width={224} height={224} className="mx-auto h-48 w-48 rounded-3xl object-cover ring-4 ring-teal-500/30 sm:h-56 sm:w-56" />
            ) : (
              <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-indigo-500 text-6xl font-extrabold text-white sm:h-56 sm:w-56" aria-hidden="true">{iniciais}</div>
            )}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-teal-400">Sobre mim</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">{PERFIL.nome}</h2>
              <div className="mt-5 space-y-4 leading-relaxed text-slate-300">
                {SOBRE.paragrafos.map(p => <p key={p}>{p}</p>)}
              </div>
            </div>
          </div>
        </section>

        {/* DÚVIDAS */}
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">Dúvidas frequentes</h2>
            <div className="mt-10 divide-y divide-slate-100 rounded-2xl ring-1 ring-slate-200">
              {DUVIDAS.map(d => (
                <details key={d.p} className="group px-5 py-4 sm:px-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                    {d.p}
                    <span className="text-xl text-teal-600 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{d.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CHAMADA FINAL */}
        <section className="bg-teal-500">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Vamos tirar sua ideia do papel?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-900/80">Me conte o que sua empresa precisa. A primeira conversa e o orçamento são sem compromisso.</p>
            <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 text-base font-bold text-white hover:bg-slate-800">
              <IconeWhats /> Chamar no WhatsApp
            </a>
          </div>
        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:px-6">
          <Marca clara />
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span>{PERFIL.cidade}</span>
            {PERFIL.instagram && <a href={PERFIL.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>}
            {PERFIL.email && <a href={`mailto:${PERFIL.email}`} className="hover:text-white">{PERFIL.email}</a>}
            <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
          </div>
          <p>© {new Date().getFullYear()} {PERFIL.marca}</p>
        </div>
      </footer>

      <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp" className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl hover:bg-[#1ebe5b]">
        <IconeWhats className="h-7 w-7" />
      </a>
    </div>
  );
}
