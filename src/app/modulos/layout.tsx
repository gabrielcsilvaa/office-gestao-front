"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import { Header, Header2 } from "../../components/header/index";

export default function ModulosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const isLoginPage = window.location.pathname === "/";

    if (!isLoginPage) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      }
    }
  }, [router]);

  return (
    <div className="flex h-screen antialiased">
      <div>
        <Header />
      </div>
      <div className="w-full">
        <Header2 />
        {children}
      </div>
    </div>
  );
}
