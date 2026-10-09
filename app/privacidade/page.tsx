import type { Metadata } from 'next';
import Link from 'next/link';
import { PERFIL, linkWhatsApp } from '@/conteudo';

export const metadata: Metadata = {
  title: `Política de Privacidade | ${PERFIL.marca}`,
  description: `Como o site ${PERFIL.marca} trata os dados de quem o visita, de acordo com a LGPD.`,
  alternates: { canonical: `${PERFIL.site}/privacidade` },
};

const ATUALIZADA_EM = '9 de outubro de 2026';

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900">{titulo}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

export default function Privacidade() {
  const contato = (
    <a href={linkWhatsApp('Olá, Anderson! Tenho uma dúvida sobre os meus dados pessoais.')} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline">
      WhatsApp
    </a>
  );

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link href="/" className="text-sm font-semibold text-teal-700 hover:underline">← Voltar para o site</Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-slate-500">Atualizada em {ATUALIZADA_EM}</p>

        <p className="mt-8 leading-relaxed text-slate-700">
          Esta política explica, de forma simples, quais dados são tratados quando você visita o site{' '}
          <strong>{PERFIL.site.replace('https://', '')}</strong> (incluindo o cartão digital) e quais são os seus direitos,
          de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD).
        </p>

        <Secao titulo="1. Quem é o responsável pelos dados">
          <p>
            O responsável é <strong>{PERFIL.nome}</strong>, que atua como <strong>{PERFIL.marca}</strong>, em {PERFIL.cidade}.
            Para qualquer assunto sobre os seus dados, fale comigo pelo {contato}.
          </p>
        </Secao>

        <Secao titulo="2. Quais dados são tratados">
          <p><strong>Dados de navegação.</strong> Ao visitar o site, podem ser registradas informações como páginas visitadas, botões clicados, tipo de aparelho e navegador, endereço IP aproximado e data e hora do acesso.</p>
          <p><strong>Dados que você me envia.</strong> Se você me chamar no WhatsApp ou salvar o meu contato, as informações que você escolher compartilhar na conversa (como nome, telefone e a descrição do seu projeto) passam a ser tratadas por mim para responder você.</p>
          <p>O site não tem formulários de cadastro e não pede dados sensíveis.</p>
        </Secao>

        <Secao titulo="3. Cookies e Pixel da Meta">
          <p>
            Este site pode usar o <strong>Pixel da Meta</strong> (empresa dona do Facebook e do Instagram). Ele usa cookies e tecnologias
            parecidas para registrar visitas e cliques, como o clique no botão do WhatsApp, e me ajuda a medir os resultados dos meus
            anúncios e a mostrá-los para pessoas com mais chance de se interessar pelos meus serviços.
          </p>
          <p>
            Você pode bloquear ou apagar cookies nas configurações do seu navegador e ajustar as suas preferências de anúncios
            nas configurações de privacidade do Facebook e do Instagram.
          </p>
        </Secao>

        <Secao titulo="4. Para que os dados são usados">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Responder aos seus contatos e preparar orçamentos.</li>
            <li>Entender como o site é usado, para melhorá-lo.</li>
            <li>Medir e melhorar os anúncios nas redes sociais.</li>
          </ul>
          <p>As bases legais são o seu consentimento, o meu legítimo interesse em divulgar os meus serviços e as providências que você solicita antes de contratar um serviço (art. 7º da LGPD).</p>
        </Secao>

        <Secao titulo="5. Com quem os dados são compartilhados">
          <p>Os dados não são vendidos. Eles podem ser tratados por serviços que fazem o site funcionar e ser divulgado:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong>Meta</strong> (Pixel, Facebook, Instagram e WhatsApp);</li>
            <li><strong>empresa de hospedagem do site</strong>, que registra acessos para manter o site no ar e seguro.</li>
          </ul>
          <p>Alguns desses serviços podem armazenar dados fora do Brasil, seguindo as próprias políticas de privacidade.</p>
        </Secao>

        <Secao titulo="6. Por quanto tempo os dados ficam guardados">
          <p>Os dados são mantidos apenas pelo tempo necessário para as finalidades acima, ou pelo prazo exigido por lei. Os dados de navegação seguem os prazos definidos pelos serviços citados.</p>
        </Secao>

        <Secao titulo="7. Os seus direitos">
          <p>Pela LGPD, você pode pedir, a qualquer momento:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>a confirmação de que os seus dados são tratados e o acesso a eles;</li>
            <li>a correção de dados incompletos ou desatualizados;</li>
            <li>a exclusão dos dados tratados com o seu consentimento;</li>
            <li>informações sobre com quem os dados foram compartilhados;</li>
            <li>a revogação do seu consentimento.</li>
          </ul>
          <p>Para isso, é só me chamar pelo {contato}. Você também pode procurar a Autoridade Nacional de Proteção de Dados (ANPD).</p>
        </Secao>

        <Secao titulo="8. Mudanças nesta política">
          <p>Esta política pode ser atualizada. A data da última atualização fica sempre no topo desta página.</p>
        </Secao>
      </div>
    </main>
  );
}
