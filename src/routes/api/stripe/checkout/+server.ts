import type { RequestHandler } from "./$types";
import { error, redirect } from '@sveltejs/kit';
import Stripe from 'stripe';

const SECRET_STRIPE_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;
const baseURL = import.meta.env.VITE_BASE_URL
const stripe = new Stripe(SECRET_STRIPE_KEY);

// POST /stripeCheckout data: items
// return -> url created by Stripe for our user to use

export const POST: RequestHandler = async ({ locals, request, cookies }) => {
    
    /* if (!locals.user.id) {
        console.log("Failed")
		throw redirect(303, '/login');
	} */


    
    const data = await request.json();
    const items = data.items;
    const userId = "123";
    
    /*
        we have: [ { id: "1", quantity: 6 }, { id: "2", quantity: 3 } ]
        stripe wants: [ { price: "1", quantity: 6 }, { price: "2", quantity: 3 } ]
    */

    let lineItems : any = [];
    items.forEach((item: any) => {
        lineItems.push( { price: item.id, quantity: item.quantity } )
    });

    // It gives us a URL for the person to check out with
    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        metadata: {
            user_id: userId,
        },
        success_url: `${baseURL}/success`,
        cancel_url: `${baseURL}/cancel`,
    });
    return new Response(
        JSON.stringify({ url: session.url }), // frontend will get this url to redirect
        {
            status: 200,
            headers: { 'content-type': 'application/json'}
        }
    )
}