import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
    getSystemSettings
} from "../utils/api";

const SystemSettingContext = createContext(null);
const defaultValue = {
    supportPhone: "+919950711475",
    supportEmail: "support@greenbeli.in",
    address: "GreenBeli Gardeniya,Khasra No. 74, Rewari Highway Road, near Gyansagar School, Kotkasim, Alampur, Rajasthan 301702"
}

export const SystemSettingProvider = ({ children }) => {
    const [state, setState] = useState({
        supportPhone: defaultValue.supportPhone,
        supportEmail: defaultValue.supportEmail,
        address: defaultValue.address
    });

    const refresh = useCallback(async () => {
        setState((current) => ({ ...current, status: "loading", error: null }));
        try {
            const res = await getSystemSettings();
            if (res.success) {
                setState({
                    ...state,
                    supportPhone: res.data.supportPhone,
                    supportEmail: res.data.supportEmail,
                    address: res.data.address
                })
            }
        } catch (error) {
            console.error(error)

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
