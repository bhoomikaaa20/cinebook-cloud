import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface BookingRow {
  id: string;
  seat_label: string;
  price: number;
  booking_ref: string;
  created_at: string;
  shows: {
    show_time: string;
    screen: string;
    movies: { title: string; poster_url: string | null };
  };
}

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Bookings — Cinemati";
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/bookings/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);
          setBookings([]); // ✅ prevent crash
          return;
        }

        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Group by booking_ref
  const grouped = bookings.reduce((acc, b) => {
    (acc[b.booking_ref] ||= []).push(b);
    return acc;
  }, {} as Record<string, BookingRow[]>);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6">My Bookings</h1>
        {loading ? (
          <Skeleton className="h-40" />
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([ref, items]) => {
              const first = items[0];
              return (
                <Card key={ref}>
                  <CardContent className="p-4 flex gap-4">
                    {first.shows.movies.poster_url && (
                      <img
                        src={first.shows.movies.poster_url}
                        alt=""
                        className="h-28 w-20 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {first.shows.movies.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(first.shows.show_time).toLocaleString()} ·{" "}
                        {first.shows.screen}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {items.map((i) => (
                          <Badge key={i.id} variant="secondary">
                            {i.seat_label}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-2 text-sm font-medium">
                        Total $
                        {items
                          .reduce((s, i) => s + Number(i.price), 0)
                          .toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ref: {ref.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;