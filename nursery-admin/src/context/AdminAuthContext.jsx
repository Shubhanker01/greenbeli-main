import { useEffect, useState, useCallback, useContext, createContext } from "react"
const AdminAuthContext = createContext(null);
export const useAdminAuth = () => useContext(AdminAuthContext);
const API_URL = "http://localhost:5007"
export function AdminAuthProvider({ children }) {
  const [state, setState] = useState({ status: "loading" });

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(`${API_URL}/api/admin/session`, { credentials: "include" });
      console.log(r)
      setState(await r.json());
    } catch {
      setState({ status: "unauthenticated" });
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AdminAuthContext.Provider value={{ ...state, refresh }}>
      {children}
    </AdminAuthContext.Provider>
  );
}