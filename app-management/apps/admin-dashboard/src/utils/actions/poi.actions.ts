"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api";
import { PoiFormValues, poiSchema } from "../schema/zod.schema";

export async function createPoi(
  venueId: string,
  floorId: string,
  data: PoiFormValues,
) {
  try {
    const parsedData = poiSchema.parse(data);

    await apiClient.post(`/floors/${floorId}/pois`, {
      name: parsedData.name,
      category: parsedData.category,
      x: parsedData.x,
      y: parsedData.y,
      z: parsedData.z,
    });

    revalidatePath(`/venues/${venueId}/floors/${floorId}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating POI", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
