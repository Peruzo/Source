import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = 0;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://source.com';

  const routes = ['', '/tjanster', '/portfolio', '/om-oss', '/priser', '/kontakt', '/hjalp'];
  
  const projects = ['fashion-store', 'saas-platform', 'restaurant', 'nonprofit'];
  
  const helpCategories = [
    'kom-igang',
    'hemsidor-webbutveckling',
    'webbutik-produktadministration',
    'kundportal',
    'betalningar-ekonomi',
    'marknadsforing',
    'statistik-analys',
    'integrationer',
    'ai-automatisering',
    'gdpr-sakerhet',
    'installningar-konto',
    'support-hjalp',
  ];

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })),
    ...projects.map((slug) => ({
      url: `${baseUrl}/portfolio/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...helpCategories.map((category) => ({
      url: `${baseUrl}/hjalp/${category}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
