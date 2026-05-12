import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	return { trackingNumber: url.searchParams.get('n') ?? '' };
};
