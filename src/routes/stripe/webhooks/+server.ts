import { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import Stripe from 'stripe';
import { createAdminClient } from '$lib/pocketbase';
import { custom } from 'zod';



const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
const endpointSecret = import.meta.env.VITE_STRIPE_WEBHOOK_KEY; //test endpoint
const stripe = new Stripe(stripeSecretKey, {
	apiVersion: "2023-08-16",
  });



if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}
//export const POST = async ({ locals, request, cookies }) => {
// endpoint to handle incoming webhooks

export async function POST({ request, response }) {
	const signature = await request.headers.get("stripe-signature");
	// extract body
	// const body = await request.text()
	//const record = serializeNonPOJOs(await locals.pb.collection('users').getOne(locals.user.id));
	const Subscription = 1;
	// var to hold event data
	let event
  
	// verify it
	try {
		const payload = await request.text();
	  	event = await stripe.webhooks.constructEventAsync(payload , signature, endpointSecret)
	} catch (err) {
	  // signature is invalid!
	  console.warn('⚠️  Webhook signature verification failed.', err.message)
  
	  // return, because it's a bad request
	  return json({ status: 'error', updateStatus: 'Failed', messages: err })
	}

    const adminClient = await createAdminClient();


	/* Signature has been verified, so we can process events
	 * 
	 * Review important events for Billing webhooks:
	 * https://stripe.com/docs/billing/webhooks
	 */
	switch (event.type) {
		case 'checkout.session.completed':
			const session = event.data.object;
			const items = await new Promise((resolve, reject) => {
				stripe.checkout.sessions.listLineItems(
				  session.id,
				  { limit: 1 },
				  (err, lineItems) => {
					if(err) {
					  return reject(err);
					}
					resolve(lineItems)
				  }
				)
			  })
			// items.data[0].price get List item price
			// items.data[0].price.id  get stripe Price ID		
        	// Access metadata
        	const userId = session.metadata.user_id;
			const priceId = items.data[0].price.id

			if(priceId === "price_1Ou9nhIkcMoCTGo1iiJOGJGS"){ //Enter PriceID
				console.log("Success")
				const record = await adminClient.collection('users').getOne(userId)
				const Subscription = record.Subscription + 1 //record.Tokens
				await adminClient.collection('users').update( userId, { Subscription }); // Update Subscription Stuff
			} else {
                console.log("Fail")
			}
			
			
			/* await locals.pb.collection('users').update(locals.user.id, { Subscription }); */
			// await locals.pb.collection('users').update(locals.user.id, { Token });
			// Then define and call a function to handle the event payment_intent.succeeded
			break;
		case 'customer.subscription.created':
			// Subscription was created
			console.log('pass');
			break
		case 'customer.subscription.updated':
			// Subscription has been changed
			break
		case 'invoice.paid':
			// Used to provision services after the trial has ended.
			// The status of the invoice will show up as paid. Store the status in your
			// database to reference when a user accesses your service to avoid hitting rate limits.
			break
		case 'invoice.payment_failed':
			// If the payment fails or the customer does not have a valid payment method,
			//  an invoice.payment_failed event is sent, the subscription becomes past_due.
			// Use this webhook to notify your user that their payment has
			// failed and to retrieve new card details.
			break
		case 'customer.subscription.deleted':
			if (event.request != null) {
			// handle a subscription canceled by your request
			// from above.
			} else {
			// handle subscription canceled automatically based
			// upon your subscription settings.
			}
			break
	  default:
	  // Unexpected event type
	}
  
	// return a 200 with an empty JSON response
	return json({ status: 'success', updateStatus: 'updated' })
}
  