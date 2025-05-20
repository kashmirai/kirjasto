'use client'
import { RefObject, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/utils/supabase/supabaseClient";



export default function Kirjaudu() {

  const lomakeRef: React.RefObject<any> = useRef<HTMLFormElement>(null);

    const router = useRouter();

    const rekisteroidy = async (e: React.FormEvent) : Promise<void> => {

    e.preventDefault();
    
    const {data, error} = await supabase.auth.signUp({
    email: lomakeRef.current.tunnus.value,
    password: lomakeRef.current.salasana.value,
    options : {
        data : {
            first_name: lomakeRef.current.etunimi.value,
            last_name: lomakeRef.current.sukunimi.value
        }
    }
    });

    if (!error) {
    router.push("/");
    console.log("Rekisteröityminen onnistui");
    } else {
    console.error("Rekisteröityminen epäonnistui", error);
    }

}


  return (

    <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
    <div className="max-w-md">

      <h1 className="text-5xl font-bold">Rekisteröidy</h1>
      <p className="py-6">
        Tervetuloa kirjastoon. Rekisteröitymällä pääset käyttämään kirjaston palveluita
      </p>

        <form ref={lomakeRef} className="flex flex-col items-center border-2 border-base-300 rounded-lg p-5">
        <input name="etunimi" type="text" className="input" placeholder="Etunimi"></input>
        <input name="sukunimi" type="text" className="input" placeholder="Sukunimi"></input> 
        <input name="tunnus" type="text" className="input" placeholder="Sähköpostiosoite"></input>
        <input name="salasana" type="password" className="input" placeholder="Salasana"></input>
        <input name="salasana2" type="password" className="input" placeholder="Vahvista salasana"></input>
        <a href="/rekisteroidy" className="btn btn-primary my-5 mx-2" onClick={rekisteroidy} >Luo tili</a>
        <a href="/kirjaudu" className="btn mx-2" >Etusivulle</a>
        </form>
    </div>
  </div>
</div>

  );
}
