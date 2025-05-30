'use client'
import { useUser } from "@/context/UserContext";
import { logoutUser } from "@/utils/auth";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";


interface Laina {
    book_id: number;
    nimi : string;
    kirjoittaja : string;
    julkaisuvuosi : number;
    tyyppi : string;
    kuva : string;
}


export default function KayttajaPage() {

    const kirja : RefObject<any> = useRef<HTMLElement | null>(null);
    const [lainat, setLainat] = useState<Laina [] | null>(null);

    const {kayttaja, kayttajaTiedot} = useUser();

    const lisaa = async () => {

        const kirjaId = kirja.current.value;

        const {data : lainaData, error : lainaError} = await supabase.from("transactions").select('*').eq('book_id', kirjaId).eq('member_id', kayttaja?.id).maybeSingle();

        const {data, error} = await supabase.from("books").select('*').eq('book_id', kirjaId).maybeSingle();

        const uusiLaina: Laina = {
            book_id: kirjaId,
            nimi: data?.title,
            kirjoittaja: data?.authors,
            julkaisuvuosi: data?.published_year,
            tyyppi: data?.categories,
            kuva : data?.thumbnail
        }

        if (lainaData) {
          alert("Olet jo lainannut tämän kirjan.");
          kirja.current.value = "";
          return;
        }

        if (lainat?.some(laina => laina.book_id === kirjaId)) {
          alert ("Olet jo valinnut tämän kirjan.");
          kirja.current.value = "";
          return;
        }

        if (!error) {
            setLainat([...(lainat ?? []), uusiLaina]);
            kirja.current.value = "";
        }

        if (!kirjaId) {
            alert("Anna kirjan ID.");
            return;
        }


    }

    const poistaLaina = async (lainaId: number) => {
      setLainat(prevLainat => prevLainat!.filter(laina => laina.book_id !== lainaId));
    }

    const lainaa = async () => {

      const lainattavatKirjat = lainat?.map(laina => ({
        book_id :  laina.book_id,
        title : laina.nimi,
        member_id : kayttaja?.id,
        issue_date : new Date().toISOString(),
        due_date : new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
      }))

      if (!lainattavatKirjat || lainattavatKirjat.length === 0) {
        alert("Ei lainattavia kirjoja. Lisää vähintään yksi kirja.");
        return;
      }

      const {data, error} = await supabase.from("transactions").insert(lainattavatKirjat);
      if (error) {
        console.error("Virhe lainatessa:", error);
      } else {
        console.log("Lainaus onnistui:", data);
        setLainat([]);
      }
    }
    

  return (

    <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
    <div className="max-w-lg">

    <>
      <h1 className="text-3xl font-bold my-1">Lainaus</h1>
      <p>Tervetuloa lainaamaan, {kayttajaTiedot?.first_name} {kayttajaTiedot?.last_name}!</p>
      <span className="flex flex-row items-center">
      <input ref={kirja} type="text" className="input my-4" placeholder="Kirjan ID"></input>
      <button className="btn" onClick={lisaa}>Lisää</button>
      </span>

      {lainat && lainat.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xl font-semibold mb-2">Lainattavat kirjat:</h2>
              <ul className="text-left list-disc list-inside">
                {lainat.map((laina, index) => (
                  <li key={index} style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <strong>{laina.nimi}</strong>({laina.julkaisuvuosi}) - {laina.kirjoittaja}  
                    <button onClick={() => poistaLaina(laina.book_id)} style={{cursor: "pointer", marginLeft: "10px"}}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z"/></svg>
                    </button>

                  </li>
                ))}
              </ul>
            </div>
    )}

      <button className="btn btn-primary mx-2" onClick={lainaa}>Lainaa</button>
      <a href="/" className="btn">Etusivulle</a>
    </>

    


    </div>
  </div>
</div>

  );
}
