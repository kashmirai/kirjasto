'use client'
import { supabase } from "@/supabaseClient";
import { useParams } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";

interface User {
    first_name: string;
    last_name: string;
    member_id: number;
}
interface Laina {
    book_id: number;
    nimi : string;
    kirjoittaja : string;
    julkaisuvuosi : number;
    tyyppi : string;
}


export default function KayttajaPage() {

    const kirja : RefObject<any> = useRef<HTMLElement | null>(null);
    const params = useParams();
    const kayttajaId = params?.kayttaja;
    const [userData, setUserData] = useState<User | null >(null);
    const [error, setError] = useState<string | null>(null);
    const [lainat, setLainat] = useState<Laina [] | null>(null);

    const lainaa = async () => {

        const kirjaId = kirja.current.value;

        const {data, error} = await supabase.from("books").select('*').eq('book_id', kirjaId).maybeSingle();

        const uusiLaina: Laina = {
            book_id: kirjaId,
            nimi: data?.title,
            kirjoittaja: data?.kirjoittaja,
            julkaisuvuosi: data?.julkaisuvuosi,
            tyyppi: data?.tyyppi,
        }
        if (!error) {
            setLainat([...(lainat ?? []), uusiLaina]);
        }

        if (!kirjaId) {
            setError("Anna kirjan ID.");
            return;
        }
    }

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
      <h1 className="text-3xl font-bold">Lainaus</h1>
      <p>Tervetuloa lainaamaan, {userData?.first_name} {userData?.last_name}!</p>
      <input ref={kirja} type="text" className="input" placeholder="Kirjan ID"></input>
      <button className="btn btn-primary my-5" onClick={lainaa}>Lainaa</button>
    </>

    }

    {lainat && lainat.length > 0 && (
  <div className="mt-5">
    <h2 className="text-xl font-semibold">Lainatut kirjat:</h2>
    <ul className="text-left list-disc list-inside">
      {lainat.map((laina, index) => (
        <li key={index}>
          {laina.nimi}
        </li>
      ))}
    </ul>
  </div>
)}


    </div>
  </div>
</div>

  );
}
