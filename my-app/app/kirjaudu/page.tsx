'use client'
import { supabase } from "@/supabaseClient";
import { RefObject, useRef } from "react";


export default function Kirjaudu() {

    const kayttaja : RefObject<any> = useRef<HTMLElement | null>(null);

    const kirjaudu = () : void => {

        alert(kayttaja.current.value)
        console.log(kayttaja.current.value)
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
        <button className="btn btn-primary my-5" onClick={kirjaudu}>Kirjaudu sisään</button>

    </div>
  </div>
</div>

  );
}
