'use client';

import React, { useId, useState } from 'react';
import { T } from '@/lib/site-builder/texts';

/**
 * Små byggstenar i onboardingens formspråk (questions-form.tsx): alternativ som knappar i full
 * bredd med rundade hörn och grön markering, runda primärknappar och tydliga etiketter.
 */

const GREEN = '#10b981';

export function OptionButton(props: { selected: boolean; onClick: () => void; label: string; help?: string; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={props.selected}
      onClick={props.onClick}
      className="w-full text-left px-6 py-4 rounded-2xl border-2 font-medium text-gray-800 transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
      style={{
        borderColor: props.selected ? GREEN : '#e5e7eb',
        background: props.selected ? 'rgba(16,185,129,0.06)' : 'white',
        boxShadow: props.selected ? '0 0 0 3px rgba(16,185,129,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <span className="flex items-center gap-3">
        {props.children}
        <span>
          <span className="block">{props.label}</span>
          {props.help && <span className="block text-sm font-normal text-gray-500 mt-0.5">{props.help}</span>}
        </span>
      </span>
    </button>
  );
}

export function PrimaryButton(props: { onClick?: () => void; disabled?: boolean; children: React.ReactNode; type?: 'button' | 'submit' }) {
  const enabled = !props.disabled;
  return (
    <button
      type={props.type || 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className="px-10 py-3 rounded-full font-semibold transition-all duration-200 w-full md:w-auto focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
      style={{
        background: enabled ? GREEN : '#d1fae5',
        color: enabled ? 'white' : '#047857',
        cursor: enabled ? 'pointer' : 'not-allowed',
        boxShadow: enabled ? '0 4px 14px rgba(16,185,129,0.3)' : 'none',
      }}
    >
      {props.children}
    </button>
  );
}

export function SecondaryButton(props: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      className="px-6 py-3 rounded-full font-medium text-gray-700 border-2 border-gray-200 bg-white hover:border-gray-300 disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 w-full md:w-auto"
    >
      {props.children}
    </button>
  );
}

export function LinkButton(props: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={props.onClick} className="text-sm font-medium text-emerald-800 underline underline-offset-4 hover:text-emerald-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 rounded">
      {props.children}
    </button>
  );
}

/** Textfält eller textyta med etikett, hjälptext, teckenräknare och felmeddelande. */
export function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
  error?: string;
  max: number;
  multiline?: boolean;
  rows?: number;
}) {
  const id = useId();
  const helpId = `${id}-help`;
  const errId = `${id}-err`;
  const describedBy = [props.help ? helpId : '', props.error ? errId : ''].filter(Boolean).join(' ') || undefined;
  const common = {
    id,
    value: props.value,
    maxLength: props.max,
    'aria-invalid': props.error ? true : undefined,
    'aria-describedby': describedBy,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => props.onChange(e.target.value),
    className: 'w-full rounded-2xl border-2 px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100',
    style: { borderColor: props.error ? '#ef4444' : '#e5e7eb' },
  };
  return (
    <div className="w-full text-left">
      <label htmlFor={id} className="block font-medium text-gray-900 mb-1">{props.label}</label>
      {props.help && <p id={helpId} className="text-sm text-gray-500 mb-2">{props.help}</p>}
      {props.multiline ? <textarea {...common} rows={props.rows || 4} /> : <input type="text" {...common} />}
      <div className="flex justify-between mt-1 text-sm">
        <span id={errId} className="text-red-600" role={props.error ? 'alert' : undefined}>{props.error || ''}</span>
        <span className="text-gray-400" aria-hidden="true">{props.value.length}/{props.max}</span>
      </div>
    </div>
  );
}

export function ErrorBox(props: { message: string; children?: React.ReactNode }) {
  return (
    <div role="alert" className="w-full rounded-md bg-red-50 p-3 text-red-800 text-left">
      <p>{props.message}</p>
      {props.children}
    </div>
  );
}

export function InfoBox(props: { children: React.ReactNode }) {
  return <div className="w-full rounded-md bg-emerald-50 p-3 text-emerald-800 text-left text-sm">{props.children}</div>;
}

/** Ram runt en sajt (förhandsvisning eller exempel) med växling mellan dator och mobil. */
export function DeviceFrame(props: { src: string; title: string; heightClass?: string }) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div role="group" aria-label="Visningsläge" className="inline-flex rounded-full border-2 border-gray-200 p-1 bg-white">
        {(['desktop', 'mobile'] as const).map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={device === d}
            onClick={() => setDevice(d)}
            className="px-4 py-1.5 rounded-full text-sm font-medium focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            style={{ background: device === d ? GREEN : 'transparent', color: device === d ? 'white' : '#374151' }}
          >
            {d === 'desktop' ? T.desktop : T.mobile}
          </button>
        ))}
      </div>
      <div className="w-full flex justify-center rounded-2xl border-2 border-gray-200 bg-gray-50 p-2 overflow-hidden">
        <iframe
          src={props.src}
          title={props.title}
          className={`bg-white rounded-xl ${props.heightClass || 'h-[70vh]'}`}
          style={{ width: device === 'desktop' ? '100%' : 390, maxWidth: '100%', border: 0 }}
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}
