import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcryptjs";


// Create User Function
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { email, password, title, firstname, lastname, role } = req.body;

        if (!email || !password || !title || !firstname || !lastname || role === undefined) {
            res.status(400).json({ message: "Please provide all required fields" });
            return;
        }

        const userExists = await userRepository.findOne({ where: { email } });
        if (userExists) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = userRepository.create({  
            email,  
            password: hashedPassword,  
            title,  
            firstname,  
            lastname,  
            role  
        });

        await userRepository.save(newUser);
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Delete User Function
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
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
};
