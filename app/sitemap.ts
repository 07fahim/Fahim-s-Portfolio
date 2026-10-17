import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://fahimfaiyaz.dev/', changeFrequency: 'monthly', priority: 1 }];
}
