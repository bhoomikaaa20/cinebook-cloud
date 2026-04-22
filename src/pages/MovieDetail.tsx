import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  duration_minutes: number;
  genre: string | null;
  rating: string | null;
}
interface Show {
  id: string;
  show_time: string;
  screen: string;
  price: number;
}

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("movies").select("*").eq("id", id).maybeSingle(),
      supabase.from("shows").select("id, show_time, screen, price").eq("movie_id", id).order("show_time"),
    ]).then(([m, s]) => {
      setMovie(m.data as Movie | null);
      setShows((s.data as Show[]) ?? []);
      setLoading(false);
      if (m.data) document.title = `${(m.data as Movie).title} — Cinemati`;
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-10">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }
  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-16 text-center">
          <p className="text-muted-foreground">Movie not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="aspect-[2/3] rounded-xl overflow-hidden bg-muted">
            {movie.poster_url && (
              <img src={movie.poster_url} alt={`${movie.title} poster`} className="h-full w-full object-cover" />
            )}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">{movie.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {movie.duration_minutes} min
              </span>
              {movie.genre && <Badge variant="secondary">{movie.genre}</Badge>}
              {movie.rating && <Badge>{movie.rating}</Badge>}
            </div>
            <p className="mt-6 text-foreground/80 leading-relaxed">{movie.description}</p>

            <h2 className="mt-10 text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Showtimes
            </h2>
            {shows.length === 0 ? (
              <p className="mt-3 text-muted-foreground">No upcoming shows.</p>
            ) : (
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {shows.map((s) => {
                  const dt = new Date(s.show_time);
                  return (
                    <Card key={s.id} className="hover:border-primary transition-colors">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium">
                            {dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} · {s.screen} · ${Number(s.price).toFixed(2)}
                          </div>
                        </div>
                        <Button asChild size="sm">
                          <Link to={`/shows/${s.id}`}>Select seats</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetail;
