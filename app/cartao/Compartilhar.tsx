'use client';

import { useState } from 'react';

// Abre o menu de compartilhar do celular; no computador, copia o link.
export default function Compartilhar({ url, titulo, className, children }: { url: string; titulo: string; className: string; children: React.ReactNode }) {
  const [copiado, setCopiado] = useState(false);

  async function compartilhar() {
    if (navigator.share) {
      try { await navigator.share({ title: titulo, url }); } catch { /* a pessoa cancelou */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt('Copie o link do cartão:', url);
    }
  }

  return (
    <button type="button" onClick={compartilhar} className={className}>
      {copiado ? 'Link copiado!' : children}
    </button>
  );
}
