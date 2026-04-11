import { NextRequest, NextResponse } from "next/server";
import { ServiceService } from "@/services/ServiceService";

const serviceService = new ServiceService();

export async function GET() {
  try {
    const services = await serviceService.getAllServices();
    return NextResponse.json(services);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = await serviceService.createService(body);
    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
