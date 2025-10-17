"use client";

import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { clearAppStorage } from "@/lib/auth/logoutUtils";

export function useGlobalLogout() {
  const router = useRouter();
  const { logout } = usePrivy();

  const handleLogout = async () => {
    try {
      clearAppStorage();
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.push("/");
    }
  };

  return handleLogout;
}
