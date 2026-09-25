import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  portfolioKindLabels,
  type PortfolioProject,
} from '@/lib/data/portfolioProjects';

interface ProjectCardProps {
  project: PortfolioProject;
  /** 'featured' is the wide client case, 'compact' a card in the concept row */
  variant?: 'featured' | 'compact';
}

const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2';

export function ProjectCard({ project, variant = 'compact' }: ProjectCardProps) {
  return variant === 'featured' ? (
    <FeaturedCard project={project} />
  ) : (
    <CompactCard project={project} />
  );
}

/** External projects open in a new tab; internal ones go through next/link. */
function ProjectLink({
  project,
  className,
  children,
}: {
  project: PortfolioProject;
  className: string;
  children: ReactNode;
}) {
  if (project.external) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={project.href} className={className}>
      {children}
    </Link>
  );
}

function Cta({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-dark">
      {label}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </span>
  );
}

function FeaturedCard({ project }: { project: PortfolioProject }) {
  return (
    <ProjectLink
      project={project}
      className={`group grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-colors duration-300 hover:border-teal-dark/50 lg:grid-cols-3 ${focusRing}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 lg:col-span-2 lg:aspect-auto lg:min-h-[380px]">
        {project.siteImage && (
          <Image
            src={project.siteImage}
            alt={`Webbplatsen för ${project.title}`}
            fill
            sizes="(max-width: 1023px) 100vw, 66vw"
            // Skalad från överkanten så att skärmdumpens mörka nederkant beskärs bort
            className="origin-top scale-[1.04] object-cover object-top transition-transform duration-700 group-hover:scale-[1.06] motion-reduce:transition-none"
          />
        )}
      </div>

      <div className="flex flex-col justify-center gap-4 p-6 md:p-8 lg:p-10">
        {project.logo && (
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <Image
              src={project.logo}
              alt={`${project.title} logotyp`}
              fill
              sizes="80px"
              className="object-contain"
            />
          </div>
        )}
        <span className="text-overline text-teal-dark">
          {portfolioKindLabels[project.kind]}
        </span>
        <h3 className="text-2xl font-bold leading-tight text-black md:text-3xl">
          {project.title}
        </h3>
        <p className="text-body text-gray-600">
          {project.description ?? project.metric}
        </p>
        <Cta label={project.ctaLabel} />
      </div>
    </ProjectLink>
  );
}

function CompactCard({ project }: { project: PortfolioProject }) {
  return (
    <ProjectLink project={project} className={`group block rounded-3xl ${focusRing}`}>
      {/* Logo by default, site screenshot on hover */}
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-3xl border border-gray-200 bg-white transition-colors duration-300 group-hover:border-teal-dark/50">
        {project.logo && (
          <Image
            src={project.logo}
            alt={project.title}
            fill
            sizes="(max-width: 1023px) 320px, 33vw"
            className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${
              project.siteImage ? 'group-hover:opacity-0' : ''
            }`}
          />
        )}
        {project.siteImage && (
          <Image
            src={project.siteImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 1023px) 320px, 33vw"
            className="object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
          />
        )}
      </div>

      <div className="px-1">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {portfolioKindLabels[project.kind]}
        </span>
        <h3 className="mt-1 text-base font-semibold leading-tight text-black transition-colors duration-300 group-hover:text-teal-dark md:text-lg">
          {project.title}
        </h3>
        <p className="mt-1 mb-3 text-sm text-gray-600">{project.metric}</p>
        <Cta label={project.ctaLabel} />
      </div>
    </ProjectLink>
  );
}
