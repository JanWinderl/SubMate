/**
 * RoleContext - Verwaltet die aktuelle Benutzerrolle (A3: Rollensystem Frontend)
 * 
 * Ermöglicht das Wechseln zwischen Rollen über die UI (z.B. Header-Dropdown).
 * Die Rolle beeinflusst:
 * - Sichtbare Daten und Seiten
 * - Verfügbare Aktionen
 * - API-Anfragen (X-Role Header)
 */
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { UserRole } from "@/types";

interface RoleContextType {
    currentRole: UserRole;
    setRole: (role: UserRole) => void;
    householdSize: number;
    setHouseholdSize: (size: number) => void;
    currentUserId: string;
    setCurrentUserId: (id: string) => void;
    isAdmin: boolean;
    isPremium: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentRole, setCurrentRole] = useState<UserRole>("user");
    const [householdSize, setHouseholdSize] = useState(1);
    const [currentUserId, setCurrentUserId] = useState("");

    const setRole = useCallback((role: UserRole) => {
        setCurrentRole(role);
        // Speichere in localStorage für Persistenz
        localStorage.setItem("submate-role", role);
    }, []);

    const value: RoleContextType = {
        currentRole,
        setRole,
        householdSize,
        setHouseholdSize,
        currentUserId,
        setCurrentUserId,
        isAdmin: currentRole === "admin",
        isPremium: currentRole === "premium" || currentRole === "admin",
    };

    return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error("useRole must be used within a RoleProvider");
    }
    return context;
};
