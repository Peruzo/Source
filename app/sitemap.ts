import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = 0;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://source.com';

  const routes = ['', '/tjanster', '/portfolio', '/om-oss', '/priser', '/kontakt'];
  
  const projects = ['fashion-store', 'saas-platform', 'restaurant', 'nonprofit'];

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
  ];
}
