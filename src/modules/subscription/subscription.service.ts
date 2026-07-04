import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"

const createCheckoutSessionIntoDB = async (userId: string) => {
    const transectionResult = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }
        })

        let stripeCustomerId = user.subscription?.stripeCustomerId

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            })

            stripeCustomerId = customer.id
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: "price_1TojrBP1zo7ZJ7qZt0unDhrt",
                    quantity: 1
                }
            ],
            mode: "subscription",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.app_url}/premium?success=true`,
            cancel_url: `${config.app_url}/payment/success=false`,
            metadata: { userId: user.id }
        })

        return session.url
    })

    return {
        paymentUrl: transectionResult
    }
}

const handleWebhookFromStripe = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.stripe_webhook_secret

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    );

    switch (event.type) {
        case 'checkout.session.completed':
            // const paymentObject = event.data.object;

            break;
        case 'customer.subscription.updated':
            // const paymentObject = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        case 'customer.subscription.deleted':
            break
        default:
            // Unexpected event type
            console.log(`No event match. Unhandled event type ${event.type}.`);
            break
    }
}

export const subscriptionService = {
    createCheckoutSessionIntoDB, handleWebhookFromStripe
}