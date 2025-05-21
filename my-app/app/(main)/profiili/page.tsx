'use client'
import { useUser } from "@/context/UserContext";
import { supabase } from "@/utils/supabase/supabaseClient";
import { RefObject, useEffect, useRef, useState } from "react";


interface Laina {
    book_id: number;
    transaction_id : number;
    nimi : string;
    kirjoittaja : string;
    julkaisuvuosi : number;
    tyyppi : string;
    kuva : string;
    erapaiva : string;
}


export default function ProfiiliPage() {

    const kirja : RefObject<any> = useRef<HTMLElement | null>(null);
    const [lainat, setLainat] = useState<Laina [] | null>(null);

    const {error, kayttaja,  kayttajaTiedot} = useUser();

    const uusiLaina = async (transaction_id : any) => {

      const {data : hakuData, error : hakuError} = await supabase.from("transactions").select("due_date").eq("transaction_id", transaction_id).single();
      if (hakuError) {
        console.error("Virhe hakiessa due datea:", hakuError.message);
        return;
      } 

        const dueDate = new Date(hakuData.due_date);
        dueDate.setDate(dueDate.getDate() + 30);
        const uusiDueDate = dueDate.toISOString(); 

      const {data, error} = await supabase.from("transactions").update({
        due_date: uusiDueDate
      }).eq("transaction_id", transaction_id);
      haeLainaukset();
      
    }

    const palauta = async (transaction_id : any) => {
        console.log("Palautetaan kirja id:llä", transaction_id);
        const {data,error} = await supabase.from("transactions").delete().eq("transaction_id", transaction_id);
        if (error) {
            console.error("Virhe palautettaessa kirjaa:", error.message);
        } else {
            setLainat(prevLainat => prevLainat ? prevLainat.filter(laina => laina.transaction_id !== transaction_id) : null);
        }
    }

    const haeLainaukset = async () => {
    if (!kayttaja?.id) return;

    const { data, error } = await supabase
      .from("transactions")
      .select("*, books(*)")
      .eq("member_id", kayttaja.id).order("due_date", { ascending: true });

    if (error) {
      console.error("Virhe lainauksia haettaessa:", error.message);
    } else {
      const mappedLainat = data.map((laina: any) => ({
        book_id: laina.book_id,
        transaction_id : laina.transaction_id,
        nimi: laina.books?.title,
        kirjoittaja: laina.books?.authors,
        julkaisuvuosi: laina.books?.published_year,
        tyyppi: laina.books?.categories,
        kuva: laina.books?.thumbnail,
        erapaiva : new Date(laina.due_date).toLocaleDateString("fi-FI", {
            day: "2-digit",
            month: "2-digit",   
            year: "numeric",
        })
      }));
      setLainat(mappedLainat);
    }
  };

    useEffect(() => {
    
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

        <ul className="list bg-base-100 rounded-box shadow-md w-full">
  
  <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Omat lainat</li>

  
        {lainat?.map((laina, index) => (
    <li key = {index} className="list-row">
    <div><img className="w-12" src={laina.kuva} /></div>
    <div>
      <div>{laina.nimi}</div>
      <div className="text-xs font-semibold opacity-60">Eräpäivä {laina.erapaiva} </div>
    </div>
    <button className="btn btn-ghost" onClick={() => {uusiLaina(laina.transaction_id)}}>
     Uusi laina
    </button>
    <button className="btn btn-ghost" onClick={() => {palauta(laina.transaction_id)}}>
      Palauta
    </button>
  </li>
        ))}
  

  
</ul>

     
      </span>

    </>

    


    </div>
  </div>
</div>

  );
}
