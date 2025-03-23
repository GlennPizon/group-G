import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import "reflect-metadata";

AppDataSource.initialize()
    .then(async () => {
        console.log("Database connection established!");

        console.log("Inserting a new user into the database...");
        const user = new User();
        user.email = "timber@example.com";
        user.password = "hashedpassword";
        user.title = "Mr.";
        user.firstname = "Timber";
        user.lastname = "Saw";
        user.age = 25;
        user.role = "user";

        await AppDataSource.manager.save(user);
        console.log("Saved a new user with id:", user.id);

        console.log("Loading users from the database...");
        const users = await AppDataSource.manager.find(User);
        console.log("Loaded users: ", users);

        console.log("here you can setup and run Express / Fastify / any other framework.");
    })
    .catch((error) => console.log("Error:", error));
