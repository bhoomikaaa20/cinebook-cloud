import express from "express";
import {
    getMoviesAdmin,
    addMovie,
    deleteMovie,
    getShowsAdmin,
    addShow,
    deleteShow,
    getBookingsAdmin
} from "../controllers/adminController";
import { protect } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";

const router = express.Router();

router.use(protect, isAdmin);

// Movies
router.get("/movies", getMoviesAdmin);
router.post("/movies", addMovie);
router.delete("/movies/:id", deleteMovie);

// Shows
router.get("/shows", getShowsAdmin);
router.post("/shows", addShow);
router.delete("/shows/:id", deleteShow);

// Bookings
router.get("/bookings", getBookingsAdmin);

export default router;