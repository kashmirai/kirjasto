'use client'
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

interface User {
    id : number,
    first_name : string,
    last_name : string
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    error : string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    login: (userId: number) => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);


export function UserProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const login = async (userId : number) => {
        const { data, error } = await supabase
            .from("members")
            .select("*")
            .eq("member_id", userId)
            .single();

        if (error) {
            console.error("Error fetching user data:", error);
            setError("Käyttäjätunnusta ei löydy.");
            return;
        }

        if (data) {
            setUser({
                id: data.id,
                first_name: data.first_name,
                last_name: data.last_name,
            });
            console.log("User data:", data);
        }
        router.push(`/lainaus/${userId}`);
    }

    const logout = async () => {
        setUser(null);
        router.push("/");
    }

    return (
        <UserContext.Provider value={{user, setUser, error, setError, login, logout}}>
            {children}
        </UserContext.Provider>
    )

}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}