import express from "express";
import { getBookedSeats, createBooking, getMyBookings } from "../controllers/bookingController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:showId", getBookedSeats);
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
export default router;