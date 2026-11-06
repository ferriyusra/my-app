import type { MetadataRoute } from 'next';
import { profile } from '@/data/profile';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: profile.site,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1,
		},
		{
			url: `${profile.site}/deposit-alerting`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.8,
		},
		{
			url: `${profile.site}/satusehat`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.7,
		},
	];
}
