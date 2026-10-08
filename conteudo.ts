// Todo o texto do site fica aqui. Para trocar um texto, um case ou um contato,
// edite só este arquivo.

export const PERFIL = {
  marca: 'Anderson Projetos',
  nome: 'Anderson Sousa',
  cidade: 'Limoeiro do Norte – CE',
  regiao: 'Limoeiro do Norte e região do Vale do Jaguaribe',
  whatsapp: '5588994607524',
  // Preencha quando quiser mostrar no site (deixe vazio para esconder)
  instagram: 'https://www.instagram.com/anderson_johnnys/',
  email: '',     // ex.: 'contato@andersonprojetos.com.br'
  site: 'https://andersonprojetos.com.br',
};

export const MENSAGEM_WHATSAPP = 'Olá, Anderson! Vi seu site e quero conversar sobre um projeto para a minha empresa.';

export function linkWhatsApp(mensagem = MENSAGEM_WHATSAPP): string {
  return `https://wa.me/${PERFIL.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const SERVICOS = [
  {
    id: 'sites',
    titulo: 'Sites profissionais',
    texto: 'Site rápido, bonito no celular e pronto para aparecer no Google, com botão de WhatsApp para o cliente chamar na hora.',
    exemplos: ['Site institucional', 'Página de vendas para anúncios', 'Catálogo de serviços'],
  },
  {
    id: 'sistemas',
    titulo: 'Sistemas sob medida',
    texto: 'Sistemas web feitos para o jeito que a sua empresa trabalha: agendamentos, cadastros, controle de pedidos, área do cliente e mais.',
    exemplos: ['Agenda e atendimento', 'Controle interno', 'Área do cliente com login'],
  },
  {
    id: 'appsheet',
    titulo: 'Apps para a equipe (AppSheet)',
    texto: 'Transformo suas planilhas em um app no celular da equipe: registrar visitas, vendas, estoque ou checklists sem papel.',
    exemplos: ['Registro de visitas', 'Checklist de serviço', 'Controle de estoque'],
  },
  {
    id: 'automacoes',
    titulo: 'Automações (Apps Script e WhatsApp)',
    texto: 'Tarefas repetitivas rodando sozinhas: planilhas que se atualizam, relatórios por e-mail e mensagens automáticas no WhatsApp.',
    exemplos: ['Relatórios automáticos', 'Lembretes no WhatsApp', 'Integração entre planilhas'],
  },
  {
    id: 'powerbi',
    titulo: 'Dashboards no Power BI',
    texto: 'Os números da empresa em um painel claro: vendas, financeiro, metas e indicadores atualizados para decidir com segurança.',
    exemplos: ['Painel de vendas', 'Financeiro', 'Indicadores da equipe'],
  },
];

export type Case = {
  id: string;
  publicar: boolean;      // false = não aparece no site
  nome: string;
  tipo: string;
  resumo: string;
  problema: string;
  solucao: string;
  resultados: string[];
  ferramentas: string[];
  imagem?: string;        // arquivo em /public/cases
  link?: string;
};

export const CASES: Case[] = [
  {
    id: 'tivla',
    publicar: true,
    nome: 'Tivla',
    tipo: 'Sistema para clínicas de estética (SaaS)',
    resumo: 'Sistema completo de agenda e gestão, criado do zero e em uso por clínicas da região.',
    problema: 'Clínicas perdiam tempo confirmando horários um por um no WhatsApp, sofriam com faltas e guardavam fichas em papel.',
    solucao: 'Um sistema web com agenda da equipe, confirmação automática pelo WhatsApp (a cliente responde 1 ou 2), lembretes, ficha de anamnese online, prontuário com mapa facial, financeiro e estoque.',
    resultados: ['Confirmação de horários automática', 'Prontuário digital, sem papel', 'Lembretes e pesquisa de satisfação pelo WhatsApp'],
    ferramentas: ['Next.js', 'Supabase', 'Vercel', 'WhatsApp'],
    imagem: '/cases/tivla.webp',
    link: 'https://tivla.com.br',
  },
  {
    id: 'ramos',
    publicar: true,
    nome: 'Ramos Renováveis',
    tipo: 'Sistema de gestão de manutenção eólica',
    resumo: 'Plataforma web feita do zero para uma empresa que faz manutenção de cubículos para parques eólicos em vários estados.',
    problema: 'Não havia controle nenhum, nem planilha. Saber onde estava cada equipamento, em que etapa do serviço e o que já tinha sido feito dependia da memória da equipe.',
    solucao: 'Um sistema para todo o ciclo de manutenção: recebimento com fotos da coleta, prontuário de cada equipamento com código MR, ordens de serviço, checklists por etapa definidos pela própria empresa, etiquetas com QR Code, relatórios e laudos automáticos e acessos diferentes para gestores, técnicos e motoristas. Os clientes da Ramos acompanham tudo por um portal exclusivo, com etapa de cada equipamento, indicadores, fotos, histórico e laudos para baixar.',
    resultados: ['Operação 100% digital e rastreável', 'Gestão vê o andamento de tudo em tempo real', 'Clientes se informam sozinhos pelo portal'],
    ferramentas: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
  },
  {
    id: 'fono',
    publicar: true,
    nome: 'Fátima Pessoa',
    tipo: 'Site profissional para fonoaudióloga',
    resumo: 'Site para uma fonoaudióloga especialista em Fonoaudiologia Neurofuncional, com atendimento em Fortaleza e Limoeiro do Norte.',
    problema: 'Apresentar uma especialidade técnica, que vai do atraso de fala na infância à cirurgia com o paciente acordado, de um jeito que pais, familiares e pacientes entendam e se sintam seguros para agendar.',
    solucao: 'Site com as áreas de atendimento para crianças e adultos explicadas em linguagem simples, um guia de sinais para saber quando procurar uma fonoaudióloga, uma seção sobre cirurgia com o paciente acordado, formação, cursos, dúvidas frequentes e agendamento direto pelo WhatsApp.',
    resultados: ['Especialidade explicada em linguagem simples', 'Guia de sinais para crianças e adultos', 'Agendamento direto pelo WhatsApp'],
    ferramentas: ['Astro', 'Netlify', 'WhatsApp'],
    imagem: '/cases/fono.webp',
    link: 'https://dreamy-marigold-0eb071.netlify.app',
  },
];

export const FERRAMENTAS = ['Next.js', 'React', 'Supabase', 'Vercel', 'Netlify', 'Power BI', 'AppSheet', 'Google Apps Script', 'Make', 'WhatsApp'];

export const PASSOS = [
  { titulo: 'Conversa', texto: 'Você me conta o que precisa. Eu entendo a rotina da empresa e onde está o problema.' },
  { titulo: 'Proposta', texto: 'Mando por escrito o que vou fazer, o prazo e o valor. Sem surpresa depois.' },
  { titulo: 'Desenvolvimento', texto: 'Você acompanha o projeto com prévias e pede ajustes no caminho.' },
  { titulo: 'Entrega e suporte', texto: 'Publico, ensino a usar e continuo por perto para ajustes e melhorias.' },
];

export const SOBRE = {
  paragrafos: [
    'Sou o Anderson Sousa, formado em Física pela Universidade Estadual do Ceará (UECE) e técnico em Meio Ambiente.',
    'Trabalho no Hospital Regional do Vale do Jaguaribe (HRVJ/ISGH). Comecei como auxiliar administrativo e hoje sou assistente administrativo do Núcleo de Qualidade e Segurança do Paciente (NUGESP), uma área em que processo bem feito, registro organizado e indicador confiável fazem diferença todos os dias.',
    'Também iniciei a graduação tecnológica em Ciência de Dados. Uno essa base analítica ao desenvolvimento web e à automação para criar sistemas que resolvem problemas reais, como o Tivla, usado por clínicas da região, e a plataforma de manutenção da Ramos Renováveis.',
    'Atendo presencialmente em Limoeiro do Norte e região, e a distância em todo o Brasil.',
  ],
  foto: '/anderson.webp',
};

export const DUVIDAS = [
  { p: 'Você atende só em Limoeiro do Norte?', r: 'Atendo presencialmente em Limoeiro do Norte e região, e a distância em qualquer cidade. As conversas e as entregas podem ser todas on-line.' },
  { p: 'Quanto custa um projeto?', r: 'Depende do que a empresa precisa. Depois de uma conversa rápida, mando uma proposta por escrito com o valor fechado, sem compromisso.' },
  { p: 'Quanto tempo leva?', r: 'Um site costuma ficar pronto em poucas semanas; sistemas e automações dependem do tamanho. O prazo vem na proposta.' },
  { p: 'Depois de pronto, quem cuida?', r: 'Eu continuo dando suporte. Ajustes, melhorias e hospedagem podem ser combinados em um plano mensal.' },
  { p: 'Preciso entender de tecnologia?', r: 'Não. Eu explico tudo de forma simples e ensino sua equipe a usar.' },
];
