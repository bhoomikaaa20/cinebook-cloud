import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
}

interface AuthCtx {
  user: User | null;
  session: null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>; // ✅ added
}

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => { },
  refreshUser: async () => { }, // ✅ added
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 reusable function
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const data = await res.json();

      setUser(data);
      setIsAdmin(data.role === "admin");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 initial load
  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setLoading(false);
    };
    init();
  }, []);

  // 🔥 expose this to call after login
  const refreshUser = async () => {
    await fetchUser();
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <Ctx.Provider
      value={{
        user,
        session: null,
        isAdmin,
        loading,
        signOut,
        refreshUser, // ✅ added
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);