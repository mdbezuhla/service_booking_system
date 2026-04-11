import { NextRequest, NextResponse } from "next/server";
import { StaffService } from "@/services/StaffService";

const staffService = new StaffService();

export async function POST(req: NextRequest) {
  try {
    const { staffId, serviceId } = await req.json();
    await staffService.assignService(staffId, serviceId);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to assign service" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { staffId, serviceId } = await req.json();
    await staffService.unassignService(staffId, serviceId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to unassign service" },
      { status: 500 }
    );
  }
}
