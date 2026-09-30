'use client';

import { useId } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { CARD_EDGE, RADIUS } from '@/components/sections/for-dig/payment-cards/primitives';
import { Box, Card, Carton, CheckMark, PressButton, StatusPill, useStep } from './CampaignDemos';

/*
 * Widgets for /ai-assistent. Content comes from lib/data/tjanster/ai-assistent.ts;
 * nothing here is page copy. Built from the payment-cards primitives and the
 * campaign demo pieces, so they read as the same product as the other service
 * pages. Every label is the customer portal's own.
 */

/* ── Source AI – one question and one answer row, for the photo card ──────── */

export type SourceAiAnswerContent = {
  label: string;
  name: string;
  question: string;
  row: { title: string; note: string; status: string };
};

/**
 * Source AI in the chat bubble: the visitor's question and one data row from
 * the account as the answer. One row and no button, so it stays small enough
 * for a card over a photo.
 */
export function SourceAiAnswerCard({ content }: { content: SourceAiAnswerContent }) {
  const titleId = useId();
  const c = content;

  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-4 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <p className="sr-only">{c.label}</p>
      <div className="flex items-center justify-between gap-3">
        <h3 id={titleId} className="text-ui-title">
          {c.name}
        </h3>
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-teal-dark" />
      </div>
      <p className={`text-ui-body ml-auto mt-3 max-w-[88%] bg-gray-100 px-3 py-2 text-black ${RADIUS.field}`}>{c.question}</p>
      <div className={`mt-2.5 flex items-center gap-3 border border-gray-200 px-3 py-2.5 ${RADIUS.field}`}>
        <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center bg-[#F4EEE5] ${RADIUS.field}`}>
          <Carton />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-ui-body block truncate">{c.row.title}</span>
          <span className="text-ui-label block truncate text-gray-600">{c.row.note}</span>
        </span>
        <span className={`text-ui-label shrink-0 whitespace-nowrap bg-status-unpaid-bg px-2 py-0.5 text-status-unpaid ${RADIUS.control}`}>
          {c.row.status}
        </span>
      </div>
    </div>
  );
}

/* ── AI-insikter – the week list and the advisor chat, for StickySteps ───── */

export type WeekListContent = {
  label: string;
  title: string;
  rows: { id: string; advisor: string; area: string; action: string }[];
};

