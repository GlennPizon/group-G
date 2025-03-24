import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import initialize, { AppDataSource } from "./data-source";
import userRoutes from "./controllers/user.controller"; // Import user routes

dotenv.config();
const app = express();
const port = Number(process.env.APP_PORT) || 3000;



start();

async function start(){
    try{
         // Middleware
        app.use(express.json());
        app.use(cors());
        app.use(helmet());

        // Routes
        app.use("/", userRoutes); 
        app.use("/login", userRoutes); // Registers POST route
        app.use("/users", userRoutes); // Registers GET route
        app.get("/register", userRoutes); // Registers GET route
        app.delete("/user/:id", userRoutes); // Registers DELETE route
        await initialize();
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    }catch(error){
        console.error("Database connection error:", error);
    }

}