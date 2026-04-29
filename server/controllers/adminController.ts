import { Request, Response } from "express";
import Movie from "../models/Movie";
import Show from "../models/Show";
import Booking from "../models/Booking";

// 🎬 MOVIES
export const getMoviesAdmin = async (req: Request, res: Response) => {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies.map(m => ({
        _id: m._id,
        title: m.title,
        duration_minutes: m.duration_minutes
    })));
};

export const addMovie = async (req: Request, res: Response) => {
    const movie = await Movie.create(req.body);
    res.json(movie);
};

export const deleteMovie = async (req: Request, res: Response) => {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};

// 🎟️ SHOWS
export const getShowsAdmin = async (req: Request, res: Response) => {
    const shows = await Show.find()
        .populate("movie_id", "title")
        .sort({ show_time: 1 });

    res.json(shows.map((s: any) => ({
        _id: s._id,
        show_time: s.show_time,
        screen: s.screen,
        price: s.price,
        movies: { title: s.movie_id.title }
    })));
};

export const addShow = async (req: Request, res: Response) => {
    const show = await Show.create(req.body);
    res.json(show);
};

export const deleteShow = async (req: Request, res: Response) => {
    await Show.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};

// 📊 BOOKINGS
export const getBookingsAdmin = async (req: Request, res: Response) => {
    const bookings = await Booking.find()
        .populate({
            path: "show_id",
            populate: { path: "movie_id", select: "title" }
        })
        .sort({ createdAt: -1 })
        .limit(50);

    res.json(bookings.map((b: any) => ({
        _id: b._id,
        seat_label: b.seat_label,
        created_at: b.createdAt,
        shows: {
            screen: b.show_id.screen,
            show_time: b.show_id.show_time,
            movies: { title: b.show_id.movie_id.title }
        }
    })));
};