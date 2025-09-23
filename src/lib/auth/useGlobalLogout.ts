"use client";

import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export function useGlobalLogout() {
  const router = useRouter();
  const { logout } = usePrivy();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.push("/");
    }
  };

  return handleLogout;
}
