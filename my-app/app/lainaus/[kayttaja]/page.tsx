'use client'
import { supabase } from "@/supabaseClient";
import { useParams } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";

interface User {
    first_name: string;
    last_name: string;
    member_id: number;
}


export default function KayttajaPage() {

    const kayttaja : RefObject<any> = useRef<HTMLElement | null>(null);
    const params = useParams();
    const kayttajaId = params?.kayttaja;
    const [userData, setUserData] = useState<User | null >(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        
        const { data, error } = await supabase.from("members").select('*').eq('member_id', kayttajaId).maybeSingle();
       
        if (error) {
            console.error("Supabase error:", error.message);
            setError("Järjestelmävirhe haettaessa tietoja.");
            return;
        }

        if (!data) {
            setError(`Käyttäjää ID:llä ${kayttajaId} ei löytynyt.`);
            return;
        }

        setUserData(data as User);
    }

        useEffect(() => {
            fetchData()
        }, [kayttajaId]);


  return (

    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">

    {error &&
    <>
    <p className="text-red-500">{error}</p>
    <a href="/" className="btn btn-primary">Palaa etusivulle</a>
    </>
    }


    {userData && 
    <>
      <h1 className="text-5xl font-bold">Kayttaja page</h1>
      <p>Tervetuloa lainaamaan, {userData?.first_name} {userData?.last_name}!</p>
    </>

    }


    </div>
  </div>
</div>

  );
}
