import { useEffect, useRef, useState } from "react";
import styles from "./Typewriter.module.css";

const ORIGINAL = `Agiliza el trabajo de tu empresa\ncon <span style="color: orangered">AsCont</span>`;
const TYPING_SPEED = 80;
const PAUSE_AFTER = 1600;

type Token = { type: "char" | "tag"; value: string };

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  const tagRegex = /<\/?[^>]+>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      for (const ch of html.slice(lastIndex, match.index)) {
        tokens.push({ type: "char", value: ch });
      }
    }
    tokens.push({ type: "tag", value: match[0] });
    lastIndex = tagRegex.lastIndex;
  }
  if (lastIndex < html.length) {
    for (const ch of html.slice(lastIndex)) {
      tokens.push({ type: "char", value: ch });
    }
  }
  return tokens;
}

export function Typewriter() {
  const ref = useRef<HTMLSpanElement>(null);
  const [html, setHtml] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const withBr = ORIGINAL.replace(/\n/g, "<br>");
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reduce) {
          setHtml(withBr);
          setShowCursor(false);
          return;
        }

        const tokens = tokenize(withBr);
        let i = 0;
        let acc = "";

        const step = () => {
          if (i >= tokens.length) {
            window.setTimeout(() => setShowCursor(false), PAUSE_AFTER);
            return;
          }
          const t = tokens[i++];
          acc += t.value;
          setHtml(acc);
          if (t.type === "tag") {
            step();
          } else {
            window.setTimeout(step, TYPING_SPEED);
          }
        };
        step();
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`${styles.typeTarget} ${showCursor ? styles.cursor : ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
