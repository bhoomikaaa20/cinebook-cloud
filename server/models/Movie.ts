import mongoose, { Document } from "mongoose";

export interface IMovie extends Document {
    title: string;
    poster_url?: string;
    duration_minutes: number;
    genre?: string;
    rating?: string;
    description?: string; // ✅ added here
}

const movieSchema = new mongoose.Schema<IMovie>(
    {
        title: { type: String, required: true },
        poster_url: { type: String },
        duration_minutes: { type: Number, required: true },
        genre: { type: String },
        rating: { type: String },
        description: { type: String }, // ✅ already correct
    },
    { timestamps: true }
);

export default mongoose.model<IMovie>("Movie", movieSchema);