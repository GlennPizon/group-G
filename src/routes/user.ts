import { Router } from "express";
import { AuthService } from "../services/auth.Service";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await AuthService.login(email, password);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/logout", async (req, res) => {
    try {
        const response = await AuthService.logout();
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
