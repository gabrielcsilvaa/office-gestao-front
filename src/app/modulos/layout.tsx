"use client";
import { useSession, SessionProvider } from "next-auth/react";
import "../globals.css";
import { Header, Header2 } from "../../components/header/index";
import Reload from "@/components/reload";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ModulosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ModulosLayoutContent>{children}</ModulosLayoutContent>
    </SessionProvider>
  );
}

function ModulosLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Reload />;
  }

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
