import { Request, Response } from "express";
import {
  createFloorSchema,
  createPoiSchema,
  createVenueSchema,
} from "../validations/venue.schema.js";
import { venueService } from "../services/venue.service.js";

export class VenueController {
  async getVenues(req: Request, res: Response) {
    try {
      const venues = await venueService.getAllVenues();
      res.json(venues);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch venues" });
    }
  }

  async createVenue(req: Request, res: Response) {
    try {
      const parsedData = createVenueSchema.parse(req.body);
      const newVenue = await venueService.createVenue(parsedData);
      res.status(201).json(newVenue);
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ errors: error.errors });
      res.status(500).json({ error: "Failed to create venue" });
    }
  }

  async getVenueFloors(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const floors = await venueService.getFloorsByVenue(id);
      res.json(floors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch floors" });
    }
  }

  async createFloor(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const parsedData = createFloorSchema.parse(req.body);

      const newFloor = await venueService.createFloor({
        venueId: id,
        ...parsedData,
      });
      res.status(201).json(newFloor);
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ errors: error.errors });
      res.status(500).json({ error: "Failed to create floor" });
    }
  }

  async uploadFloorAsset(req: Request, res: Response) {
    try {
      const { floorId } = req.params as { floorId: string };

      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const fileUrl = `/uploads/bundles/${req.file.filename}`;
      const updatedFloor = await venueService.updateFloorAssetUrl(
        floorId,
        fileUrl,
      );

      res.status(200).json(updatedFloor);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload asset url" });
    }
  }

  async getFloorPOIs(req: Request, res: Response) {
    try {
      const { floorId } = req.params as { floorId: string };
      const pois = await venueService.getPoisByFloor(floorId);
      res.json(pois);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch POIs" });
    }
  }

  async createPOI(req: Request, res: Response) {
    try {
      const { floorId } = req.params as { floorId: string };
      const parsedData = createPoiSchema.parse(req.body);

      const newPoi = await venueService.createPoi({
        floorId,
        ...parsedData,
      });
      res.status(201).json(newPoi);
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ errors: error.errors });
      res.status(500).json({ error: "Failed to create POI" });
    }
  }
}

export const venueController = new VenueController();
