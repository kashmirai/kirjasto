import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from "@/context/UserContext";


export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <main>
        {children}
    </main>

  );
}
