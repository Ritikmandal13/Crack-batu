"use client";
import { useAuth } from "@/hooks/use-auth";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-grey">
        <div className="spinner text-orange text-2xl">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
} 