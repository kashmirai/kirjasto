'use client'
import { supabase } from "@/supabaseClient";
import { RefObject, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";


export default function Kirjaudu() {

    const kayttaja : RefObject<any> = useRef<HTMLElement | null>(null);
    const router = useRouter();

    const {login} = useUser();

    const kirjaudu = async () => {

        const kayttajaId = kayttaja.current.value;
        await login(kayttajaId);
    }

  return (

    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Kirjaudu page</h1>
      <p className="py-6">
        Tervetuloa kirjastoon. Kirjautumalla sisään pääset selaamaan ja lainaamaan teoksia.
      </p>

        <input ref={kayttaja} type="text" className="input" placeholder="Kirjastokortin numero"></input>
        <button className="btn btn-primary my-5 mx-2" onClick={kirjaudu}>Kirjaudu sisään</button>
        <a href="/" className="btn">Palaa etusivulle</a>

    </div>
  </div>
</div>

  );
}
