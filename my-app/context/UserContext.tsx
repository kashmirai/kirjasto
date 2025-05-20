'use client'

import { supabase } from "@/utils/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";



interface UserContextType {
    kayttaja: User | null;
    setKayttaja: React.Dispatch<React.SetStateAction<User | null>>;
    error : string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);


export function UserProvider({ children }: { children: React.ReactNode }) {

    const [kayttaja, setKayttaja] = useState<User | null >(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const logout = async () => {
        await supabase.auth.signOut(); 
        window.location.href = "/kirjaudu"
    }

    useEffect(() => {
    const haeKayttaja = async () => {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
        console.warn("Virhe sessiossa:", error.message);
        setKayttaja(null);
        return;
        }

        const sessio = data?.session;

        if (sessio?.user) {
        setKayttaja(sessio.user);
        } else {
        setKayttaja(null);
        }
    };

    haeKayttaja();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setKayttaja(session?.user ?? null);
    });

    return () => {
        subscription.unsubscribe();
    };
    }, []);

    

    return (
        <UserContext.Provider value={{kayttaja, setKayttaja, error, setError, logout}}>
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