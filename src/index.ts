import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import initialize, { AppDataSource} from "./data-source";
import userRoutes from "./controllers/user.routes"; // Import user routes

dotenv.config();
const app = express();
const port = Number(process.env.APP_PORT);

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use("/", userRoutes); // Registers both DELETE and POST routes
app.use("/login", userRoutes); // Registers POST route
app.use("/users", userRoutes); // Registers GET route
app.get("/register", userRoutes); // Registers GET route
app.delete("/user/:id", userRoutes); // Registers DELETE route

// ✅ Initialize the application
start();

// ✅ Start the server
    async function start(){
        try {
            await initialize();
            app.listen(port, () => {
                console.log(`Server running at http://localhost:${port}`);
            });
        } catch (error) {
            console.error("Server error:", error);
        }
    }
