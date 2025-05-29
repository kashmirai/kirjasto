'use client'
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/utils/auth";


export default function Kirjaudu() {

    const router = useRouter();
    const [tunnus, setTunnus] = useState<string>("");
    const [salasana, setSalasana] = useState<string>("");
    const [kirjautumisVirhe, setKirjautumisVirhe] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent) : Promise<void> => {

      e.preventDefault();

      const {data, error} = await loginUser(tunnus, salasana);
      
      if (!error) {
        router.push("/");
      } else {
        setKirjautumisVirhe(true);
      }

    }

  return (

    <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
    <div className="max-w-md">

      <h1 className="text-5xl font-bold">Kirjaudu</h1>
      <p className="py-6">
        Tervetuloa kirjastoon. Kirjautumalla sisään pääset selaamaan ja lainaamaan teoksia.
      </p>
      <p className="text-xs">Testikäyttäjä : uusi@testi.fi, testi123</p>

        <form className="flex flex-col items-center border-2 border-base-300 rounded-lg p-5" onSubmit={handleLogin}> 
        <input name="tunnus" type="text" className="input" placeholder="Sähköpostiosoite" onChange={(e) => setTunnus(e.target.value)} required></input>
        <input name="salasana" type="password" className="input" placeholder="Salasana" onChange={(e) => setSalasana(e.target.value)} required></input>

        {kirjautumisVirhe && 
          <p className="text-error text-xs">Väärä käyttäjätunnus tai salasana</p>
        }

        <button className="btn btn-primary my-5 mx-2" type="submit">Kirjaudu sisään</button>
        <a href="/rekisteroidy" className="btn mx-2" >Rekisteröidy</a>
        </form>
    </div>
  </div>
</div>

  );
}
