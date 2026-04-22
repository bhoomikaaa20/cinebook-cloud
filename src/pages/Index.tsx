import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  poster_url: string | null;
  duration_minutes: number;
  genre: string | null;
  rating: string | null;
}

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Cinemati — Book movie tickets online";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Browse movies, pick your seats, and book cinema tickets in seconds.");
    supabase
      .from("movies")
      .select("id, title, poster_url, duration_minutes, genre, rating")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMovies(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="border-b border-border bg-gradient-to-br from-accent/40 to-background">
        <div className="container py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
            Movies, on your time.
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Browse what's playing, pick your perfect seat, and skip the queue.
          </p>
        </div>
      </section>

      <main className="container py-12">
        <h2 className="text-2xl font-semibold mb-6">Now showing</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full rounded-xl" />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <p className="text-muted-foreground">No movies yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((m) => (
              <Link key={m.id} to={`/movies/${m.id}`}>
                <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow">
                  <div className="aspect-[2/3] bg-muted overflow-hidden">
                    {m.poster_url ? (
                      <img
                        src={m.poster_url}
                        alt={`${m.title} poster`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{m.title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{m.duration_minutes} min</span>
                      {m.rating && <Badge variant="secondary" className="ml-auto">{m.rating}</Badge>}
                    </div>
                    {m.genre && <p className="mt-1 text-xs text-muted-foreground truncate">{m.genre}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
