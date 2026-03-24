import { z } from "zod";

export const createVenueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export const createFloorSchema = z.object({
  levelNumber: z.number(),
  name: z.string().min(1, "Floor name is required"),
});

export const createPoiSchema = z.object({
  name: z.string().min(1, "POI Name is required"),
  category: z.string().min(1, "Category is required"),
  x: z.number(),
  y: z.number(),
  z: z.number(),
});
