import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/auth.Service';
import { User, Role } from '../entity/User';
import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as random } from 'uuid';

dotenv.config();

const userRouter = Router();
const repo: Repository<User> = AppDataSource.getRepository(User);

// ✅ Register a new user
userRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const id = random();
        const { email, password, title, firstname, lastname, role } = req.body;

        if (!email || !password || !title || !firstname || !lastname || typeof role !== 'string') {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please provide all required fields' });
        }

        const existingUser = await repo.findOne({ where: { email } });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // ✅ Ensure `role` is valid
        const roleValue = Object.values(Role).includes(role as Role) ? (role as Role) : Role.User;

        const newUser = repo.create({
            id,
            email,
            password: hashedPassword,
            title,
            firstname,
            lastname,
            role: roleValue
        });

        
        await repo.save(newUser);
        return res.status(StatusCodes.CREATED).json({ message: 'User created successfully', userId: id });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
});

// ✅ Login user using AuthService
userRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const response = await AuthService.login(email, password);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
});

// Delete User Function
userRouter.delete("/users/:id", async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;
        const userId = parseInt(id, 10);

        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        const user = await userRepository.findOne({ where: {id} });
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

// ✅ Logout user using AuthService
userRouter.post('/logout', async (req: Request, res: Response) => {
    try {
        const response = await AuthService.logout();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
});

// ✅ Fetch all users
userRouter.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await repo.find();
        return res.status(StatusCodes.OK).json(users);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
});

export default userRouter;