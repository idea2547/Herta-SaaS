<script lang="ts">
	import { pricingPlans } from './pricing_plans';
	import { goto } from '$app/navigation';

	
	async function checkout(price_id: string) {
		let res;
		res = await fetch('/api/stripe/checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				items: [{ id: price_id, quantity: 1 }],
				mode: 'payment'
			})
		});
		if (res?.status == 401) {
			goto('/register');
		}
		const url = await res.json();
		if (url?.url?.includes('https://')) {
			console.log(url);
			window.open(url.url, '_blank');
		} else {
			goto(url.url);
		}
	}

	// Module context
	export let datas;
	export let highlightedPlanId: string = '';
	export let callToAction: string;
	export let currentPlanId: string = '';
	export let center = true;

	let packages = JSON.parse(datas?.packages).sort((a, b) => {
		if (a.name === "LifeTime") return -1;
		if (b.name === "LifeTime") return 1;
		if (a.price_monthly === 0) return 1;
		if (b.price_monthly === 0) return -1;
		if (a.price_monthly === -5) return 1;
		if (b.price_monthly === -5) return -1;
		return a.price_monthly - b.price_monthly;
	});
</script>

<div class="flex flex-col lg:flex-row gap-10 {center ? 'place-content-center' : ''} flex-wrap">
	{#each packages as plan}
		<div
			class="flex-none card card-bordered {plan.name === highlightedPlanId
				? 'border-primary'
				: 'border-gray-200'} shadow-xl flex-1 flex-grow min-w-[260px] max-w-[310px] p-6"
		>
			<div class="flex flex-col h-full">
				<div class="text-xl font-bold">{plan.name}</div>
				<p class="mt-2 text-sm text-gray-500 leading-relaxed">
					{@html plan.description}
				</p>
				<div class="mt-auto pt-4 text-sm text-gray-600">
					Plan Includes:
					{@html plan.features}
				</div>
				<div class="pt-8">
					<span class="text-4xl font-bold">{plan.currency}{plan.price}</span>
					<span class="text-gray-400">{plan.priceIntervalName}</span>
					<div class="mt-6 pt-4 flex-1 flex flex-row items-center">
						<!-- {#if plan.id === currentPlanId}
							<div class="btn btn-outline btn-success no-animation w-[80%] mx-auto cursor-default">
								Current Plan
							</div>
						{:else} -->
							<button
								on:click={async (e) => {
									e.preventDefault();
									await checkout(plan?.price_id ?? 'free_plan');
								}}
								class="btn btn-primary w-[80%] mx-auto"
							>
								{callToAction}
							</button>
						<!-- {/if} -->
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
