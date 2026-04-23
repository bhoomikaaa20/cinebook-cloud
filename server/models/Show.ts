import mongoose, { Document } from "mongoose";

export interface IShow extends Document {
    movie_id: mongoose.Types.ObjectId;
    show_time: Date;
    screen: string;
    price: number;
    rows: number; // ✅ added
    cols: number; // ✅ added
}

const showSchema = new mongoose.Schema<IShow>(
    {
        movie_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },
        show_time: { type: Date, required: true },
        screen: { type: String, required: true },
        price: { type: Number, required: true },
        rows: { type: Number, default: 8 },
        cols: { type: Number, default: 10 },
    },
    { timestamps: true } // ✅ optional but recommended
);

export default mongoose.model<IShow>("Show", showSchema);