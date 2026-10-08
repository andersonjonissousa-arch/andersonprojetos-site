import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { PERFIL } from '@/conteudo';
import './globals.css';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const titulo = `${PERFIL.marca} | Sites, sistemas e automações em ${PERFIL.cidade}`;
const descricao = 'Sites profissionais, sistemas sob medida, apps com AppSheet, automações com Apps Script e WhatsApp e dashboards no Power BI para empresas de Limoeiro do Norte e região.';

export const metadata: Metadata = {
  metadataBase: new URL(PERFIL.site),
  title: titulo,
  description: descricao,
  openGraph: { title: titulo, description: descricao, url: PERFIL.site, siteName: PERFIL.marca, locale: 'pt_BR', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
