import { redirect, invalid } from "@sveltejs/kit"; // Correct import for `invalid`
import { validateData } from "$lib/utils";
import { loginUserSchema } from "$lib/schemas";

export const load = ({ locals }) => {
	if (locals.pb?.authStore.isValid) {
		throw redirect(303, '/');
	}
};

export const actions = {
	default: async ({ request, locals }) => {
		// Validate form data
		const formData = await request.formData()
		console.log("THIS FORM", formData)


		try {
			await locals.pb
				.collection("users")
				.authWithPassword(formData.get('email'), formData.get('password'));

			// Check if the user is verified
			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();
				return {
					notVerified: true,
				};
			}

			// Successful login, redirect to home
			throw redirect(307, "/");
		} catch (err) {
			console.error("Error during login:", err?.data?.message);

			// Handle invalid credentials
			if (err?.data?.message) {
				console.log("Invalid credentials");
				return {
					InvalidCred: true,
				};
			}
		}
	}
};
