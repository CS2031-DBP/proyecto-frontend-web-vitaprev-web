import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { token } = useAuth();

    if (!token) {
        // user is not authenticated
        return <Navigate to="/auth/signin" />;
    }

    // user is authenticated show whatever is nested
    return <>{children}</>;;
};