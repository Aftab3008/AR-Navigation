import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pois } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const createPoiSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { floorId: string } },
) {
  try {
    const { floorId } = await params;
    const floorPois = await db
      .select()
      .from(pois)
      .where(eq(pois.floorId, floorId));
    return NextResponse.json(floorPois);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch POIs" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { floorId: string } },
) {
  try {
    const { floorId } = await params;
    const body = await req.json();
    const parsedData = createPoiSchema.parse(body);

    const [newPoi] = await db
      .insert(pois)
      .values({
        floorId,
        ...parsedData,
      })
      .returning();

    return NextResponse.json(newPoi, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create POI" },
      { status: 500 },
    );
  }
}
