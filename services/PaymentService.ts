import { stripe } from "@/lib/stripe";

export class PaymentService {
  async createPaymentIntent(amount: number, bookingId: string) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "eur",
      metadata: { bookingId },
      automatic_payment_methods: { enabled: true },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  }

  async refundPayment(paymentIntentId: string) {
    return stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
  }

  constructWebhookEvent(body: string, signature: string) {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  }
}
