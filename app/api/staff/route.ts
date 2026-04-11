import { NextRequest, NextResponse } from "next/server";
import { StaffService } from "@/services/StaffService";

const staffService = new StaffService();

export async function GET() {
  try {
    const staff = await staffService.getAllStaff();
    return NextResponse.json(staff);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const staff = await staffService.createStaff(body);
    return NextResponse.json(staff, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create staff" },
      { status: 500 }
    );
  }
}
