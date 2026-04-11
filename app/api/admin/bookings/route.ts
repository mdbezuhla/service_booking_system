import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/services/BookingService";
import type { BookingStatus } from "@/types";

const bookingService = new BookingService();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as BookingStatus | null;
    const staffId = searchParams.get("staffId") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;

    const bookings = await bookingService.getAllBookings({
      status: status || undefined,
      staffId,
      dateFrom,
      dateTo,
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
