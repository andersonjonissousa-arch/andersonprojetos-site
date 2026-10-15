'use client';

import { useState, useSyncExternalStore } from 'react';

const semAssinatura = () => () => {};

// Mostra o sistema do Apps Script dentro da página, com um aviso enquanto o Google carrega.
// O iframe só entra no navegador (depois da página montada), para o aviso de "abrindo" sumir no momento certo.
export default function MolduraDemonstracao({ url, titulo }: { url: string; titulo: string }) {
  const noNavegador = useSyncExternalStore(semAssinatura, () => true, () => false);
  const [carregou, setCarregou] = useState(false);

  return (
    <div className="relative min-h-0 flex-1 bg-[#f4f6f8]">
      {!carregou && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-[#f4f6f8] text-sm text-slate-500" role="status">
          <div className="text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-[3px] border-slate-200 border-t-teal-600 motion-reduce:animate-none" />
            Abrindo a demonstração…
          </div>
        </div>
      )}
      {noNavegador && <iframe src={url} title={titulo} onLoad={() => setCarregou(true)} className="block h-full w-full border-0" />}
    </div>
  );
}
