import { MetadataRoute } from 'next';

const BASE_URL = 'https://randomwheelpicker.io';

const toolRoutes = [
  '/random-name-picker',
  '/yes-no-wheel',
  '/wheel-of-names',
  '/team-picker',
  '/classroom-wheel',
  '/prize-wheel',
  '/truth-or-dare-wheel',
];

const staticRoutes = ['/about', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const homepage: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  const tools: MetadataRoute.Sitemap = toolRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const statics: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.3,
  }));

  return [...homepage, ...tools, ...statics];
}
