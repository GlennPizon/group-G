import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config();
let dbname = "node_orm_crud";
let connection;

const dbhost = process.env.DB_HOST;
const dbpassword = process.env.DB_PASSWORD;
const dbusername = process.env.DB_USERNAME;
const dbport = parseInt(process.env.DB_PORT as string, 10);


export const AppDataSource = new DataSource({
    type: "mysql",
    host: dbhost,
    port: dbport,
    username: dbusername,
    password: dbpassword,
    database: dbname,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})

const connectionOptions = {
    host: dbhost,
    port: dbport,
    user: dbusername,
    password: dbpassword
}


async function checkDBexists(dbname): Promise<boolean> {
    const [rows] = await connection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbname}'`
        );
    return rows.length > 0;
}

async function CreateDB() {
    try{
        if(await checkDBexists(dbname)){
            console.log("Database already exists");
            return;
        }

        await connection.query(`CREATE DATABASE ${dbname}`);
        console.log(`Database ${dbname} created successfully`);
    }
    catch (error) {
        console.error("Error creating database: ", error);
    }
}


export const initialize = async () => {
    try{
        connection = await mysql.createConnection(connectionOptions);
        await CreateDB();
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
    }
    catch(error){
        console.error(error);
    }
    

}

export default initialize;

