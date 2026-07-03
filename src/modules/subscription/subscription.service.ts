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

export const subscriptionService = {
    createCheckoutSessionIntoDB
}