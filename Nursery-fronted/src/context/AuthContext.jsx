import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getAuthSession,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    status: "loading",
    user: null,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, status: "loading", error: null }));
    try {
      const session = await getAuthSession();
      const nextState = {
        status: session.user ? "authenticated" : "unauthenticated",
        user: session.user || null,
        error: null,
      };
      setState(nextState);
      return { success: true, ...nextState };
    } catch (error) {
      const nextState = {
        status: "error",
        user: null,
        error: error.message || "Unable to check your sign-in status.",
      };
      setState(nextState);
      return { success: false, ...nextState, message: nextState.error };
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    setState({ status: "authenticating", user: null, error: null });
    try {
      await loginUser(email, password);
      const session = await getAuthSession();
      if (!session.user) {
        setState({
          status: "unauthenticated",
          user: null,
          error: "Unable to verify your sign-in. Please try again.",
        });
        return {
          success: false,
          message: "Unable to verify your sign-in. Please try again.",
        };
      }

      setState({ status: "authenticated", user: session.user, error: null });
      return { success: true, user: session.user };
    } catch (error) {
      const message = error.message || "Login failed.";
      setState({ status: "unauthenticated", user: null, error: message });
      return { success: false, message };
    }
  };

  const register = async (name, email, password, phone) => {
    setState({ status: "authenticating", user: null, error: null });
    try {
      const response = await registerUser({ name, email, password, phone });
      if (!response.user) {
        setState({ status: "unauthenticated", user: null, error: null });
        return {
          success: true,
          requiresConfirmation: true,
          message: response.message,
        };
      }

      const session = await getAuthSession();
      if (!session.user) {
        setState({
          status: "unauthenticated",
          user: null,
          error: "Unable to verify your new account. Please sign in.",
        });
        return {
          success: false,
          message: "Unable to verify your new account. Please sign in.",
        };
      }

      setState({ status: "authenticated", user: session.user, error: null });
      return {
        success: true,
        requiresConfirmation: false,
        user: session.user,
      };
    } catch (error) {
      const message = error.message || "Registration failed.";
      setState({ status: "unauthenticated", user: null, error: message });
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setState({ status: "unauthenticated", user: null, error: null });
      return { success: true };
    } catch (error) {
      const message = error.message || "Unable to sign out.";
      setState((current) => ({ ...current, error: message }));
      return { success: false, message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await updateUserProfile(profileData);
      if (!response.user) {
        throw new Error("The profile response did not include a user.");
      }
      const user = { ...state.user, ...response.user };
      setState({ status: "authenticated", user, error: null });
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Profile update failed.",
      };
    }
  };

  const isAuthenticated = state.status === "authenticated" && Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loading: state.status === "loading" || state.status === "authenticating",
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
