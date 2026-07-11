import React from "react";
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        try {
            const { data } = await api.post("/auth/login", userData);
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const verifyOtp = async () => {
        try {
            const { data } = await api.post("/auth/verify-otp");
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            return data;

        }
        catch (error) {
            console.error("OTP verification failed:", error);
            throw error;
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };
    return (
        <AuthContext.Provider value={{ user, loading, login, verifyOtp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};