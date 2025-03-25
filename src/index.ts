import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import initialize, { AppDataSource} from "./data-source";
import userRoutes from "./controllers/user.routes"; // Import user routes

dotenv.config();
const app = express();
const port = Number(process.env.APP_PORT);



start();

async function start(){
    try{
         // Middleware
        app.use(express.json());
        app.use(cors());
        app.use(helmet());

        // Routes
        app.use("/", userRoutes); 
        app.post("/login", userRoutes); // Registers POST route
        app.get("/users", userRoutes); // Registers GET route
        app.get("/user/:id", userRoutes); // Registers GET by ID route
        app.post("/register", userRoutes); // Registers GET route
        app.put("/user/:id", userRoutes); // Registers PUT by ID route
        app.delete("/user/:id", userRoutes); // Registers DELETE by ID route
        await initialize();
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    }catch(error){
        console.error("Database connection error:", error);
    }

}
