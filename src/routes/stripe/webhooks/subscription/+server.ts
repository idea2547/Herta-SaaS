import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { createAdminClient } from '$lib/pocketbase';

const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
const endpointSecret = import.meta.env.VITE_STRIPE_WEBHOOK_KEY; // test endpoint secret
const stripe = new Stripe(stripeSecretKey, {
	apiVersion: '2022-11-15'
});

if (!stripeSecretKey) {
	throw new Error('STRIPE_SECRET_KEY is not set');
}

export async function POST({ request }: any) {

	const signature = await request.headers.get('stripe-signature');


	let event;

	try {
		const adminClient = await createAdminClient();
		const payload = await request.text();
		event = await stripe.webhooks.constructEventAsync(payload , signature, endpointSecret)
		const data = event.data.object;
		const eventType = event.type;
		

		console.log(data)

		if (eventType === 'invoice.payment_succeeded') {
			const subscription = await stripe.subscriptions.retrieve(data.subscription);
			console.log("SUB DATA", subscription.items.data[0].price.id)
			const user_id = subscription.metadata.user_id;
			const invite_code = subscription.metadata.invite_code;
			if (!user_id) return json({ message: "Webhook Error: User ID not found" }, { status: 400 });

			const pb_package = await adminClient.collection('packages').getFirstListItem(`price_id_monthly = "${subscription.items.data[0].price.id}" || price_id_yearly = "${subscription.items.data[0].price.id}"`);

			const pb_sub = await adminClient.collection('subscriptions').getFirstListItem(`subscription_id = "${subscription.id}"`).catch(() => null);


			const filterText_affiliate =`invite_code = "${invite_code}" && status = "active"`;

			console.log("user afff", filterText_affiliate)
			
			const user_affiliate = await adminClient.collection('affiliate').getFirstListItem(filterText_affiliate
			).then((res) => {
				return res;
			}).catch((err) => {
				console.log(err);
				return null;
			});

			console.log("user afff", user_affiliate)

			if (!pb_sub) {
				await adminClient.collection('subscriptions').create({
					user: user_id,
					package: pb_package.id,
					subscription_id: subscription.id,
					start: new Date(subscription.current_period_start * 1000),
					end: new Date(subscription.current_period_end * 1000),
					status: 'active'
				});
			} else {
				await adminClient.collection('subscriptions').update(pb_sub.id, {
					user: user_id,
					package: pb_package.id,
					subscription_id: subscription.id,
					start: new Date(subscription.current_period_start * 1000),
					end: new Date(subscription.current_period_end * 1000),
					status: 'active'
				});
			}

			console.log("Monthly Checking", pb_package.price_id_monthly)

			await adminClient.collection('users').update(user_id, {
				TierLevel: 5
			});


			// PRODUCTION WARNING
			// PRODUCTION WARNING
			// PRODUCTION WARNING

			let monthlyMatched = false;
			if(subscription.items.data[0].price.id){
				switch (subscription.items.data[0].price.id) {
					case 'price_1PcAGuBJEdnjfwnoGnC2cd3F': //price_1PcAGuBJEdnjfwnoGnC2cd3F
						await adminClient.collection('users').update(user_id, { 
							GenSoundMax: 20
						})
						await adminClient.collection('users').update(user_id, {
							TierLevel: 0
						});					
						monthlyMatched = true;
						break;
					case 'price_1PXfikBJEdnjfwnouaIbwBr1': //price_1PXfikBJEdnjfwnouaIbwBr1
						monthlyMatched = true;
						break;
					case 'price_1PWrB5BJEdnjfwnoMXUdTt3G': //price_1PWrB5BJEdnjfwnoMXUdTt3G
						monthlyMatched = true;
						break;
					case 'price_1PWrBCBJEdnjfwnodqtXTY1M': //price_1PWrBCBJEdnjfwnodqtXTY1M
						monthlyMatched = true;
						break;
					default:
						break;
				}

				if (!monthlyMatched) {
					switch (subscription.items.data[0].price.id) {
						case 'price_1PcAI0BJEdnjfwnoZ422ksei': //price_1PcAI0BJEdnjfwnoZ422ksei
							break;
						case 'price_1PXfikBJEdnjfwnoqeOroecN': //price_1PXfikBJEdnjfwnoqeOroecN
							break;
						case 'price_1PWrB5BJEdnjfwnoGgtHHR2U': //price_1PWrB5BJEdnjfwnoGgtHHR2U
							break;
						case 'price_1PWrBCBJEdnjfwnocWxCT9JO': //price_1PWrBCBJEdnjfwnocWxCT9JO
							break;
						default:
							break;
					}
				}

			}
				

			

			if (data.billing_reason === 'subscription_create') {
				/* 			const XTokens = parseInt(record.XTokens) + parseInt(pb_package.token_per_month) */
				
				// Update TierLevel for Unlimited Generation Paid Plan
				await adminClient.collection('users').update(user_id, {
					TierLevel: 5
				});

				// Check which plan is paid		
				
				return json({
					message: "Create Subscription Success",
					subscription: subscription,
					package: pb_package
				});
			} else {
				return json({
					message: "Renewal Subscription Success",
					subscription: subscription,
					package: pb_package
				});
			}
		}

		/* if (eventType === 'customer.subscription.updated') {

			const subscription = await stripe.subscriptions.retrieve(data.subscription);
			const user_id = subscription.metadata.user_id;
			if (!user_id) return json({ message: "Webhook Error: User ID not found" }, { status: 400 });

			const pb_package = await adminClient.collection('packages').getFirstListItem(`price_id_monthly = "${subscription.items.data[0].price.id}" || price_id_yearly = "${subscription.items.data[0].price.id}"`);

			const record = await adminClient.collection('users').getOne(user_id);
			console.log("Record token", record.XTokens)
			console.log("Record token", pb_package.token_per_month)
			const XTokens = parseInt(record.XTokens) + parseInt(pb_package.token_per_month)
			await adminClient.collection('users').update(user_id, {
				XTokens
			});
			return json({
				message: "Update Subscription Success",
				subscription: subscription,
				package: pb_package
			});
		} 

 */
		

		if (eventType === 'customer.subscription.deleted') {
			const subscription = await stripe.subscriptions.retrieve(data.id);
			const user_id = subscription.metadata.user_id;
			if (!user_id) return json({ message: "Webhook Error: User ID not found" }, { status: 400 });

			const pb_sub = await adminClient.collection('subscriptions').getFirstListItem(`subscription_id = "${subscription.id}"`).catch(() => null);
			if (pb_sub) {
				await adminClient.collection('subscriptions').update(pb_sub.id, {
					status: 'cancelled'
				});
				await adminClient.collection('users').update(user_id, {
					TierLevel: 0
				});
			}
			return json({ message: "Subscription cancelled successfully" });
		}

		return json({ message: "Webhook event received" });
	} catch (err: any) {
		console.error(err.message);
		return json({ message: err.message }, { status: 400 });
	}
}