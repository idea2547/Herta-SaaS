import { createAdminClient } from '$lib/pocketbase';

export const load = async () => {
    const pb = await createAdminClient()
    const packages = await pb.collection('packages').getFullList(undefined, { filter: 'status = "active"'})
    return {
        packages: JSON.stringify(packages)
    }
};