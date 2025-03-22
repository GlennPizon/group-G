import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import initialize from "./data-source"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import router from "./controllers/user.controller"

const app = express();
dotenv.config();
const port = parseInt(process.env.APP_PORT as string, 10);


async function start(){ 
    try{
        await initialize();
        app.use(express.json());
        app.use(cors());
        app.use(helmet());
        app.use('/', router); //
        app.use('/register', router); //Register a new user
        app.listen(
                port, () =>{
                    console.log(`Server is running on port hhtp://localhost:${port}`);
                }
        );
    }catch(error){
        console.log(error);
    }
}

start()