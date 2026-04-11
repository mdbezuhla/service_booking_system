import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PaymentService } from "@/services/PaymentService";

const paymentService = new PaymentService();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, bookingId } = await req.json();

    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: "Missing amount or bookingId" },
        { status: 400 }
      );
    }

    const result = await paymentService.createPaymentIntent(amount, bookingId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
