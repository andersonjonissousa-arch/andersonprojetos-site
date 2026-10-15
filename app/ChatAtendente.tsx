'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ATENDENTE, PERFIL, linkWhatsApp } from '@/conteudo';

// Chat do atendente virtual (canto inferior direito, acima do botão do WhatsApp).
// A conversa fica só na memória do navegador e vai inteira a cada pergunta para /api/chat.

type Mensagem = { role: 'user' | 'assistant'; content: string };
type Fbq = (...args: unknown[]) => void;

const MAX_MENSAGENS = 20; // igual ao limite do servidor
const MAX_CARACTERES = 800;
const MENSAGEM_WHATSAPP = 'Olá, Anderson! Vim pelo atendente do site e quero falar com você.';

// Transforma endereços no texto em links clicáveis.
function TextoComLinks({ texto }: { texto: string }) {
  const partes = texto.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {partes.map((parte, i) => {
        if (!/^https?:\/\//.test(parte)) return <span key={i}>{parte}</span>;
        const url = parte.replace(/[.,;:!?)]+$/, '');
        const resto = parte.slice(url.length);
        return (
          <span key={i}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="break-all font-semibold underline">{url}</a>
            {resto}
          </span>
        );
      })}
    </>
  );
}

function Balao({ m }: { m: Mensagem }) {
  const visitante = m.role === 'user';
  return (
    <div className={`flex ${visitante ? 'justify-end' : 'justify-start'}`}>
      <p className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed ${visitante ? 'rounded-br-md bg-teal-600 text-white' : 'rounded-bl-md bg-slate-100 text-slate-800'}`}>
        <TextoComLinks texto={m.content} />
      </p>
    </div>
  );
}

export default function ChatAtendente() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState('');
  const [esperando, setEsperando] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const fimDaConversa = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLTextAreaElement>(null);

  const limiteAtingido = mensagens.length >= MAX_MENSAGENS - 1;

  useEffect(() => {
    fimDaConversa.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [mensagens, esperando, aberto]);

  useEffect(() => {
    if (aberto) campo.current?.focus();
  }, [aberto]);

  async function enviar(pergunta: string) {
    const conteudo = pergunta.trim().slice(0, MAX_CARACTERES);
    if (!conteudo || esperando || limiteAtingido) return;
    const historico: Mensagem[] = [...mensagens, { role: 'user', content: conteudo }];
    setMensagens(historico);
    setTexto('');
    setEsperando(true);
    setFalhou(false);
    try {
      const resposta = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mensagens: historico }),
      });
      const dados = (await resposta.json()) as { resposta?: string; contatoRegistrado?: boolean };
      if (!dados.resposta) throw new Error('sem resposta');
      setMensagens([...historico, { role: 'assistant', content: dados.resposta }]);
      if (dados.contatoRegistrado) {
        (window as unknown as { fbq?: Fbq }).fbq?.('track', 'Contact', { content_name: 'Chat do site' });
      }
    } catch {
      // Tira a pergunta que ficou sem resposta, para a conversa continuar certinha.
      setMensagens(mensagens);
      setTexto(conteudo);
      setFalhou(true);
    } finally {
      setEsperando(false);
    }
  }

  if (!ATENDENTE.ligado) return null;

  return (
    <>
      {!aberto && (
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Abrir o atendente virtual"
          className="fixed bottom-[5.5rem] right-4 z-40 flex h-14 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white shadow-xl ring-2 ring-white hover:bg-slate-800"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.4-4 8-9 8a9.9 9.9 0 01-4.3-.95L3 20l1.3-3.9A7.5 7.5 0 013 12c0-4.4 4-8 9-8s9 3.6 9 8z" />
          </svg>
          <span className="hidden sm:inline">Tire suas dúvidas</span>
        </button>
      )}

      {aberto && (
        <div
          role="dialog"
          aria-label="Atendente virtual"
          className="fixed inset-x-3 bottom-3 z-50 flex h-[78vh] max-h-[620px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:inset-x-auto sm:right-4 sm:w-[380px]"
        >
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 text-white">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500 font-extrabold text-slate-950" aria-hidden="true">A</span>
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-tight">Atendente virtual</p>
              <p className="text-xs text-slate-300">{PERFIL.marca} · responde com IA</p>
            </div>
            <button type="button" onClick={() => setAberto(false)} aria-label="Fechar o atendente" className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <Balao m={{ role: 'assistant', content: ATENDENTE.saudacao }} />
            {mensagens.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {ATENDENTE.sugestoes.map((s) => (
                  <button key={s} type="button" onClick={() => enviar(s)} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 hover:border-teal-400">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {mensagens.map((m, i) => <Balao key={i} m={m} />)}
            {esperando && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-2.5 text-[15px] text-slate-500">Digitando…</p>
              </div>
            )}
            {falhou && (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Não consegui responder agora. Tente de novo ou{' '}
                <a href={linkWhatsApp(MENSAGEM_WHATSAPP)} target="_blank" rel="noopener noreferrer" className="font-semibold underline">fale com o Anderson no WhatsApp</a>.
              </p>
            )}
            {limiteAtingido && (
              <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
                Para continuar a conversa,{' '}
                <a href={linkWhatsApp(MENSAGEM_WHATSAPP)} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline">fale com o Anderson no WhatsApp</a>.
              </p>
            )}
            <div ref={fimDaConversa} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar(texto);
            }}
            className="border-t border-slate-200 p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={campo}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    enviar(texto);
                  }
                }}
                rows={1}
                maxLength={MAX_CARACTERES}
                disabled={limiteAtingido}
                placeholder="Escreva sua pergunta…"
                aria-label="Sua mensagem"
                className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-slate-300 px-3.5 py-2.5 text-[15px] text-slate-900 outline-none focus:border-teal-500 disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={esperando || limiteAtingido || !texto.trim()}
                aria-label="Enviar"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] leading-snug text-slate-500">
              Atendente com IA: pode errar. Não envie dados sensíveis.{' '}
              <Link href="/privacidade" className="underline">Privacidade</Link> ·{' '}
              <a href={linkWhatsApp(MENSAGEM_WHATSAPP)} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline">Falar com o Anderson</a>
            </p>
          </form>
        </div>
      )}
    </>
  );
}