/** "Att göra denna vecka": one insight per area, each with its advisor's name. No portraits. */
export function WeekList({ content }: { content: WeekListContent }) {
  const titleId = useId();

  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-4 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>
      <p className="sr-only">{content.label}</p>
      <ul className="mt-2 divide-y divide-gray-200">
        {content.rows.map((row) => (
          <li key={row.id} className="py-2.5">
            <p className="text-ui-label text-gray-600">
              <span className="font-semibold text-teal-dark">{row.advisor}</span> · {row.area}
            </p>
            <p className="text-ui-body mt-0.5 break-words">{row.action}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type AdvisorChatContent = {
  label: string;
  advisor: string;
  role: string;
  intro: string;
  question: string;
  answer: string;
};

/** "Fråga rådgivaren": the advisor's greeting, the visitor's follow-up and the answer. */
export function AdvisorChatCard({ content }: { content: AdvisorChatContent }) {
  const titleId = useId();
  const c = content;

  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-4 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <p className="sr-only">{c.label}</p>
      <h3 id={titleId} className="text-ui-title">
        {c.advisor} <span className="text-ui-label font-normal text-gray-600">· {c.role}</span>
      </h3>
      <div className="mt-3 space-y-2">
        <p className={`text-ui-body max-w-[92%] border border-gray-200 px-3 py-2 ${RADIUS.field}`}>{c.intro}</p>
        <p className={`text-ui-body ml-auto max-w-[85%] bg-gray-100 px-3 py-2 ${RADIUS.field}`}>{c.question}</p>
        <p className={`text-ui-body max-w-[92%] border border-gray-200 px-3 py-2 ${RADIUS.field}`}>{c.answer}</p>
      </div>
    </div>
  );
}

/* ── Leads – the same widget as LeadList on Företag Växa ────────────────── */

/** The follow-up step a lead is in, drawn as a status pill. */
export type LeadStage = 'new' | 'contacted' | 'won';

export type LeadListContent = {
  label: string;
  title: string;
  ratingLabel: string;
  leads: {
    id: string;
    company: string;
    place: string;
    /** Letter grade as in the portal: A, B, C, D or F. */
    rating: string;
    motivation: string;
    stage: LeadStage;
    status: string;
  }[];
  action: string;
};

/*
 * Status pill per follow-up step. The step is written out in the pill, so the
 * colour is never the only signal: a plain outline for a new lead, grey for
 * contacted, the paid green for won.
 */
const LEAD_STAGE_PILL: Record<LeadStage, string> = {
  new: 'border border-gray-300 text-gray-700',
  contacted: 'bg-gray-100 text-black',
  won: 'bg-status-paid-bg text-status-paid',
};

/**
 * A lead list as on the portal's leads page: company and place, the letter
 * grade, a one-line motivation and the follow-up status, with the
 * pitch-analysis button under it. Same markup and content type as LeadList in
 * components/sections/for-dig/foretag-vaxa/widgets.tsx (on develop since
 * #121, not on this branch's base) – swap to that one when the branch is
 * updated. Illustration only: the button is a look-alike, no score numbers.
 */
export function LeadList({ content }: { content: LeadListContent }) {
  const titleId = useId();

  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-4 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>
      <p className="sr-only">{content.label}</p>

      <ul className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
        {content.leads.map((lead) => (
          <li key={lead.id} className="flex items-start gap-3 py-3">
            <span
              aria-label={`${content.ratingLabel} ${lead.rating}`}
              role="img"
              className={`text-ui-body flex h-8 w-8 shrink-0 items-center justify-center bg-teal-dark font-semibold text-white ${RADIUS.control}`}
            >
              {lead.rating}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-ui-body min-w-0 break-words font-semibold">{lead.company}</span>
                <span className={`text-ui-label shrink-0 whitespace-nowrap px-2 py-0.5 ${RADIUS.control} ${LEAD_STAGE_PILL[lead.stage]}`}>
                  {lead.status}
                </span>
              </span>
              <span className="text-ui-label block text-gray-600">{lead.place}</span>
              <span className="text-ui-label mt-1 block break-words text-gray-700">{lead.motivation}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex">
        <span className={`text-ui-label inline-flex items-center whitespace-nowrap bg-teal-dark px-3.5 py-1.5 text-white ${RADIUS.control}`}>
          {content.action}
        </span>
      </div>
    </div>
  );
}

/* ── Bokföringshjälpen – a static exchange with Source AI in accounting mode ── */

export type BookkeepingHelpContent = {
  label: string;
  name: string;
  mode: string;
  entry: string;
  question: string;
  answer: string;
  disclaimer: string;
};

/**
 * The accounting page's entry button, one question and one answer, and the
 * portal's own disclaimer line under the answer. Illustration only: the button
 * is a look-alike.
 */
export function BookkeepingHelpCard({ content }: { content: BookkeepingHelpContent }) {
  const titleId = useId();
  const c = content;

  return (
    <div className="w-full space-y-3">
      <span className={`text-ui-label inline-flex items-center gap-1.5 border border-gray-300 bg-white px-3.5 py-1.5 text-black ${RADIUS.control}`}>
        <QuestionMarkCircleIcon className="h-4 w-4" aria-hidden="true" />
        {c.entry}
      </span>

      <Card
        titleId={titleId}
        title={c.name}
        badge={<span className={`text-ui-label whitespace-nowrap bg-teal-light px-2.5 py-0.5 font-semibold text-teal-darker ${RADIUS.control}`}>{c.mode}</span>}
      >
        <p className="sr-only">{c.label}</p>
        <div className="mt-4 space-y-2.5">
          <p className={`text-ui-body ml-auto max-w-[85%] bg-gray-100 px-3.5 py-2.5 text-black ${RADIUS.field}`}>{c.question}</p>
          <p className={`text-ui-body max-w-[92%] border border-gray-200 bg-white px-3.5 py-2.5 text-black ${RADIUS.field}`}>{c.answer}</p>
        </div>
        <p className="text-ui-label mt-3 border-t border-gray-200 pt-3 text-gray-600">{c.disclaimer}</p>
      </Card>
    </div>
  );
}

/* ── Kampanjassistenten – brief, plan, channels ─────────────────────────── */

export type CampaignAssistantDemoContent = {
  title: string;
  status: { idle: string; done: string };
  purpose: { label: string; value: string };
  fields: { label: string; value: string }[];
  planButton: string;
  planTitle: string;
  channels: { id: string; label: string; fit: string }[];
  apply: string;
  applyNote: string;
};

/** A brief field whose answer fades in over an empty field. Keeps its size from the first frame. */
function BriefField({ progress, from, to, field }: { progress: MotionValue<number>; from: number; to: number; field: { label: string; value: string } }) {
  const show = useStep(progress, from, to);
  return (
    <Box label={field.label}>
      <motion.span style={{ opacity: show }} className="block truncate">
        {field.value}
      </motion.span>
    </Box>
  );
}

/** One platform in the plan: it appears, then its box is ticked – as the portal pre-ticks the plan's platforms. */
function PlanRow({ progress, at, channel }: { progress: MotionValue<number>; at: number; channel: { label: string; fit: string } }) {
  const show = useStep(progress, at, at + 0.08);
  const rise = useTransform(show, [0, 1], [6, 0]);
  const tick = useStep(progress, 0.66, 0.72);
  return (
    <motion.li style={{ opacity: show, y: rise }} className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-ui-body flex min-w-0 items-center gap-2.5">
        <span className={`relative flex h-5 w-5 flex-shrink-0 items-center justify-center border border-gray-400 ${RADIUS.control}`}>
          <motion.span style={{ opacity: tick, scale: tick }} className={`absolute inset-[-1px] flex items-center justify-center bg-teal-dark text-white ${RADIUS.control}`}>
            <CheckMark />
          </motion.span>
        </span>
        <span className="truncate">{channel.label}</span>
      </span>
      <span className={`text-ui-label flex-shrink-0 whitespace-nowrap bg-gray-100 px-2.5 py-0.5 text-gray-700 ${RADIUS.control}`}>{channel.fit}</span>
    </motion.li>
  );
}

/**
 * Plays the portal's start flow forward: the purpose is chosen, the brief fills
 * in, "Ta fram plan" is pressed, the plan's platforms appear and are ticked,
 * and "Starta marknadsföringen" turns them into channels. At 1 everything is in
 * its final state (what reduced motion shows). No budget shares, no images.
 */
export function CampaignAssistantDemo({ progress, content }: { progress: MotionValue<number>; content: CampaignAssistantDemoContent }) {
  const titleId = useId();
  const c = content;
  const purpose = useStep(progress, 0.02, 0.1);
  const planIn = useStep(progress, 0.36, 0.42);
  const done = useStep(progress, 0.84, 0.9);

  return (
    <Card titleId={titleId} title={c.title} badge={<StatusPill show={done} idle={c.status.idle} done={c.status.done} />}>
      <div className="mt-4 space-y-2">
        <Box label={c.purpose.label}>
          <span className="flex items-center justify-between gap-3">
            <span className="truncate">{c.purpose.value}</span>
            <motion.span style={{ opacity: purpose, scale: purpose }} className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-dark text-white">
              <CheckMark />
            </motion.span>
          </span>
        </Box>
        {c.fields.map((field, i) => (
          <BriefField key={field.label} progress={progress} from={0.1 + i * 0.1} to={0.18 + i * 0.1} field={field} />
        ))}
      </div>

      <div className="mt-3">
        <PressButton progress={progress} at={0.33} full>
          {c.planButton}
        </PressButton>
      </div>

      <motion.div style={{ opacity: planIn }} className="mt-4 border-t border-gray-200 pt-3">
        <p className="text-ui-overline text-gray-600">{c.planTitle}</p>
        <ul className="divide-y divide-gray-100">
          {c.channels.map((channel, i) => (
            <PlanRow key={channel.id} progress={progress} at={0.42 + i * 0.07} channel={channel} />
          ))}
        </ul>
        <div className="mt-3">
          <PressButton progress={progress} at={0.8} full>
            {c.apply}
          </PressButton>
        </div>
        <p className="text-ui-label mt-2 text-gray-600">{c.applyNote}</p>
      </motion.div>
    </Card>
  );
}

/* ── Paketen – which AI feature is in which package ─────────────────────── */

export type PackageListContent = {
  label: string;
  title: string;
  rows: { id: string; name: string; plans: string }[];
};

/** A plain list of the AI features and the packages they are in, as on /priser. */
export function PackageList({ content }: { content: PackageListContent }) {
  const titleId = useId();

  return (
    <div role="group" aria-labelledby={titleId} className={`w-full bg-white p-5 text-left text-black ${CARD_EDGE} ${RADIUS.card}`}>
      <h3 id={titleId} className="text-ui-title">
        {content.title}
      </h3>
      <p className="sr-only">{content.label}</p>
      <ul className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
        {content.rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
            <span className="text-ui-body min-w-0 break-words">{row.name}</span>
            <span className={`text-ui-label shrink-0 whitespace-nowrap bg-gray-100 px-2.5 py-0.5 text-gray-800 ${RADIUS.control}`}>{row.plans}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
