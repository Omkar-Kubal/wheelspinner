import { MetadataRoute } from 'next';

const BASE_URL = 'https://randomwheelpicker.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/random-name-picker',
    '/yes-no-wheel',
    '/wheel-of-names',
    '/team-picker',
    '/classroom-wheel',
    '/prize-wheel',
    '/truth-or-dare-wheel',
    '/about',
    '/privacy',
    '/terms',
  ];

  return routes.map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
