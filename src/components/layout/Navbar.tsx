"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHomeActive = pathname === "/";
  const isAuditActive = pathname === "/audit";

  return (
    <nav className="flex items-center gap-6">
      {/* ── Anchor link — no active state (home page only) ── */}
      <Link
        href="/#how-it-works"
        className={isHomeActive ? "text-base font-bold text-primary" : "text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"}
      >
        How it works
      </Link>

      {/* ── Route link — highlighted when on /audit ── */}
      <Link
        href="/audit"
        className={isAuditActive ? "text-base font-bold text-primary" : "text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"}
      >
        Start Audit
      </Link>
    </nav>
  );
}
