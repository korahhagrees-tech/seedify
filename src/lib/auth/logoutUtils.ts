"use client";

// Clear app storage and cookies to avoid stale auth/wallet state after logout
export function clearAppStorage(): void {
  try {
    if (typeof window !== "undefined") {
      // Clear local/session storage
      try { window.localStorage.clear(); } catch { }
      try { window.sessionStorage.clear(); } catch { }

      // Delete all cookies for current domain
      try {
        const cookies = document.cookie.split(";");
        for (const c of cookies) {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
          if (!name) continue;
          // Expire cookie for current path and root path
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
          // Also try without path (best effort)
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        }
      } catch { }
    }
  } catch (err) {
    // Swallow any errors to avoid blocking logout
    console.warn("Failed to clear app storage:", err);
  }
}


