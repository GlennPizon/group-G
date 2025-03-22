import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { deleteUser } from "./controllers/user.controller";

dotenv.config();
const app = express();

// ✅ Ensure port is a valid number
const port = Number(process.env.APP_PORT) || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());

app.delete("/user/:id", deleteUser);

async function start() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database connected successfully!");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

    } catch (error) {
        console.error("❌ Error initializing database:", error);
    }
}

start();
