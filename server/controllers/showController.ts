import { Request, Response } from "express";
import Show from "../models/Show";

// GET SHOWS BY MOVIE
export const getShowsByMovie = async (req: Request, res: Response) => {
    try {
        const shows = await Show.find({
            movie_id: req.params.movieId,
        }).sort({ show_time: 1 });

        res.json(
            shows.map((s) => ({
                id: s._id,
                ...s.toObject(),
            }))
        );
    } catch {
        res.status(500).json({ message: "Error fetching shows" });
    }
};

// GET SINGLE SHOW
export const getShowById = async (req: Request, res: Response) => {
    try {
        const show = await Show.findById(req.params.id).populate("movie_id", "title");

        if (!show) return res.status(404).json({ message: "Show not found" });

        res.json({
            id: show._id,
            show_time: show.show_time,
            screen: show.screen,
            price: show.price,
            rows: show.rows,
            cols: show.cols,
            movies: { title: (show.movie_id as any).title },
        });
    } catch {
        res.status(500).json({ message: "Error fetching show" });
    }
};