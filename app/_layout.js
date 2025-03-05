import { useEffect, useContext } from "react";
import { Slot, router } from "expo-router";
import { AuthContext, AuthProvider } from "../context/authContext";

export const AuthPageNavigate = () => {
    const { authToken, loading } = useContext(AuthContext);
    useEffect(() => {
        if (!authToken && !loading) {
            router.replace("/sign-in");
        }
    }, [authToken, loading]);
    if (loading) {
        return null; 
    }

    return <Slot />;
};

export default function RootLayout() {
    return (
        <AuthProvider>
            <AuthPageNavigate />
        </AuthProvider>
    );
}