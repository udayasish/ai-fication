import { FOOTER } from "@/lib/constants/landingPage";

export default function Footer() {
  return (
    <footer className="w-full bg-background1 border-t border-border py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* ── Copyright ── */}
        <p className="text-sm text-muted-foreground">{FOOTER.copyright}</p>

        {/* ── Powered by ── */}
        <p className="text-sm text-muted-foreground">
          {FOOTER.poweredByText}{" "}
          <a
            href={FOOTER.poweredByHref}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:opacity-80 transition-opacity"
          >
            {FOOTER.poweredByLabel}
          </a>
        </p>
      </div>
    </footer>
  );
}
