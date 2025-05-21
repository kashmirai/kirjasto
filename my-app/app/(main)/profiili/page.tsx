'use client'
import { useUser } from "@/context/UserContext";
import { supabase } from "@/utils/supabase/supabaseClient";
import { RefObject, useEffect, useRef, useState } from "react";


interface Laina {
    book_id: number;
    nimi : string;
    kirjoittaja : string;
    julkaisuvuosi : number;
    tyyppi : string;
    kuva : string;
}


export default function ProfiiliPage() {

    const kirja : RefObject<any> = useRef<HTMLElement | null>(null);
    const [lainat, setLainat] = useState<Laina [] | null>(null);

    const {error, kayttaja, logout, kayttajaTiedot} = useUser();

    useEffect(() => {
    const haeLainaukset = async () => {
    if (!kayttaja?.id) return;

    const { data, error } = await supabase
      .from("transactions")
      .select("*, books(*)")
      .eq("member_id", kayttaja.id);

    if (error) {
      console.error("Virhe lainauksia haettaessa:", error.message);
    } else {
      // Oletetaan, että data on [{ books: { title: string, ... }, ... }]
      const mappedLainat = data.map((laina: any) => ({
        book_id: laina.book_id,
        nimi: laina.books?.title,
        kirjoittaja: laina.books?.authors,
        julkaisuvuosi: laina.books?.published_year,
        tyyppi: laina.books?.categories,
        kuva: laina.books?.thumbnail,
      }));
      setLainat(mappedLainat);
      console.log("Lainaukset:", mappedLainat);
    }
  };

  haeLainaukset();
}, [kayttaja]);


  return (

    <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
    <div className="max-w-lg">

    
    <>
      <h1 className="text-3xl font-bold my-1">Profiilisivu</h1>
      <p>Oma sivu, {kayttajaTiedot?.first_name} {kayttajaTiedot?.last_name}</p>
      <span>

        {lainat?.map((laina, index) => (
          <div key={index}>
            <p><strong>{laina.nimi}</strong></p>

          </div>
        ))}
     
      </span>

    </>

    


    </div>
  </div>
</div>

  );
}
