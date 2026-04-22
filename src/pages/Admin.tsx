import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Movie { id: string; title: string; duration_minutes: number; }
interface ShowRow { id: string; show_time: string; screen: string; price: number; movies: { title: string } | null; }
interface BookingAdminRow { id: string; seat_label: string; created_at: string; shows: { screen: string; show_time: string; movies: { title: string } | null } | null; }

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<ShowRow[]>([]);
  const [bookings, setBookings] = useState<BookingAdminRow[]>([]);

  useEffect(() => {
    document.title = "Admin — Cinemati";
    if (!authLoading && (!user || !isAdmin)) navigate("/");
  }, [authLoading, user, isAdmin, navigate]);

  const refresh = async () => {
    const [m, s, b] = await Promise.all([
      supabase.from("movies").select("id, title, duration_minutes").order("created_at", { ascending: false }),
      supabase.from("shows").select("id, show_time, screen, price, movies(title)").order("show_time"),
      supabase.from("bookings").select("id, seat_label, created_at, shows(screen, show_time, movies(title))").order("created_at", { ascending: false }).limit(50),
    ]);
    setMovies((m.data as Movie[]) ?? []);
    setShows((s.data as unknown as ShowRow[]) ?? []);
    setBookings((b.data as unknown as BookingAdminRow[]) ?? []);
  };

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin]);

  const addMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("movies").insert({
      title: String(fd.get("title")),
      description: String(fd.get("description") || ""),
      poster_url: String(fd.get("poster_url") || ""),
      duration_minutes: Number(fd.get("duration") || 120),
      genre: String(fd.get("genre") || ""),
      rating: String(fd.get("rating") || ""),
    });
    if (error) toast.error(error.message);
    else { toast.success("Movie added"); (e.target as HTMLFormElement).reset(); refresh(); }
  };

  const deleteMovie = async (id: string) => {
    const { error } = await supabase.from("movies").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); refresh(); }
  };

  const addShow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const movieId = String(fd.get("movie_id") || "");
    if (!movieId) return toast.error("Pick a movie");
    const { error } = await supabase.from("shows").insert({
      movie_id: movieId,
      show_time: new Date(String(fd.get("show_time"))).toISOString(),
      screen: String(fd.get("screen") || "Screen 1"),
      price: Number(fd.get("price") || 12),
      rows: Number(fd.get("rows") || 6),
      cols: Number(fd.get("cols") || 8),
    });
    if (error) toast.error(error.message);
    else { toast.success("Show added"); (e.target as HTMLFormElement).reset(); refresh(); }
  };

  const deleteShow = async (id: string) => {
    const { error } = await supabase.from("shows").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); refresh(); }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="text-2xl font-semibold mb-6">Admin Panel</h1>
        <Tabs defaultValue="movies">
          <TabsList>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="shows">Shows</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="mt-6 grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Add movie</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={addMovie} className="space-y-3">
                  <div><Label>Title</Label><Input name="title" required /></div>
                  <div><Label>Description</Label><Textarea name="description" /></div>
                  <div><Label>Poster URL</Label><Input name="poster_url" type="url" /></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><Label>Duration</Label><Input name="duration" type="number" defaultValue={120} /></div>
                    <div><Label>Genre</Label><Input name="genre" /></div>
                    <div><Label>Rating</Label><Input name="rating" /></div>
                  </div>
                  <Button type="submit" className="w-full">Add</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Existing ({movies.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-auto">
                {movies.map((m) => (
                  <div key={m.id} className="flex items-center justify-between border rounded-md p-2">
                    <div><p className="font-medium text-sm">{m.title}</p><p className="text-xs text-muted-foreground">{m.duration_minutes} min</p></div>
                    <Button variant="ghost" size="icon" onClick={() => deleteMovie(m.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shows" className="mt-6 grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Add show</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={addShow} className="space-y-3">
                  <div>
                    <Label>Movie</Label>
                    <Select name="movie_id">
                      <SelectTrigger><SelectValue placeholder="Pick a movie" /></SelectTrigger>
                      <SelectContent>{movies.map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Show time</Label><Input name="show_time" type="datetime-local" required /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>Screen</Label><Input name="screen" defaultValue="Screen 1" /></div>
                    <div><Label>Price</Label><Input name="price" type="number" step="0.5" defaultValue={12} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>Rows</Label><Input name="rows" type="number" defaultValue={6} /></div>
                    <div><Label>Cols</Label><Input name="cols" type="number" defaultValue={8} /></div>
                  </div>
                  <Button type="submit" className="w-full">Add show</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Upcoming ({shows.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-auto">
                {shows.map((s) => (
                  <div key={s.id} className="flex items-center justify-between border rounded-md p-2">
                    <div>
                      <p className="font-medium text-sm">{s.movies?.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(s.show_time).toLocaleString()} · {s.screen}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteShow(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Recent bookings ({bookings.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-auto">
                {bookings.map((b) => (
                  <div key={b.id} className="border rounded-md p-2 text-sm flex justify-between">
                    <div>
                      <p className="font-medium">{b.shows?.movies?.title} — Seat {b.seat_label}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.shows && new Date(b.shows.show_time).toLocaleString()} · {b.shows?.screen}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
