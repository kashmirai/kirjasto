'use client'

import { supabase } from "@/utils/supabase/supabaseClient";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

interface Kayttajatiedot {
    first_name : string;
    last_name : string,
    phone : string;
    email : string;
}

interface UserContextType {
    kayttaja: User | null;
    setKayttaja: React.Dispatch<React.SetStateAction<User | null>>;
    error : string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    kayttajaTiedot: Kayttajatiedot | null; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);


export function UserProvider({ children }: { children: React.ReactNode }) {

    const [kayttaja, setKayttaja] = useState<User | null >(null);
    const [kayttajaTiedot, setKayttajaTiedot] = useState<Kayttajatiedot | null>(null);
    const [error, setError] = useState<string | null>(null);

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
        const { data: kayttajaData, error: kayttajaError } = await supabase
            .from("members")
            .select("*")
            .eq("member_id", sessio.user.id)
            .single();
        
        setKayttajaTiedot(kayttajaData);

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
        <UserContext.Provider value={{kayttaja, setKayttaja, error, setError, kayttajaTiedot}}>
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