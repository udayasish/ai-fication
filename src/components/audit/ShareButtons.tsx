"use client";

import { useState } from "react";

interface Props {
  totalSavings: number;
  slug: string;
}

export default function ShareButtons({ totalSavings, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const pageUrl   = `${process.env.NEXT_PUBLIC_APP_URL}/audit/${slug}`;
  const tweetText = totalSavings > 0
    ? `Just audited my team's AI spend — found $${totalSavings.toFixed(0)}/mo in savings 🎉\n\nRun yours free →`
    : `Just audited my team's AI spend. Turns out we're already spending well ✅\n\nRun yours free →`;

  const twitterUrl  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(pageUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;

  // Copies the audit URL to clipboard and shows "Copied!" feedback for 2 seconds.
  async function handleCopy() {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-muted-foreground">Share:</span>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-medium text-foreground border border-border rounded-md px-3 py-1.5 hover:bg-background2 transition-colors"
      >
        𝕏 Twitter
      </a>

      <a
        href={linkedInUrl}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-medium text-foreground border border-border rounded-md px-3 py-1.5 hover:bg-background2 transition-colors"
      >
        in LinkedIn
      </a>

      <button
        onClick={handleCopy}
        className="text-sm font-medium text-foreground border border-border rounded-md px-3 py-1.5 hover:bg-background2 transition-colors"
      >
        {copied ? "Copied! ✓" : "Copy Link"}
      </button>
    </div>
  );
}
