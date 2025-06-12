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
      if (!token) router.push("/");
    }
  }, [router]);

  return (
    <div className="flex h-screen antialiased">
      <div>
        <Header />
      </div>

      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex-shrink-0 relative z-20">
          <Header2 />
        </div>

        <main className="flex-grow overflow-auto">{children}</main>
      </div>
    </div>
  );
}
