import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { venueController } from "../controllers/venue.controller.js";

// Setup storage locally for AssetBundles
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "public/uploads/bundles");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/", venueController.getVenues);
router.post("/", venueController.createVenue);

router.get("/:id/floors", venueController.getVenueFloors);
router.post("/:id/floors", venueController.createFloor);
router.post(
  "/floors/:floorId/upload",
  upload.single("bundle"),
  venueController.uploadFloorAsset,
);

router.get("/floors/:floorId/pois", venueController.getFloorPOIs);
router.post("/floors/:floorId/pois", venueController.createPOI);

export default router;
