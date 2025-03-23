import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { v4 as random } from "uuid";
import { StatusCodes } from "http-status-codes";

// Initialize router
const router = Router();

// ✅ DELETE /user/:id (Delete a user by ID)
router.delete("/user/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const userRepository: Repository<User> = AppDataSource.getRepository(User);
        const { id } = req.params;

        // Convert id to a number
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        // ✅ Find the user
        const user = await userRepository.findOne({ where: { id: userId.toString() } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // ✅ Delete the user
        await userRepository.remove(user);
        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// ✅ POST /register (Create a new user)
router.post("/register", async (req: Request, res: Response) => {
    try {
        const userRepository: Repository<User> = AppDataSource.getRepository(User);
        const id = random();
        const { email, password, title, firstname, lastname, role } = req.body;

        if (!email || !password || !title || !firstname || !lastname || role === undefined) {
            res.status(StatusCodes.BAD_REQUEST).send("Please provide all required fields");
            return;
        }

        const userExists = await userRepository.findOne({ where: { email } });
        if (userExists) {
            res.status(StatusCodes.BAD_REQUEST).send("Email already exists");
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User();
        newUser.id = id;
        newUser.email = email;
        newUser.password = hashedPassword;
        newUser.title = title;
        newUser.firstname = firstname;
        newUser.lastname = lastname;
        newUser.role = role;

        await userRepository.save(newUser);
        res.status(StatusCodes.CREATED).send("User created successfully");
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});

// Export the router with both DELETE and POST routes
export default router;
