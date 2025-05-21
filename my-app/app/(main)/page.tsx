


export default async function Home(): Promise<React.ReactElement> {

  return (

    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Kirjasto</h1>
      <p className="py-6">
        Tervetuloa kirjastoon. Voit selata, lainata ja palauttaa kirjoja.
      </p>
      <a href="/selaa" className="btn btn-primary mx-2">Selaa kirjoja</a>
      <a href="/lainaus" className="btn btn-primary mx-2">Lainaamaan</a>
      <a href="/profiili" className="btn btn-primary mx-2">Hallinnoi lainojasi</a>
    </div>
  </div>
</div>

  );
}
