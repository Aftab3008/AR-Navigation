import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { floors } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const createFloorSchema = z.object({
  levelNumber: z.number().int(),
  name: z.string().min(1),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const venueFloors = await db
      .select()
      .from(floors)
      .where(eq(floors.venueId, id));
    return NextResponse.json(venueFloors);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch floors" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsedData = createFloorSchema.parse(body);

    const [newFloor] = await db
      .insert(floors)
      .values({
        venueId: id,
        ...parsedData,
      })
      .returning();

    return NextResponse.json(newFloor, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create floor" },
      { status: 500 },
    );
  }
}
