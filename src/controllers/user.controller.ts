import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Repository connection
const repo: Repository<User> = AppDataSource.getRepository(User);
const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password, title, firstname, lastname, role } = req.body;

        if (!email || !password || !title || !firstname || !lastname || typeof role !== 'string') {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please provide all required fields' });
        }

        const existingUser = await repo.findOne({ where: { email } });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = repo.create({
            email,
            password: hashedPassword,
            title,
            firstname,
            lastname,
            role,
        });

        await repo.save(newUser);
        return res.status(StatusCodes.CREATED).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
});

    router.post('/login', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email and password are required' });
        }

        const user = await repo.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });

        return res.status(StatusCodes.OK).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
});

router.post('/logout', async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(StatusCodes.OK).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
});

// Export the router
export default router;
