import { NextResponse } from "next/server";
import { BookingService } from "@/services/BookingService";

const bookingService = new BookingService();

export async function GET() {
  try {
    const stats = await bookingService.getAdminStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
