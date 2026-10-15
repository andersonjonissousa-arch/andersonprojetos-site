// Atendente virtual do site: andersonprojetos.com.br/api/chat
// Roda na Cloudflare Pages (Pages Functions). A chave da Anthropic fica guardada como
// segredo na Cloudflare (ANTHROPIC_API_KEY) e nunca vai para o navegador.
import Anthropic from '@anthropic-ai/sdk';
import { ATENDENTE, CASES, DUVIDAS, PASSOS, PERFIL, SERVICOS } from '../../conteudo';

interface Env {
  ANTHROPIC_API_KEY?: string;
  // Webhook do Make que coloca o contato na planilha e manda o e-mail.
  MAKE_WEBHOOK_URL?: string;
  // Só para testes locais (aponta para um servidor falso no lugar da Anthropic).
  ANTHROPIC_BASE_URL?: string;
}

type Mensagem = { role: 'user' | 'assistant'; content: string };

// Limites por conversa, para ninguém gastar os créditos de propósito.
const MAX_MENSAGENS = 20; // 10 perguntas e 10 respostas
const MAX_CARACTERES_VISITANTE = 800;
const MAX_CARACTERES_ATENDENTE = 4000;

const LINK_WHATSAPP = `https://wa.me/${PERFIL.whatsapp}`;
const RESPOSTA_RECUSA = `Sobre isso eu não consigo ajudar por aqui. Se quiser, fale direto com o Anderson pelo WhatsApp: ${LINK_WHATSAPP}`;
const RESPOSTA_FALHA = `Tive um problema para responder agora. Você pode falar direto com o Anderson pelo WhatsApp: ${LINK_WHATSAPP}`;

// As instruções são montadas a partir do conteudo.ts, então o atendente acompanha o site.
// O texto não muda entre as perguntas de uma conversa (bom para o cache da Anthropic).
const INSTRUCOES = (() => {
  const servicos = SERVICOS.map((s) => `- ${s.titulo}: ${s.texto}`).join('\n');
  const projetos = CASES.filter((c) => c.publicar)
    .map((c) => `- ${c.nome} (${c.tipo}): ${c.resumo}${c.link ? ` Link: ${c.link}` : ''}`)
    .join('\n');
  const passos = PASSOS.map((p, i) => `${i + 1}. ${p.titulo}: ${p.texto}`).join('\n');
  const duvidas = DUVIDAS.map((d) => `Pergunta: ${d.p}\nResposta: ${d.r}`).join('\n\n');

  return `Você é o atendente virtual da ${PERFIL.marca}, de ${PERFIL.nome}, em ${PERFIL.cidade}. Você conversa com visitantes do site ${PERFIL.site}, que podem ser donos de pequenos negócios ou profissionais autônomos interessados em um site, sistema ou automação.

Seu objetivo é tirar dúvidas com clareza e, quando a pessoa tiver interesse, anotar o contato dela para o Anderson chamar no WhatsApp.

<negocio>
Serviços:
${servicos}

Preço do site profissional: ${ATENDENTE.oferta}
Sistemas, apps, automações e dashboards não têm preço fixo: o Anderson conversa com a pessoa e manda uma proposta por escrito com prazo e valor, sem compromisso.

Projetos já feitos:
${projetos}

Como funciona:
${passos}

Atendimento: presencial em ${PERFIL.regiao}, e a distância em todo o Brasil.
WhatsApp do Anderson: ${LINK_WHATSAPP}
E-mail: ${PERFIL.email}

Perguntas frequentes:
${duvidas}
</negocio>

Como atender:
- Responda em português do Brasil, de forma simpática, simples e curta: de 1 a 4 frases. A pessoa está lendo no celular.
- Escreva em texto simples, sem Markdown (sem asteriscos, títulos ou listas com marcadores). Links podem ir como endereço completo.
- Use só as informações de <negocio>. Se a pessoa perguntar algo que não está ali (forma de pagamento além do parcelamento citado, prazo exato, desconto, um tipo de projeto diferente), diga que o Anderson confirma isso na conversa e ofereça anotar o contato ou mandar o link do WhatsApp. Nunca invente preço, prazo, desconto ou garantia, e não prometa resultados como "primeiro lugar no Google".
- Se perguntarem se você é uma pessoa, diga que é um atendente virtual com inteligência artificial e que o Anderson responde pessoalmente pelo WhatsApp.
- Fale apenas sobre os serviços da ${PERFIL.marca}. Se a conversa for para outro assunto, responda com gentileza que você só ajuda com isso e traga de volta.
- Não peça dados sensíveis (CPF, documentos, senhas, dados de cartão ou de saúde). Se a pessoa mandar, não repita.

Anotar o contato:
- Quando a pessoa quiser orçamento, quiser contratar ou pedir para o Anderson chamar, peça o nome e o WhatsApp com DDD, se ela ainda não tiver informado. Se fizer sentido, pergunte também o tipo de negócio.
- Com nome e WhatsApp em mãos, use a ferramenta registrar_contato uma única vez, e depois confirme que o Anderson vai chamar pelo WhatsApp.
- Se a pessoa preferir chamar direto, mande o link do WhatsApp.`;
})();

