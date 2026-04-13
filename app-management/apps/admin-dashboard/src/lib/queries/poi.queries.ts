"use server";

import { db } from "@/db";
import { pois } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPoisByFloor(floorId: string) {
  try {
    return await db.select().from(pois).where(eq(pois.floorId, floorId));
  } catch (error) {
    console.error(`Error fetching POIs for floor ${floorId}:`, error);
    throw new Error("Failed to fetch POIs");
  }
}
