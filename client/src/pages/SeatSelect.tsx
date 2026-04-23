import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ShowFull {
  id: string;
  show_time: string;
  screen: string;
  price: number;
  rows: number;
  cols: number;
  movies: { title: string };
}

const seatLabel = (r: number, c: number) => `${String.fromCharCode(65 + r)}${c + 1}`;

const SeatSelect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [show, setShow] = useState<ShowFull | null>(null);
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    if (!id) return;

    try {
      const [showRes, bookRes] = await Promise.all([
        fetch(`http://localhost:5000/api/shows/${id}`),
        fetch(`http://localhost:5000/api/bookings/${id}`),
      ]);

      const showData = await showRes.json();
      const bookingData = await bookRes.json();

      setShow(showData);
      setBookedSeats(new Set(bookingData.map((b: any) => b.seat_label)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    document.title = "Select seats — Cinemati";
    fetchAll();
  }, [id]);

  const toggle = (label: string) => {
    if (bookedSeats.has(label)) return;
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(label)) n.delete(label);
      else n.add(label);
      return n;
    });
  };

  const total = useMemo(() => (show ? selected.size * Number(show.price) : 0), [selected, show]);

  const confirm = async () => {
    if (!user) {
      toast.error("Please sign in to book.");
      navigate("/auth");
      return;
    }

    if (selected.size === 0 || !show) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          show_id: show.id,
          seats: Array.from(selected),
          price: show.price,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        await fetchAll();
        setSelected(new Set());
        return;
      }

      toast.success(`Booked ${selected.size} seat${selected.size > 1 ? "s" : ""}!`);
      navigate("/bookings");
    } catch {
      toast.error("Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-10">
          <Skeleton className="h-80 w-full" />
        </main>
      </div>
    );
  }
  if (!show) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-semibold">{show.movies.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date(show.show_time).toLocaleString()} · {show.screen} · ${Number(show.price).toFixed(2)}/seat
        </p>

        <Card className="mt-6 p-6">
          <div className="mx-auto w-full max-w-md">
            <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-1" />
            <p className="text-center text-xs text-muted-foreground mb-6">SCREEN</p>
            <div className="space-y-2">
              {Array.from({ length: show.rows }).map((_, r) => (
                <div key={r} className="flex justify-center gap-2">
                  {Array.from({ length: show.cols }).map((_, c) => {
                    const label = seatLabel(r, c);
                    const isBooked = bookedSeats.has(label);
                    const isSelected = selected.has(label);
                    return (
                      <button
                        key={label}
                        onClick={() => toggle(label)}
                        disabled={isBooked}
                        aria-label={`Seat ${label}${isBooked ? " (booked)" : ""}`}
                        className={`h-8 w-8 rounded-md text-[10px] font-medium transition-all ${isBooked
                          ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                          : isSelected
                            ? "bg-primary text-primary-foreground scale-110"
                            : "bg-secondary hover:bg-accent text-foreground"
                          }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-secondary" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary" /> Selected</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-muted" /> Booked</span>
          </div>
        </Card>

        <div className="mt-6 flex items-center justify-between sticky bottom-4 bg-background/90 backdrop-blur p-4 rounded-xl border shadow-md">
          <div>
            <p className="text-sm text-muted-foreground">{selected.size} seat{selected.size !== 1 ? "s" : ""}</p>
            <p className="text-xl font-semibold">${total.toFixed(2)}</p>
          </div>
          <Button size="lg" disabled={selected.size === 0 || submitting} onClick={confirm}>
            {submitting ? "Booking…" : "Confirm booking"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SeatSelect;
