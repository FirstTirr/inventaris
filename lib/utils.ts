import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Clear all accessible cookies across likely domains and paths
export function clearAllCookies(options?: {
  knownNames?: string[];
  extraPaths?: string[];
  extraDomains?: string[];
}) {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const now = new Date(0).toUTCString(); // Thu, 01 Jan 1970 00:00:00 GMT

  const hostname = window.location.hostname; // e.g., inv.tefa-bcs.org or 192.168.1.10
  const parts = hostname.split(".");
  const rootDomain = parts.length >= 2 ? `.${parts.slice(-2).join(".")}` : hostname;
  const dotHostname = hostname.startsWith(".") ? hostname : `.${hostname}`;

  const domains = Array.from(
    new Set([
      undefined, // host-only (most reliable for host-only cookies, including IPs)
      hostname,
      dotHostname,
      rootDomain,
      ...(options?.extraDomains ?? []),
    ])
  );

  // Build path variants: always include '/', current path, and common app base paths
  const basePaths = [
    "/",
    "/admin",
    "/guru",
    "/kabeng",
    "/kepsek",
    "/wasapras",
    "/bc",
    "/rpl",
    "/tkj",
    "/dkv",
    "/unathorized",
  ];

  const currentPath = window.location.pathname || "/";
  const currentSegments = currentPath
    .split("/")
    .filter(Boolean);
  const segmentPaths: string[] = [];
  let acc = "";
  for (const seg of currentSegments) {
    acc += `/${seg}`;
    segmentPaths.push(acc);
  }

  const paths = Array.from(
    new Set([
      ...basePaths,
      ...segmentPaths,
      ...(options?.extraPaths ?? []),
    ])
  );

  // Determine cookie names: currently visible + known names to be safe
  const cookiePairs = document.cookie ? document.cookie.split("; ") : [];
  const visibleNames = cookiePairs.map((c) => c.split("=")[0]).filter(Boolean);
  const knownNames = Array.from(
    new Set([
      ...visibleNames,
      "user",
      "token",
      "session",
      "sid",
      "PHPSESSID",
      ...(options?.knownNames ?? []),
    ])
  );

  for (const rawName of knownNames) {
    const name = encodeURIComponent(rawName);
    for (const p of paths) {
      for (const d of domains) {
        try {
          document.cookie = `${name}=; expires=${now}; max-age=0; path=${p}${d ? `; domain=${d}` : ""}`;
        } catch {}
      }
    }
  }
}
