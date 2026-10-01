'use client';

import { CalendarDaysIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { RADIUS } from '../payment-cards/primitives';
import type { PhotoCardContent } from '@/lib/data/for-dig/foretag-start';

/*
 * Small widgets for /foretag-nya (Företag Start). Content comes from
 * lib/data/for-dig/foretag-start.ts; nothing here is page copy.
 */

/**
 * Floating card for a ServiceFullBleed photo: a light frame over the photo with
 * a title and one pill, and a single solid row under it. One figure or status,
 * one pill, one row – nothing more (see the FullBleedPhoto spec).
 */
function PhotoCard({ content, icon: Icon }: { content: PhotoCardContent; icon: typeof CreditCardIcon }) {
  return (
    <div className={`bg-white/10 p-4 ring-1 ring-white/50 backdrop-blur-[16px] ${RADIUS.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ui-label text-white/80">{content.label}</p>
          <p className="text-ui-amount mt-1 text-white">{content.value}</p>
        </div>
        {content.pill ? (
          <span className={`text-ui-label shrink-0 bg-white px-2.5 py-1 font-semibold text-black ${RADIUS.control}`}>
            {content.pill}
          </span>
        ) : null}
      </div>
      <div className={`mt-4 flex items-center gap-3 bg-white px-3 py-2.5 text-black shadow-[0_16px_40px_-20px_rgba(0,0,0,0.25)] ${RADIUS.field}`}>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center bg-teal-dark text-white ${RADIUS.control}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="text-ui-body block truncate">{content.row.title}</span>
          <span className="text-ui-label block truncate text-gray-600">{content.row.note}</span>
        </span>
      </div>
    </div>
  );
}

export function PaymentLinkCard({ content }: { content: PhotoCardContent }) {
  return <PhotoCard content={content} icon={CreditCardIcon} />;
}

export function DeadlineCard({ content }: { content: PhotoCardContent }) {
  return <PhotoCard content={content} icon={CalendarDaysIcon} />;
}
