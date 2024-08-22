import { createContext, createSignal, Accessor, createEffect, useContext } from "solid-js";
import {
  loginAccessToken,
  readUserMe,
  type Body_login_login_access_token as AccessToken,
  type UserPublic,
} from "../client";

type AuthContextType = {
  user: Accessor<UserPublic | null>;
  isLoading: Accessor<boolean>;
  error: Accessor<string | null>;
  login: (data: AccessToken) => Promise<void>;
  logout: () => void;
  resetError: () => void;
  isAuthenticated: Accessor<boolean>;
};

const AuthContext = createContext<AuthContextType>();

export const AuthProvider = (props: any) => {
  const [user, setUser] = createSignal<UserPublic | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await readUserMe();
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: AccessToken) => {
    setIsLoading(true);
    try {
      const response = await loginAccessToken({ formData: data });
      localStorage.setItem("access_token", response.access_token);
      await fetchUser();
    } catch (err) {
      console.error("Login failed", err);
      let errDetail = (err as any)?.body?.detail || "Login failed";
      setError(errDetail);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  const resetError = () => {
    setError(null);
  };

  createEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser();
    } else {
      setUser(null);
    }
  });


  const isAuthenticated = () => {
    return localStorage.getItem('access_token') !== null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        resetError,
        isAuthenticated,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
