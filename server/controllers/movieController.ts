import { Request, Response } from "express";
import Movie from "../models/Movie";

// GET ALL MOVIES
export const getMovies = async (req: Request, res: Response) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: "Error fetching movies" });
    }
};

// GET SINGLE MOVIE
export const getMovieById = async (req: Request, res: Response) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) return res.status(404).json({ message: "Movie not found" });

        res.json({
            id: movie._id,
            ...movie.toObject(),
        });
    } catch {
        res.status(500).json({ message: "Error fetching movie" });
    }
};