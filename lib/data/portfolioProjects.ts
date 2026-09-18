export type PortfolioCategoryId = 'ecommerce' | 'saas' | 'local' | 'other';

export interface PortfolioProject {
  slug: string;
  title: string;
  /** Visible category label on the card */
  category: string;
  /** Category used by the filter chips */
  categoryId: PortfolioCategoryId;
  /** Short result/metric line under the title */
  metric: string;
  image?: string;
  /** Optional second image revealed on hover */
  hoverImage?: string;
  href: string;
  external?: boolean;
  ctaLabel: string;
}

export const portfolioCategories: { id: 'all' | PortfolioCategoryId; label: string }[] = [
  { id: 'all', label: 'Alla' },
  { id: 'ecommerce', label: 'E-handel' },
  { id: 'saas', label: 'SaaS' },
  { id: 'local', label: 'Lokal Business' },
  { id: 'other', label: 'Övrigt' },
];

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'peran',
    title: 'Perán',
    category: 'E-handel',
    categoryId: 'ecommerce',
    metric: 'Prognos: +100–200% trafik',
    image: '/forthewebsitesource.png',
    hoverImage: '/forthebetterse.png',
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
    image: '/glowanotherone.png',
    hoverImage: '/glowkundcase.png',
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
    image: '/mintiwebsite.png',
    hoverImage: '/mintilogo.png',
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
    image: '/vattentrygghovering.png',
    hoverImage: '/Vattentrygg-logo-p-500.png',
    href: '/kontakt',
    ctaLabel: 'Fråga om caset',
  },
  {
    slug: 'fashion-store',
    title: 'Fashion E-commerce Store',
    category: 'E-handel',
    categoryId: 'ecommerce',
    metric: '+200% trafik på 3 månader',
    href: '/portfolio/fashion-store',
    ctaLabel: 'Visa projekt',
  },
  {
    slug: 'saas-platform',
    title: 'Tech Startup Platform',
    category: 'SaaS',
    categoryId: 'saas',
    metric: 'Lanserat på 4 veckor',
    href: '/portfolio/saas-platform',
    ctaLabel: 'Visa projekt',
  },
  {
    slug: 'restaurant',
    title: 'Restaurant Website',
    category: 'Lokal Business',
    categoryId: 'local',
    metric: '+150% bokningar',
    href: '/portfolio/restaurant',
    ctaLabel: 'Visa projekt',
  },
  {
    slug: 'nonprofit',
    title: 'Non-Profit Organization',
    category: 'Organisation',
    categoryId: 'other',
    metric: '+150% donationer online',
    href: '/portfolio/nonprofit',
    ctaLabel: 'Visa projekt',
  },
];
