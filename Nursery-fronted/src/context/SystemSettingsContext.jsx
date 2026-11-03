import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
    getSystemSettings
} from "../utils/api";

const SystemSettingContext = createContext(null);
const defaultValue = {
    storeName: "Greenbeli",
    supportPhone: "+919950711475",
    supportEmail: "support@greenbeli.in",
    address: "GreenBeli Gardeniya,Khasra No. 74, Rewari Highway Road, near Gyansagar School, Kotkasim, Alampur, Rajasthan 301702",
    shippingFee: 0,
    freeShippingThreshold: 999,
    taxPercent: 0,
}

export const SystemSettingProvider = ({ children }) => {
    const [state, setState] = useState({
        ...defaultValue,
        status: "loading",
        error: null,
    });

    const refresh = useCallback(async () => {
        setState((current) => ({ ...current, status: "loading", error: null }));
        try {
            const res = await getSystemSettings();
            if (!res?.success || !res.data) {
                throw new Error("Unable to load store settings.");
            }
            setState((current) => ({
                ...current,
                ...defaultValue,
                ...res.data,
                status: "success",
                error: null,
            }));
        } catch (error) {
            console.error("Unable to load store settings:", error);
            setState((current) => ({
                ...current,
                status: "error",
                error,
            }));
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);
    return (
        <SystemSettingContext.Provider
            value={{
                state
            }}
        >
            {children}
        </SystemSettingContext.Provider>
    );
};

export const useSystemSettings = () => useContext(SystemSettingContext);
