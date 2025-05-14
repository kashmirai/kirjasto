import { supabase } from "@/supabaseClient";


export default async function Home(): Promise<React.ReactElement> {

  return (

    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Kirjasto</h1>
      <p className="py-6">
        Tervetuloa kirjastoon. Kirjautumalla sisään pääset selaamaan ja lainaamaan teoksia.
      </p>
      <a href="/kirjaudu" className="btn btn-primary">Kirjaudu sisään</a>
    </div>
  </div>
</div>

  );
}
