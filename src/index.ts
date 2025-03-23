import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import userRoutes from "./controllers/user.routes"; // Import user routes

dotenv.config();
const app = express();
const port = Number(process.env.APP_PORT) || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api", userRoutes); // Prefixing routes to avoid conflicts

// Start server
AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((error) => console.log("Database connection error:", error));
