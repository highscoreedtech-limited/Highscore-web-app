import React from "react";

// Renders text with any URLs (http(s):// or www.) turned into clickable links.
const URL_RE = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

export default function Linkified({ text, className }: { text: string; className?: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (URL_RE.test(part)) {
          URL_RE.lastIndex = 0; // reset (global regex is stateful in .test)
          const href = part.startsWith("http") ? part : `https://${part}`;
          // Strip a trailing period/comma so it isn't swallowed into the link.
          const trailing = /[.,)]$/.test(part) ? part.slice(-1) : "";
          const url = trailing ? part.slice(0, -1) : part;
          const cleanHref = trailing ? href.slice(0, -1) : href;
          return (
            <React.Fragment key={i}>
              <a href={cleanHref} target="_blank" rel="noreferrer" className={className ?? "text-hs-blue underline underline-offset-2 hover:opacity-80"}>
                {url}
              </a>
              {trailing}
            </React.Fragment>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
