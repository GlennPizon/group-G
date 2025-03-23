import { Router } from "express";
import { createUser, deleteUser } from "./user.controller";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const router = Router();

// ✅ Add this new route to fetch all users
router.get("/users", async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

router.post("/register", createUser); // Change from "/user" to "/register"
router.delete("/user/:id", deleteUser); // Keep DELETE as is

export default router;
