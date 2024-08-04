<script>
	import { createEventDispatcher } from 'svelte';
	export let form;
	const dispatch = createEventDispatcher();
	let loading = false;
	let errorMessage = '';

	let email = '';
	let password = '';

	async function handleLogin(event) {
		event.preventDefault();
		loading = true;
		errorMessage = '';
        const form = new FormData()
        form.append('email', email)
        form.append('password', password)

		try {
			const response = await fetch('/login', {  // Updated endpoint
				method: 'POST',
				body: form
			});

			if (response.ok) {
				const data = await response.json();
				console.log('Login successful:', data);
				dispatch('loginSuccess', { user: data.user });
				window.location.href = '/';  // Redirect after login
			} else {
				const errorData = await response.json();
				console.error('Login failed:', errorData);
				errorMessage = errorData.message || 'Invalid email or password.';
			}
		} catch (error) {
			console.error('Error during login:', error);
			errorMessage = 'An unexpected error occurred. Please try again later.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="login-card rounded-lg shadow-lg p-8">
		<h2 class="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
		<form on:submit={handleLogin}>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="email"> Email </label>
				<input
					type="email"
					id="email"
					bind:value={email}
					placeholder="Enter your email"
					class="input input-bordered w-full"
					required
				/>
			</div>
			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="password"> Password </label>
				<input
					type="password"
					id="password"
					bind:value={password}
					placeholder="Enter your password"
					class="input input-bordered w-full"
					required
				/>
			</div>
			{#if errorMessage}
				<div class="alert alert-error mb-4">
					{errorMessage}
				</div>
			{/if}
			<div class="flex items-center justify-between">
				<button type="submit" class="btn btn-primary w-full" disabled={loading}>
					{#if loading}
						Loading...
					{:else}
						Login
					{/if}
				</button>
			</div>
			<div class="flex items-center justify-between mt-4">
				<a href="#" class="link text-sm text-blue-500 hover:underline"> Forgot Password? </a>
				<a href="#" class="link text-sm text-blue-500 hover:underline"> Sign Up </a>
			</div>
		</form>
	</div>
</div>

<style>
	.login-card {
		max-width: 400px;
		margin: 0 auto;
	}

	.alert {
		padding: 10px;
		border-radius: 5px;
	}

	.alert-error {
		background-color: #f8d7da;
		color: #721c24;
		border-color: #f5c6cb;
	}
</style>
