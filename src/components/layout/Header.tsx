import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header>
      {/* ── Logo ── */}
      <Link href="/">AI Spend Audit</Link>

      {/* ── Nav ── */}
      <nav>
        <a href="#how-it-works">How it works</a>
        <Button asChild>
          <a href="#audit">Start Audit</a>
        </Button>
      </nav>
    </header>
  );
}
