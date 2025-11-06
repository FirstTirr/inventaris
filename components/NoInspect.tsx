"use client";

import React, { useEffect, useState } from "react";

/**
 * NoInspect
 * - Prevents right click and common devtools shortcuts (F12, Ctrl+Shift+I/J, Ctrl+U)
 * - Detects a basic devtools open heuristic (outer- vs inner- window size)
 * - Shows a full-screen overlay when a devtools is detected or a blocked shortcut is used
 *
 * IMPORTANT: This cannot reliably stop a determined developer. It's only a
 * light deterrent and may hurt accessibility. See comments in README or
 * below for secure alternatives.
 */
export default function NoInspect() {
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    // Disable right-click
    const onContext = (e: MouseEvent) => {
      e.preventDefault();
      setDetected(true);
    };

    // Disable common devtools shortcuts
    const onKey = (e: KeyboardEvent) => {
      const key = e.key || "";
      // F12
      if ((e as KeyboardEvent).keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        setDetected(true);
        return;
      }

      // Ctrl+Shift+I / Ctrl+Shift+J
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (key === "I" || key === "i" || key === "J" || key === "j")
      ) {
        e.preventDefault();
        e.stopPropagation();
        setDetected(true);
        return;
      }

      // Ctrl+U (view source)
      if (e.ctrlKey && (key === "U" || key === "u")) {
        e.preventDefault();
        e.stopPropagation();
        setDetected(true);
        return;
      }
    };

    // Heuristic devtools detection using outer/inner window size differences
    let last = false;
    const checkDevtools = () => {
      try {
        const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
        const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
        // threshold tuned for common browser chrome sizes; not reliable on all devices
        const open = widthDiff > 160 || heightDiff > 160;
        if (open && !last) setDetected(true);
        last = open;
      } catch {
        // ignore
      }
    };

    document.addEventListener("contextmenu", onContext);
    document.addEventListener("keydown", onKey);
    const iv = setInterval(checkDevtools, 800);

    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("keydown", onKey);
      clearInterval(iv);
    };
  }, []);

  if (!detected) return null;

  return (
    <div
      role="presentation"
      aria-hidden={false}
      className="fixed inset-0 z-[9999] bg-white/95 dark:bg-gray-900/95 flex items-center justify-center p-6"
      style={{ pointerEvents: "auto" }}
    >
      <div className="max-w-xl text-center">
        <h2 className="text-2xl font-semibold mb-2">Akses dibatasi</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Developer tools atau tindakan inspeksi terdeteksi. Tutup developer
          tools atau muat ulang halaman untuk melanjutkan.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Muat ulang
          </button>
          <button
            className="px-4 py-2 border rounded-md"
            onClick={() => (window.location.href = "/")}
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
