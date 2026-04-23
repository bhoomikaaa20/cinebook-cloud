import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Ticket,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
  PlayCircle,
  Armchair,
  CalendarCheck,
  CreditCard,
} from "lucide-react";

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
    if (meta)
      meta.setAttribute(
        "content",
        "Browse movies, pick your seats, and book cinema tickets in seconds.",
      );

    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/movies");
        const data = await res.json();
        setMovies(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Decorative gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-20 -right-24 h-96 w-96 rounded-full bg-accent-foreground/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-accent/30 via-background to-background" />
        </div>

        <div className="container py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge
                variant="secondary"
                className="mb-5 inline-flex items-center gap-1.5 px-3 py-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium">
                  Real-time seat booking
                </span>
              </Badge>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
                Movies, on your{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  time.
                </span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Browse what's playing, pick your perfect seat, and skip the
                queue. Book in seconds — no app required.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button size="lg" asChild className="group">
                  <a href="#now-showing">
                    <Ticket className="mr-1 h-4 w-4" />
                    Browse movies
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">
                    <PlayCircle className="mr-1 h-4 w-4" />
                    How it works
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-semibold text-foreground">
                    50K+
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Tickets booked
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-foreground">
                    120+
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Daily showtimes
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-foreground flex items-center gap-1">
                    4.9
                    <Star className="h-4 w-4 fill-warning text-warning" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    User rating
                  </div>
                </div>
              </div>
            </div>

            {/* Hero visual: stylized seat grid */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-8 shadow-lg">
                <div className="mx-auto mb-6 h-1.5 w-3/4 rounded-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <div className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">
                  Screen
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, r) => (
                    <div key={r} className="flex justify-center gap-1.5">
                      {Array.from({ length: 10 }).map((_, c) => {
                        const booked = (r * 10 + c) % 7 === 0;
                        const selected =
                          (r === 3 && (c === 4 || c === 5)) ||
                          (r === 4 && (c === 4 || c === 5));
                        return (
                          <div
                            key={c}
                            className={`h-6 w-6 rounded-md transition-colors ${booked
                              ? "bg-muted"
                              : selected
                                ? "bg-primary shadow-sm shadow-primary/40"
                                : "bg-secondary border border-border"
                              }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-center gap-5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-secondary border border-border" />
                    Available
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-primary" />
                    Selected
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-muted" />
                    Booked
                  </div>
                </div>
              </div>
              {/* Floating ticket card */}
              <div className="absolute -bottom-6 -left-6 rounded-xl border border-border bg-background shadow-lg p-4 w-56">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ticket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Booking confirmed
                    </div>
                    <div className="text-sm font-medium">Seat F4, F5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-border bg-background">
        <div className="container py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="secondary" className="mb-4">
              Why Cinemati
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Built for the perfect night out
            </h2>
            <p className="mt-3 text-muted-foreground">
              A booking experience designed to be fast, reliable, and
              delightfully simple.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Lightning fast",
                desc: "From browse to confirmed booking in under a minute. No friction, no fuss.",
              },
              {
                icon: ShieldCheck,
                title: "Secure by default",
                desc: "Bank-level encryption and seat-locking ensure your booking is always safe.",
              },
              {
                icon: Armchair,
                title: "Real-time seats",
                desc: "Live seat availability updates instantly — never get stuck with double bookings.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <Card
                key={title}
                className="group border-border hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <CardContent className="p-6">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* NOW SHOWING */}
      <main id="now-showing" className="container py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <Badge variant="secondary" className="mb-3">
              Now showing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              This week's lineup
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-sm text-right">
            Fresh releases and audience favorites — pick a film and reserve your
            seat.
          </p>
        </div>

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
              <Link key={m.id} to={`/movies/${m.id}`} className="group">
                <Card className="overflow-hidden border-border group-hover:border-primary/40 group-hover:shadow-xl transition-all">
                  <div className="aspect-[2/3] bg-muted overflow-hidden relative">
                    {m.poster_url ? (
                      <img
                        src={m.poster_url}
                        alt={`${m.title} poster`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <Badge className="bg-primary text-primary-foreground">
                        Book now
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{m.title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{m.duration_minutes} min</span>
                      {m.rating && (
                        <Badge variant="secondary" className="ml-auto">
                          {m.rating}
                        </Badge>
                      )}
                    </div>
                    {m.genre && (
                      <p className="mt-1 text-xs text-muted-foreground truncate">
                        {m.genre}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-y border-border bg-accent/20"
      >
        <div className="container py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="secondary" className="mb-4">
              How it works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Three steps to your seat
            </h2>
            <p className="mt-3 text-muted-foreground">
              We've stripped the booking process down to what matters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {[
              {
                step: "01",
                icon: CalendarCheck,
                title: "Pick a showtime",
                desc: "Choose your movie and the screening time that fits your day.",
              },
              {
                step: "02",
                icon: Armchair,
                title: "Choose your seat",
                desc: "Interactive seat map with real-time availability — no surprises.",
              },
              {
                step: "03",
                icon: CreditCard,
                title: "Confirm & enjoy",
                desc: "Get instant confirmation and your ticket reference. Done.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="relative rounded-xl bg-background border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-3 left-6 text-xs font-mono font-semibold text-primary bg-background px-2 py-0.5 border border-border rounded-full">
                  {step}
                </div>
                <Icon className="h-7 w-7 text-primary mb-4" />
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="container py-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-10 md:p-16 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-primary-foreground blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-primary-foreground blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary-foreground">
                Ready for your next movie night?
              </h2>
              <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
                Join thousands of moviegoers booking smarter every week.
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="mt-8"
              >
                <a href="#now-showing">
                  Browse movies
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ticket className="h-4 w-4 text-primary" />
            <span>© {new Date().getFullYear()} Cinemati. All rights reserved.</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Crafted for moviegoers, everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
