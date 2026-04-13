"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api";
import { FloorFormValues, floorSchema } from "../schema/zod.schema";

export async function createFloor(venueId: string, data: FloorFormValues) {
  try {
    const parsedData = floorSchema.parse(data);

    const res = await apiClient.post(`/venues/${venueId}/floors`, {
      name: parsedData.name,
      levelNumber: parsedData.levelNumber,
    });

    const newFloor = res.data;

    if (parsedData.bundle && parsedData.bundle.size > 0) {
      const uploadData = new FormData();
      uploadData.append("bundle", parsedData.bundle);

      try {
        await apiClient.post(
          `/venues/floors/${newFloor.id}/upload`,
          uploadData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } catch (uploadError) {
        console.warn("Floor created but asset upload failed", uploadError);
      }
    }

    revalidatePath(`/venues/${venueId}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating floor", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
