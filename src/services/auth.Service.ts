import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';




export class AuthService {
    static async login(email: string, password: string) {
        const userRepository: Repository<User> = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id, email: user.email }, "your_secret_key", { expiresIn: "1h" });

        return { message: "Login successful", token };
    }

    static async logout() {
        return { message: "Logout successful" };
    }
}
