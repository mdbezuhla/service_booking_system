import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { BookingService } from "@/services/BookingService";
import { createBookingSchema } from "@/lib/validators";

const bookingService = new BookingService();

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await bookingService.getUserBookings(session.user.id);
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const booking = await bookingService.createBooking({
      userId: session.user.id,
      serviceId: parsed.data.serviceId,
      staffId: parsed.data.staffId,
      slotId: parsed.data.slotId,
      totalPrice: body.totalPrice,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "SLOT_UNAVAILABLE") {
      return NextResponse.json(
        { error: "This time slot is no longer available" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
