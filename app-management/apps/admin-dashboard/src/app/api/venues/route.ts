import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { venues } from "@/db/schema";
import { z } from "zod";

const createVenueSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export async function GET() {
  try {
    const allVenues = await db.select().from(venues);
    return NextResponse.json(allVenues);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = createVenueSchema.parse(body);

    const [newVenue] = await db.insert(venues).values(parsedData).returning();

    return NextResponse.json(newVenue, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create venue" },
      { status: 500 },
    );
  }
}
