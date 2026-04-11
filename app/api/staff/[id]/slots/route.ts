import { NextRequest, NextResponse } from "next/server";
import { StaffService } from "@/services/StaffService";

const staffService = new StaffService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || undefined;
    const slots = await staffService.getAvailableSlots(id, date);
    return NextResponse.json(slots);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
