import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(import.meta.env.VITE_PB_URL);
	/* event.locals.pb.admins.authWithPassword(import.meta.env.VITE_AUTH_ADMIN_NAME, import.meta.env.VITE_AUTH_ADMIN_PASS) */
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (event.locals.pb.authStore.isValid) {
			const user = await event.locals.pb.collection('users').getOne(event.locals.pb.authStore.model.id);
			event.locals.user = serializeNonPOJOs(user);
		}
	} catch (_) {
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;
	}

	const response = await resolve(event);

	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ sameSite: 'Lax', secure: true })
	);
	//sameSite: 'Lax'
	return response;
};