'use client'
import { RefObject, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/utils/supabase/supabaseClient";



export default function Kirjaudu() {

  const lomakeRef: React.RefObject<any> = useRef<HTMLFormElement>(null);

    const router = useRouter();

    const kirjaudu = async (e: React.FormEvent) : Promise<void> => {

      e.preventDefault();

      const supabase = await createClient()
      const {data, error} = await supabase.auth.signInWithPassword({
        email: lomakeRef.current.tunnus.value,
        password: lomakeRef.current.salasana.value
      });

      if (!error) {
        router.push("/");
        console.log("Kirjautuminen onnistui");
      } else {
        console.error("Kirjautuminen epäonnistui", error);
      }

      console.log(data);
      console.log(error);
    }

  return (

    <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
    <div className="max-w-md">

      <h1 className="text-5xl font-bold">Kirjaudu</h1>
      <p className="py-6">
        Tervetuloa kirjastoon. Kirjautumalla sisään pääset selaamaan ja lainaamaan teoksia.
      </p>

        <form ref={lomakeRef} className="flex flex-col items-center border-2 border-base-300 rounded-lg p-5"> 
        <input name="tunnus" type="text" className="input" placeholder="Sähköpostiosoite"></input>
        <input name="salasana" type="password" className="input" placeholder="Salasana"></input>
        <button className="btn btn-primary my-5 mx-2" onClick={kirjaudu}>Kirjaudu sisään</button>
        <a href="/" className="btn">Palaa etusivulle</a>
        </form>
    </div>
  </div>
</div>

  );
}
