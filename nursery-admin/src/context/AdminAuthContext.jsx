import { useEffect, useState, useCallback, useContext, createContext } from "react"
const AdminAuthContext = createContext(null);
export const useAdminAuth = () => useContext(AdminAuthContext);
const API_URL = "http://localhost:5007"
export function AdminAuthProvider({ children }) {
  const [state, setState] = useState({ status: "loading" });

  const refresh = useCallback(async () => {
    setState({ status: "loading" });        // the guard shows "Checking access…" instead of redirecting
    try {
      const r = await fetch(`${API_URL}/api/admin/session`, {
        credentials: "include",
        cache: "no-store",                  // never reuse an old answer
      });
      const data = await r.json();
      setState(data);
      return data;
    } catch {
      const data = { status: "unauthenticated" };
      setState(data);
      return data;
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AdminAuthContext.Provider value={{ ...state, refresh }}>
      {children}
    </AdminAuthContext.Provider>
  );
}