import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("careerInsightToken"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("careerInsightUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    authApi
      .getMe(token)
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("careerInsightUser", JSON.stringify(data.user));
        }
      })
      .catch(() => logout());
  }, [token]);

  const persistAuth = (authData) => {
    localStorage.setItem("careerInsightToken", authData.token);
    localStorage.setItem("careerInsightUser", JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  };

  const login = async (payload) => {
    const data = await authApi.login(payload);
    persistAuth(data);
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    persistAuth(data);
  };

  const logout = () => {
    localStorage.removeItem("careerInsightToken");
    localStorage.removeItem("careerInsightUser");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
