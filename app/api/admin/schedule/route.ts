import { NextRequest, NextResponse } from "next/server";
import { StaffService } from "@/services/StaffService";
import { createTimeSlotsSchema } from "@/lib/validators";

const staffService = new StaffService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createTimeSlotsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await staffService.generateTimeSlots(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate time slots" },
      { status: 500 }
    );
  }
}
