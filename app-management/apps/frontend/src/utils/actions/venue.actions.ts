"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api";
import { VenueFormValues, venueSchema } from "../schema/zod.schema";

export async function createVenue(data: VenueFormValues) {
  try {
    const parsedData = venueSchema.parse(data);

    await apiClient.post("/venues", {
      name: parsedData.name,
      description: parsedData.description,
      latitude: parsedData.lat,
      longitude: parsedData.lng,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create venue:", error);
    return { success: false, error: error.message };
  }
}
