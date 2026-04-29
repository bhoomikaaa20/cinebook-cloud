import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const protect = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user; // ✅ FULL USER OBJECT (HAS _id)

        next();
    } catch (err) {
        console.error("AUTH ERROR:", err);
        res.status(401).json({ message: "Invalid token" });
    }
};