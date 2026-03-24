import z from "zod";

export const floorSchema = z.object({
  levelNumber: z.number({
    message: "Level number is required",
  }),
  name: z.string().min(1, "Name is required"),
  bundle: z.instanceof(File).optional().or(z.any().optional()),
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
  x: z.number({ message: "Must be a valid number" }),
  y: z.number({ message: "Must be a valid number" }),
  z: z.number({ message: "Must be a valid number" }),
});

export const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  lat: z.number({ message: "Must be a valid number" }),
  lng: z.number({ message: "Must be a valid number" }),
});

export type VenueFormValues = z.infer<typeof venueSchema>;
export type PoiFormValues = z.infer<typeof poiSchema>;
export type FloorFormValues = z.infer<typeof floorSchema>;
