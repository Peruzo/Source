'use client';

import { useEffect, useRef, useState } from 'react';
import { T } from '@/lib/site-builder/texts';
import { api } from './api';
import { DeviceFrame, ErrorBox, SecondaryButton } from './ui';

type Example = { key: string; name: string; description: string; style: string; url: string };

let cache: Example[] | null = null;

/** Exempelsajten för vald stil i en modal dialog (kundportalens /webbplats-exempel/<nyckel>). */
export function ExampleDialog(props: { style: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [examples, setExamples] = useState<Example[] | null>(cache);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    const onClose = () => props.onClose();
    dialog?.addEventListener('close', onClose);
    return () => dialog?.removeEventListener('close', onClose);
  }, [props]);

  useEffect(() => {
    if (cache) return;
    api<{ examples: Example[] }>('/examples', 'GET').then((res) => {
      if (res.ok) { cache = res.examples; setExamples(res.examples); } else setError(res.message);
    });
  }, []);

  const example = examples?.find((e) => e.style === props.style) || examples?.[0];

  return (
    <dialog ref={ref} aria-labelledby="exempel-rubrik" className="m-auto w-[min(1100px,95vw)] max-h-[95vh] rounded-2xl p-0 backdrop:bg-black/40">
      <div className="p-4 md:p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="exempel-rubrik" className="text-xl font-semibold text-gray-900">{T.exampleTitle}{example ? `: ${example.name}` : ''}</h2>
            <p className="text-sm text-gray-500">{T.exampleNote}</p>
          </div>
          <SecondaryButton onClick={() => ref.current?.close()}>{T.close}</SecondaryButton>
        </div>
        {error && <ErrorBox message={error} />}
        {!error && !example && <p role="status" className="text-gray-600">{T.loading}</p>}
        {example && <DeviceFrame src={example.url} title={T.exampleFrameTitle} heightClass="h-[65vh]" />}
      </div>
    </dialog>
  );
}
