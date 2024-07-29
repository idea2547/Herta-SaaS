<script>
	import { features } from './features';
</script>

<svelte:head>
	<title>RENISHIP</title>
</svelte:head>

<section id="home" class="pt-32 sm:pt-40 md:pt-28 from-indigo-600 to-indigo-0 text-white">
	<div
		class="mt-0 flex flex-col items-center justify-center space-y-5 px-4 md:px-10 lg:w-2/3 mx-auto"
	>
		<div class="relative flex flex-col gap-12 items-center">
			<h1
				class="text-center font-extrabold text-5xl sm:text-6xl lg:text-left lg:text-7xl leading-tight tracking-wide drop-shadow-lg"
			>
				Ship your own<br /> startup fast ⚡
			</h1>
			<div class="mt-6 md:mt-10 text-sm md:text-lg">
				Built with <a href="https://kit.svelte.dev" class="link font-bold" target="_blank"
					>SvelteKit</a
				>,
				<a href="https://pocketbase.io" class="link font-bold" target="_blank">Pocketbase</a>,
				<a href="https://stripe.com" class="link font-bold" target="_blank">Stripe</a>,
				<a href="https://tailwindcss.com" class="link font-bold" target="_blank">Tailwind</a>,
				<a href="https://daisyui.com" class="link font-bold" target="_blank">DaisyUI</a>
			</div>
			<button
				class="btn btn-primary mt-8 lg:mt-0 py-4 px-8 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 active:scale-95"
			>
				Get started!
			</button>
		</div>

		<div class="min-h-[60vh]">
			<div class="pt-20 pb-8 px-7">
				<div class="max-w-lg mx-auto text-center">
					<div
						class="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
					>
						Explore the Features
					</div>
					<div class="mt-6 text-xl font-bold">
						And try them on this
						<span class="underline decoration-secondary decoration-[3px] md:decoration-[4px]">
							fully functional demo
						</span>
					</div>
				</div>
				<div class="flex gap-6 mt-12 max-w-[1064px] mx-auto place-content-center flex-wrap">
					{#each features as feature}
						<div class="card w-[270px] min-h-[300px] flex-none shadow-xl">
							<div class="card-body items-center text-center p-[24px] pt-[32px]">
								<div>
									<svg
										width="50px"
										height="50px"
										class="mb-2 mt-1"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html feature.svgContent}
									</svg>
								</div>
								<h2 class="card-title">
									{feature.name}
								</h2>
								<p class="text-sm">
									{feature.description}
								</p>
								{#if feature.link}
									<a href={feature.link} class="pb-4" target={feature.newPage ? '_blank' : ''}>
										<button class="btn btn-xs btn-outline rounded-full btn-primary min-w-[100px]"
											>{feature.linkText ? feature.linkText : 'Try It'}</button
										>
									</a>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
