'use client';

import { useEffect, useRef, useState } from 'react';
import { LIMITS, SUPPORT_CATEGORIES, T } from '@/lib/site-builder/texts';
import { api } from './api';
import { ErrorBox, Field, InfoBox, OptionButton, PrimaryButton, SecondaryButton } from './ui';

/** "Behöver du hjälp?": supportärende med fast kategori och kort text, i en modal dialog. */
export function HelpPanel(props: { onboardingId: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    const onClose = () => props.onClose();
    dialog?.addEventListener('close', onClose);
    return () => dialog?.removeEventListener('close', onClose);
  }, [props]);

  async function send() {
    if (!category) { setError(T.pickOne); return; }
    if (/[<>]/.test(message)) { setError(T.noAngles); return; }
    setSending(true);
    setError('');
    const res = await api<{ supportRequest: { id: string; status: string } }>('/support-request', 'POST', {
      onboardingId: props.onboardingId, category, message: message.trim(),
    });
    setSending(false);
    if (res.ok) setSent(true);
    else setError(res.message);
  }

  return (
    <dialog ref={ref} aria-labelledby="hjalp-rubrik" className="m-auto w-[min(560px,95vw)] max-h-[95vh] rounded-2xl p-0 backdrop:bg-black/40">
      <div className="p-6 flex flex-col gap-4">
        <h2 id="hjalp-rubrik" className="text-xl font-semibold text-gray-900">{T.helpTitle}</h2>
        {sent ? (
          <>
            <InfoBox><span role="status">{T.helpSent}</span></InfoBox>
            <div className="flex justify-end"><SecondaryButton onClick={() => ref.current?.close()}>{T.close}</SecondaryButton></div>
          </>
        ) : (
          <>
            <fieldset className="flex flex-col gap-2">
              <legend className="font-medium text-gray-900 mb-2">{T.helpCategory}</legend>
              {SUPPORT_CATEGORIES.map((c) => (
                <OptionButton key={c.value} label={c.label} selected={category === c.value} onClick={() => setCategory(c.value)} />
              ))}
            </fieldset>
            <Field label={T.helpMessage} help={T.helpMessageHelp} value={message} onChange={setMessage} max={LIMITS.supportMessage[1]} multiline rows={4} />
            {error && <ErrorBox message={error} />}
            <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-end">
              <SecondaryButton onClick={() => ref.current?.close()}>{T.close}</SecondaryButton>
              <PrimaryButton onClick={send} disabled={sending}>{sending ? T.saving : T.helpSubmit}</PrimaryButton>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
