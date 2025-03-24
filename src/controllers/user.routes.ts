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

// Delete User Function
router.delete("/users/:id", async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;
        const userId = parseInt(id, 10);

        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        await userRepository.remove(user);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});


export default router;
