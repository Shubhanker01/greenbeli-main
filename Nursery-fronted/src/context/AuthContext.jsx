import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUserProfile, loginUser, registerUser, updateUserProfile } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("nursery_user_info");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("nursery_user_token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      getCurrentUserProfile()
        .then((userData) => {
          if (userData && userData._id) {
            setUser(userData);
            localStorage.setItem("nursery_user_info", JSON.stringify(userData));
          }
        })
        .catch(() => {
          // Token expired or invalid
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res.token) {
        setToken(res.token);
        localStorage.setItem("nursery_user_token", res.token);
      }
      const userInfo = res.user || { email, name: email.split("@")[0] };
      setUser(userInfo);
      localStorage.setItem("nursery_user_info", JSON.stringify(userInfo));
      setLoading(false);
      return { success: true, user: userInfo };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.message || "Login failed" };
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password, phone });
      if (res.token) {
        setToken(res.token);
        localStorage.setItem("nursery_user_token", res.token);
      }
      const userInfo = res.user || { name, email, phone };
      setUser(userInfo);
      localStorage.setItem("nursery_user_info", JSON.stringify(userInfo));
      setLoading(false);
      return { success: true, user: userInfo };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.message || "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("nursery_user_token");
    localStorage.removeItem("nursery_user_info");
  };

  const updateProfile = async (data) => {
    try {
      const updated = await updateUserProfile(data);
      const newUser = { ...user, ...updated };
      setUser(newUser);
      localStorage.setItem("nursery_user_info", JSON.stringify(newUser));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
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
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
