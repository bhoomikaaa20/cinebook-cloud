import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });
};

// SIGNUP
export const signup = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password: hashed,
    });

    const token = generateToken(user._id.toString());

    res.json({ token, user });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString());

    res.json({ token, user });
};

// GET CURRENT USER
export const getMe = async (req: any, res: Response) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
};  