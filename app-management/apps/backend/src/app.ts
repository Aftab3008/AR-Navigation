import express from "express";
import cors from "cors";
import path from "path";
import venueRoutes from "./routes/venue.router.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

app.use("/api/venues", venueRoutes);

export default app;
