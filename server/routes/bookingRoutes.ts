import express from "express";
import { getBookedSeats, createBooking, getMyBookings } from "../controllers/bookingController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/my", protect, getMyBookings);
router.get("/:showId", getBookedSeats);
router.post("/", protect, createBooking);

export default router;