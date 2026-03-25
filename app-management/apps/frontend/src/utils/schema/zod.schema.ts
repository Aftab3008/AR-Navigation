import z from "zod";

export const floorSchema = z.object({
  levelNumber: z.number({
    error: "Level number is required",
  }),
  name: z.string().min(1, "Name is required"),
  bundle: z.instanceof(File).optional(),
});

export const poiSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum([
    "room",
    "restroom",
    "elevator",
    "stairs",
    "exit",
    "facility",
    "other",
  ]),
  x: z.number({ error: "Enter a valid number" }),
  y: z.number({ error: "Enter a valid number" }),
  z: z.number({ error: "Enter a valid number" }),
});

export const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  lat: z.number({ error: "Enter a valid number" }),
  lng: z.number({ error: "Enter a valid number" }),
});

export type VenueFormValues = z.infer<typeof venueSchema>;
export type PoiFormValues = z.infer<typeof poiSchema>;
export type FloorFormValues = z.infer<typeof floorSchema>;

