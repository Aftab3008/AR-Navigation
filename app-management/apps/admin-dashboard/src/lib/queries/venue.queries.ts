"use server";

import { db } from "@/db";
import { venues } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getVenues() {
  try {
    return await db.select().from(venues).orderBy(desc(venues.createdAt));
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw new Error("Failed to fetch venues");
  }
}

export async function getVenueById(id: string) {
  try {
    const [venue] = await db.select().from(venues).where(eq(venues.id, id));
    return venue;
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    throw new Error("Failed to fetch venue");
  }
}