const FERRAMENTAS: Anthropic.Beta.BetaTool[] = [
  {
    name: 'registrar_contato',
    description:
      'Anota o contato de um visitante interessado para o Anderson chamar no WhatsApp. Use somente depois que a pessoa informar o nome e o WhatsApp e quiser ser contatada.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', description: 'Nome da pessoa.' },
        whatsapp: { type: 'string', description: 'Número de WhatsApp com DDD, do jeito que a pessoa escreveu.' },
        negocio: { type: 'string', description: 'Tipo de negócio ou profissão. Vazio se a pessoa não disse.' },
        interesse: { type: 'string', description: 'Resumo curto do que a pessoa precisa.' },
      },
      required: ['nome', 'whatsapp', 'negocio', 'interesse'],
      additionalProperties: false,
    },
  },
];

function json(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// Só aceita chamadas feitas pelo próprio site (o navegador sempre manda o Origin no POST).
function origemPermitida(request: Request): boolean {
  const origem = request.headers.get('origin');
  if (!origem) return false;
  try {
    const { host, hostname } = new URL(origem);
    return host === new URL(request.url).host || hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

// Confere o histórico enviado pelo navegador: alterna visitante/atendente, começa e termina no visitante.
function lerMensagens(corpo: unknown): Mensagem[] | null {
  const lista = (corpo as { mensagens?: unknown })?.mensagens;
  if (!Array.isArray(lista) || lista.length === 0 || lista.length > MAX_MENSAGENS) return null;
  const mensagens: Mensagem[] = [];
  for (const [i, item] of lista.entries()) {
    const { role, content } = (item ?? {}) as { role?: unknown; content?: unknown };
    const esperado = i % 2 === 0 ? 'user' : 'assistant';
    if (role !== esperado || typeof content !== 'string') return null;
    const texto = content.trim();
    const limite = role === 'user' ? MAX_CARACTERES_VISITANTE : MAX_CARACTERES_ATENDENTE;
    if (!texto || texto.length > limite) return null;
    mensagens.push({ role: esperado, content: texto });
  }
  return mensagens[mensagens.length - 1].role === 'user' ? mensagens : null;
}

async function registrarContato(entrada: unknown, env: Env): Promise<boolean> {
  if (!env.MAKE_WEBHOOK_URL) return false;
  const campo = (nome: string) => String((entrada as Record<string, unknown>)?.[nome] ?? '').trim().slice(0, 300);
  try {
    const resposta = await fetch(env.MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        nome: campo('nome'),
        whatsapp: campo('whatsapp'),
        negocio: campo('negocio'),
        interesse: campo('interesse'),
        origem: 'Chat do site',
      }),
    });
    return resposta.ok;
  } catch {
    return false;
  }
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  if (!ATENDENTE.ligado || !env.ANTHROPIC_API_KEY) return json({ erro: 'indisponivel' }, 503);
  if (!origemPermitida(request)) return json({ erro: 'origem' }, 403);

  let mensagens: Mensagem[] | null = null;
  try {
    mensagens = lerMensagens(await request.json());
  } catch {
    mensagens = null;
  }
  if (!mensagens) return json({ erro: 'mensagens' }, 400);

  const client = new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
    baseURL: env.ANTHROPIC_BASE_URL || undefined,
    maxRetries: 1,
    timeout: 25_000,
  });
  // O Haiku não tem o "plano B" (fallback) quando recusa uma pergunta; os outros modelos têm.
  const comFallback = !ATENDENTE.modelo.includes('haiku');
  const conversa: Anthropic.Beta.BetaMessageParam[] = mensagens.map((m) => ({ role: m.role, content: m.content }));
  let contatoRegistrado = false;

  try {
    // No máximo 3 idas ao Claude: responder, registrar o contato e confirmar.
    for (let rodada = 0; rodada < 3; rodada++) {
      const resposta = await client.beta.messages.create({
        model: ATENDENTE.modelo,
        max_tokens: 4096,
        system: INSTRUCOES,
        tools: FERRAMENTAS,
        messages: conversa,
        output_config: { effort: 'low' },
        cache_control: { type: 'ephemeral' },
        ...(comFallback ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const } : {}),
      });

      if (resposta.stop_reason === 'refusal') return json({ resposta: RESPOSTA_RECUSA, contatoRegistrado });

      if (resposta.stop_reason === 'tool_use') {
        // A resposta vai de volta inteira (com o raciocínio), como a API pede.
        conversa.push({ role: 'assistant', content: resposta.content });
        const resultados: Anthropic.Beta.BetaToolResultBlockParam[] = [];
        for (const bloco of resposta.content) {
          if (bloco.type !== 'tool_use') continue;
          const ok: boolean = bloco.name === 'registrar_contato' && !contatoRegistrado && (await registrarContato(bloco.input, env));
          contatoRegistrado ||= ok;
          resultados.push({
            type: 'tool_result',
            tool_use_id: bloco.id,
            content: ok
              ? 'Contato anotado. O Anderson vai chamar pelo WhatsApp.'
              : `Não deu para anotar agora. Peça para a pessoa chamar o Anderson direto no WhatsApp: ${LINK_WHATSAPP}`,
            is_error: !ok,
          });
        }
        conversa.push({ role: 'user', content: resultados });
        continue;
      }

      const texto = resposta.content
        .flatMap((bloco) => (bloco.type === 'text' ? [bloco.text] : []))
        .join('\n')
        .trim();
      return json({ resposta: texto || RESPOSTA_FALHA, contatoRegistrado });
    }
    return json({ resposta: RESPOSTA_FALHA, contatoRegistrado });
  } catch (erro) {
    if (erro instanceof Anthropic.APIError) console.error('Erro da API da Anthropic', erro.status, erro.message);
    else console.error('Erro no atendente', erro);
    return json({ resposta: RESPOSTA_FALHA, contatoRegistrado, erro: 'api' }, 502);
  }
}
