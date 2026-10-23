import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_URL } from "../services/apiBaseUrl";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("weathercart-token")
  );

  const [loading, setLoading] =
    useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function loadUser() {
      try {
        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const data = await response.json();

        setUser(data.user);
      } catch {
        localStorage.removeItem(
          "weathercart-token"
        );

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (
    email,
    password
  ) => {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data.message || "Login failed"
      );
      error.code = data.code;
      throw error;
    }

    localStorage.setItem(
      "weathercart-token",
      data.token
    );

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const register = async (
    name,
    email,
    password
  ) => {
    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data.message ||
          "Registration failed"
      );
      error.code = data.code;
      throw error;
    }

    return data;
  };

  const resendVerificationEmail = (email) =>
    api.resendVerificationEmail(email);

  const logout = () => {
    localStorage.removeItem(
      "weathercart-token"
    );

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        resendVerificationEmail,
        isAuthenticated: Boolean(user),
        isAdmin:
          user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
