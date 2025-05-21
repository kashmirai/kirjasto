'use client'
import { useUser } from "@/context/UserContext";
import { logoutUser } from "@/utils/auth";
import { supabase } from "@/utils/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";


export default function SelaaPage() {

    const [kirjat, setKirjat] = useState<any[]>([]);

    const haeKirjat = async () => {
        const {data, error} = await supabase.from("books").select('*');
        if (error) {
            console.error("Virhe hakiessa kirjoja:", error.message);
            return;
        }
        setKirjat(data);
    }

    useEffect(() => {
        haeKirjat();
    }, [])

  return (

    <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
    <div className="max-w-full">
    <h1>Hahaa</h1>
    <div className = "grid grid-cols-4 gap-4 pt-10">
    {kirjat.map((kirja, index) => (

        <div className="card bg-base-100 w-48 shadow-sm" key={index}>
        <figure>
            <img
            src={kirja.thumbnail || null}
            alt={kirja.title}
            className="p-2" />
        </figure>
        <div className="card-body">
            <h2 className="card-title">{kirja.title}</h2>
            <p>{kirja.book_id}</p>
        </div>
        </div>

    ))}
    </div>
    </div>
    </div>
    </div>

  );
}
