"use server";

import { db } from "@/db";
import { floors } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getFloorsByVenue(venueId: string) {
  try {
    return await db
      .select()
      .from(floors)
      .where(eq(floors.venueId, venueId))
      .orderBy(asc(floors.levelNumber));
  } catch (error) {
    console.error(`Error fetching floors for venue ${venueId}:`, error);
    throw new Error("Failed to fetch floors");
  }
}

export async function getFloorById(id: string) {
  try {
    const [floor] = await db.select().from(floors).where(eq(floors.id, id));
    return floor;
  } catch (error) {
    console.error(`Error fetching floor ${id}:`, error);
    throw new Error("Failed to fetch floor");
  }
}
