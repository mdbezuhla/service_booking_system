import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/services/PaymentService";
import { BookingService } from "@/services/BookingService";

const paymentService = new PaymentService();
const bookingService = new BookingService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const event = paymentService.constructWebhookEvent(body, signature);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata.bookingId;

      if (bookingId) {
        await bookingService.confirmBooking(bookingId, paymentIntent.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook handling failed" },
      { status: 400 }
    );
  }
}
