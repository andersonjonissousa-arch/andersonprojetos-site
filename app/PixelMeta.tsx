'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

type Fbq = (...args: unknown[]) => void;

// Pixel da Meta: registra as visitas (PageView) e, como "Contact",
// os cliques no WhatsApp e no botão "Salvar contato".
export default function PixelMeta({ id }: { id: string }) {
  // PageView também ao trocar de página dentro do site (a primeira visita já é contada no script)
  const pagina = usePathname();
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) { primeira.current = false; return; }
    (window as unknown as { fbq?: Fbq }).fbq?.('track', 'PageView');
  }, [pagina]);

  useEffect(() => {
    function aoClicar(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest('a');
      const fbq = (window as unknown as { fbq?: Fbq }).fbq;
      if (!link || !fbq) return;
      if (link.href.startsWith('https://wa.me/')) fbq('track', 'Contact', { content_name: 'WhatsApp' });
      else if (link.href.endsWith('.vcf')) fbq('track', 'Contact', { content_name: 'Salvar contato' });
    }
    document.addEventListener('click', aoClicar);
    return () => document.removeEventListener('click', aoClicar);
  }, []);

  return (
    <>
      <Script id="pixel-meta" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: 'none' }} alt="" src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}
