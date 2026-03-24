import { eq } from "drizzle-orm";
import db from "../db/db.js";
import { floors, pois, venues } from "../db/schema.js";

export class VenueService {
  async getAllVenues() {
    return await db.select().from(venues);
  }

  async createVenue(data: {
    name: string;
    description?: string;
    latitude: number;
    longitude: number;
  }) {
    const [venue] = await db.insert(venues).values(data).returning();
    return venue;
  }

  async getFloorsByVenue(venueId: string) {
    return await db.select().from(floors).where(eq(floors.venueId, venueId));
  }

  async createFloor(data: {
    venueId: string;
    levelNumber: number;
    name: string;
  }) {
    const [floor] = await db.insert(floors).values(data).returning();
    return floor;
  }

  async updateFloorAssetUrl(floorId: string, url: string) {
    const [floor] = await db
      .update(floors)
      .set({ assetBundleUrl: url })
      .where(eq(floors.id, floorId))
      .returning();
    return floor;
  }

  async getPoisByFloor(floorId: string) {
    return await db.select().from(pois).where(eq(pois.floorId, floorId));
  }

  async createPoi(data: {
    floorId: string;
    name: string;
    category: string;
    x: number;
    y: number;
    z: number;
  }) {
    const [poi] = await db.insert(pois).values(data).returning();
    return poi;
  }
}

export const venueService = new VenueService();
