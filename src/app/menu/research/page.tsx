"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Loading from '@/ui/loading';
import { AccessButton } from '@/components/buttons/AccessButton';

export interface GridItem {
  title: string;
  image: string;
  link: string;
  category: string;
}

// Memindahkan fungsi isActive ke luar komponen
const isActive = (currentPath: string | null, path: string) => currentPath === path;

// Mengubah ReusableGrid menjadi komponen arrow function
const ReusableGrid = ({ data }: { data: GridItem[] }) => {
  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-white/[0.02] via-black/90 to-black/95 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform cursor-pointer border border-gray-800/40"
            >
              <img
                 src={`/images/${item.image}`}
                 alt={item.title}
                className="w-full h-auto object-contain" // Ganti dari 'object-cover' ke 'object-contain' dan 'h-auto'
               />

              <div className="p-4">
                <span className="text-xs font-semibold text-blue-400">
                  {item.category}
                </span>
                <h3 className="font-semibold mt-1 text-white">{item.title}</h3>
                <button
                  onClick={() => window.open(item.link, "_blank")}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <span>View Research</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const researchData: GridItem[] = [
    { 
        title: "Belum ada research dar Ternak Uang", 
        image: "none.png", 
        link: "#",
        category: "research"
    },
      
];

export default function ResearchPage() {
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch("/api/verify-role", {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          
          if (!response.ok && response.status === 429) {
            setTimeout(checkAccess, 5000);
            return;
          }

          if (response.ok) {
            setHasAccess(true);
          } else {
            setHasAccess(false);
          }
        } catch (error) {
          console.error("Error verifying role:", error);
          setHasAccess(false);
        }
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    };

    if (status === "authenticated") {
      checkAccess();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setHasAccess(false);
    }
  }, [session, status]);

  if (loading || status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="auth-box bg-zinc-950/90 p-8 rounded-2xl backdrop-blur-md max-w-md w-full border border-zinc-900">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Login untuk Akses Penuh
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Silahkan login untuk mengakses semua fitur premium kami:
            <ul className="mt-2 space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">•</span> Modul pembelajaran crypto
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span> Research dan analisis pasar
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">•</span> Komunitas ekslusif
              </li>
            </ul>
          </p>
          <button
            onClick={() => signIn("discord")}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <i className="fas fa-lock-open mr-2"></i> Masuk dengan Discord
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="auth-box bg-zinc-950/90 p-8 rounded-2xl backdrop-blur-md max-w-md w-full border border-zinc-900">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 mb-6">
            Akses Ditolak
          </h2>
          <p className="text-gray-400 mb-6">
            Anda tidak memiliki akses ke halaman ini. Silakan hubungi admin untuk informasi lebih lanjut.
          </p>
          <div className="flex gap-4">
            <AccessButton />
            <button
              onClick={() => signOut()}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Keluar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          RESEARCH
          <div className="mt-2 w-16 h-1 mx-auto bg-purple-500 rounded" />
        </h1>
        <ReusableGrid data={researchData} />
      </div>
    </div>
  );
}
