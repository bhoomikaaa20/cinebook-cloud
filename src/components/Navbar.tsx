import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Film, Ticket, Shield, LogOut, User as UserIcon } from "lucide-react";

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Film className="h-6 w-6 text-primary" />
          <span>Cinemati</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild size="sm">
            <Link to="/">Movies</Link>
          </Button>
          {user && (
            <Button variant="ghost" asChild size="sm">
              <Link to="/bookings">
                <Ticket className="mr-1.5 h-4 w-4" />
                My Bookings
              </Link>
            </Button>
          )}
          {isAdmin && (
            <Button variant="ghost" asChild size="sm">
              <Link to="/admin">
                <Shield className="mr-1.5 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Sign out
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>
              <UserIcon className="mr-1.5 h-4 w-4" />
              Sign in
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
