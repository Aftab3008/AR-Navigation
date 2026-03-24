import { pgTable, varchar, timestamp, doublePrecision, integer, uuid } from "drizzle-orm/pg-core";

export const venues = pgTable("venues", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const floors = pgTable("floors", {
  id: uuid("id").primaryKey().defaultRandom(),
  venueId: uuid("venue_id").references(() => venues.id, { onDelete: 'cascade' }).notNull(),
  levelNumber: integer("level_number").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  assetBundleUrl: varchar("asset_bundle_url", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pois = pgTable("pois", {
  id: uuid("id").primaryKey().defaultRandom(),
  floorId: uuid("floor_id").references(() => floors.id, { onDelete: 'cascade' }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  x: doublePrecision("x").notNull(),
  y: doublePrecision("y").notNull(),
  z: doublePrecision("z").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
