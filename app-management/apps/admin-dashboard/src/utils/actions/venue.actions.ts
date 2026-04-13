"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { venues } from "@/db/schema";
import { VenueFormValues, venueSchema } from "../schema/zod.schema";

export async function createVenue(data: VenueFormValues) {
  try {
    const parsedData = venueSchema.parse(data);

    await db.insert(venues).values({
      name: parsedData.name,
      description: parsedData.description,
      latitude: parsedData.lat,
      longitude: parsedData.lng,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create venue:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
