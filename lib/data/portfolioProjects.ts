export type PortfolioCategoryId = 'ecommerce' | 'local';

export interface PortfolioProject {
  slug: string;
  title: string;
  /** Visible category label on the card */
  category: string;
  /** Category used by the filter chips */
  categoryId: PortfolioCategoryId;
  /** Short result/metric line under the title */
  metric: string;
  /** Logotype, shown by default */
  logo?: string;
  /** Site screenshot, revealed on hover (or on the active card where hover is unavailable) */
  siteImage?: string;
  href: string;
  external?: boolean;
  ctaLabel: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'peran',
    title: 'Perán',
    category: 'E-handel',
    categoryId: 'ecommerce',
    metric: 'Prognos: +100–200% trafik',
    logo: '/peran-logo.webp',
    siteImage: '/peran-site.webp',
    href: 'https://peran.onrender.com/',
    external: true,
    ctaLabel: 'Besök sidan',
  },
  {
    slug: 'glow',
    title: 'GLOW',
    category: 'E-handel',
    categoryId: 'ecommerce',
    metric: 'E-handel & varumärke',
    logo: '/glow-logo.webp',
    siteImage: '/glow-site.webp',
    href: 'https://glow-test.onrender.com/',
    external: true,
    ctaLabel: 'Besök sidan',
  },
  {
    slug: 'minti-wellness',
    title: 'Minti Wellness',
    category: 'Lokal Business',
    categoryId: 'local',
    metric: 'Wellness & digital närvaro',
    logo: '/minti-logo.webp',
    siteImage: '/minti-site.webp',
    href: 'https://minti.onrender.com/',
    external: true,
    ctaLabel: 'Besök sidan',
  },
  {
    slug: 'vattentrygg',
    title: 'Vattentrygg',
    category: 'Lokal Business',
    categoryId: 'local',
    metric: 'Översvämningsskydd & fastighetsskydd',
    logo: '/vattentrygg-logo.webp',
    siteImage: '/vattentrygg-site.webp',
    href: '/kontakt',
    ctaLabel: 'Fråga om caset',
  },
];

const categoryLabels: Record<PortfolioCategoryId, string> = {
  ecommerce: 'E-handel',
  local: 'Lokal Business',
};

/**
 * Derived from the projects rather than hard-coded, so a filter chip can never
 * be rendered with nothing behind it. Add a project in a new category and its
 * chip appears; remove the last project in a category and its chip goes away.
 */
export const portfolioCategories: { id: 'all' | PortfolioCategoryId; label: string }[] = [
  { id: 'all', label: 'Alla' },
  ...(Object.keys(categoryLabels) as PortfolioCategoryId[])
    .filter((id) => portfolioProjects.some((project) => project.categoryId === id))
    .map((id) => ({ id, label: categoryLabels[id] })),
];
