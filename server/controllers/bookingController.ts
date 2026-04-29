import { Request, Response } from "express";
import Booking from "../models/Booking";
import { v4 as uuidv4 } from "uuid";

// GET BOOKED SEATS
export const getBookedSeats = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find({ show_id: req.params.showId });

        res.json(bookings.map((b) => ({ seat_label: b.seat_label })));
    } catch {
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

// CREATE BOOKINGS
export const createBooking = async (req: any, res: Response) => {
    try {
        const { seats, show_id, price } = req.body;

        // 🔥 generate ONE booking reference for all seats
        const bookingRef = uuidv4();

        const bookings = seats.map((seat: string) => ({
            user_id: req.user._id,
            show_id,
            seat_label: seat,
            price,
            booking_ref: bookingRef, // ✅ important
        }));

        await Booking.insertMany(bookings);

        res.json({ message: "Booking successful" });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Seat already booked" });
        }
        res.status(500).json({ message: "Booking failed" });
    }
};
// GET USER BOOKINGS
export const getMyBookings = async (req: any, res: Response) => {
    try {
        const bookings = await Booking.find({})
            .populate({
                path: "show_id",
                populate: {
                    path: "movie_id",
                    select: "title poster_url",
                },
            })
            .sort({ createdAt: -1 });

        const formatted = bookings.map((b: any) => ({
            _id: b._id,
            seat_label: b.seat_label,
            price: b.price,
            booking_ref: b.booking_ref,
            created_at: b.createdAt,
            shows: b.show_id && b.show_id.movie_id
                ? {
                    show_time: b.show_id.show_time,
                    screen: b.show_id.screen,
                    movies: {
                        title: b.show_id.movie_id.title,
                        poster_url: b.show_id.movie_id.poster_url,
                    },
                }
                : null,
        }));

        res.json(formatted);
    } catch (err) {
        console.error("🔥 REAL ERROR:", err);  // 👈 MUST ADD
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

