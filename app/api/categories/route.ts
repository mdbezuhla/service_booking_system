import { NextRequest, NextResponse } from "next/server";
import { ServiceService } from "@/services/ServiceService";

const serviceService = new ServiceService();

export async function GET() {
  try {
    const categories = await serviceService.getAllCategories();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category = await serviceService.createCategory(body);
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
