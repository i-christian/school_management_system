import { createContext, createSignal, Accessor, createEffect, useContext, JSX } from "solid-js";
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

export const AuthProvider: (props: { children: JSX.Element }) => JSX.Element = (props) => {
  const [user, setUser] = createSignal<UserPublic | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const [error, setError] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean>(!!localStorage.getItem('access_token'));

  const handleLocalStorage = (key: string, value?: string | null) => {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  };

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expiration = decodedToken.exp * 1000;
    return Date.now() > expiration;
  };

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await readUserMe();
      setUser(userData);
      handleLocalStorage('user', JSON.stringify(userData));
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: AccessToken) => {
    setIsLoading(true);
    try {
      const response = await loginAccessToken({ formData: data });
      handleLocalStorage("access_token", response.access_token);
      await fetchUser();
    } catch (err) {
      console.error("Login failed", err);
      const errDetail = (err as any)?.body?.detail || "Login failed";
      setError(errDetail);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    handleLocalStorage("access_token");
    handleLocalStorage("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetError = () => setError(null);

  createEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !isTokenExpired(token)) {
      fetchUser();
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  });

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
