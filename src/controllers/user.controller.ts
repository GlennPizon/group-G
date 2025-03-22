import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;

        // Convert id to a number
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        // Find the user (Ensure ID is a number)
        const user = await userRepository.findOne({ where: { id: userId as any } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Delete the user
        await userRepository.remove(user);
        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
