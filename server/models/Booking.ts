import mongoose, { Document } from "mongoose";

export interface IBooking extends Document {
    user_id: mongoose.Types.ObjectId;
    show_id: mongoose.Types.ObjectId;
    seat_label: string;
    price: number;
    booking_ref: string;
}

const bookingSchema = new mongoose.Schema<IBooking>(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        show_id: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
        seat_label: { type: String, required: true },
        price: { type: Number, required: true },
        booking_ref: { type: String, required: true },
    },
    { timestamps: true }
);

// prevent double booking
bookingSchema.index({ show_id: 1, seat_label: 1 }, { unique: true });

export default mongoose.model<IBooking>("Booking", bookingSchema);