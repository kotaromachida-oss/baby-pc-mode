"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const CELEBRATIONS = [
  "わあ!",
  "すごい!",
  "きらきら!",
  "ぽん!",
  "たのしい!",
  "にこにこ!",
  "ぱちぱち!",
  "やった!",
];

const SHAPES = ["●", "▲", "■", "★", "◆", "✿"];

const SPECIAL_KEY_LABELS: Record<string, string> = {
  Escape: "esc",
  Esc: "esc",
  " ": "space",
  Spacebar: "space",
  Enter: "enter",
  Tab: "tab",
  Shift: "shift",
  Control: "ctrl",
  Alt: "alt",
  Meta: "win",
  OS: "win",
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Backspace: "back",
  Delete: "delete",
  CapsLock: "caps",
  Home: "home",
  End: "end",
  PageUp: "page up",
  PageDown: "page down",
  Insert: "insert",
  ContextMenu: "menu",
};

type Burst = {
  id: number;
  x: number;
  y: number;
  hue: number;
  label: string;
  shape: string;
};

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatKeyLabel(key: string) {
  if (SPECIAL_KEY_LABELS[key]) {
    return SPECIAL_KEY_LABELS[key];
  }

  if (/^F\d{1,2}$/.test(key)) {
    return key.toLowerCase();
  }

  if (key.length === 1) {
    return key === " " ? "space" : key.toLowerCase();
  }

  return "tap";
}

export default function PlayPage() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [pressedKey, setPressedKey] = useState("space");
  const [cheerCount, setCheerCount] = useState(0);
  const [gradientSeed, setGradientSeed] = useState(32);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function enterFullscreen() {
      if (document.fullscreenElement || !document.documentElement.requestFullscreen) {
        return;
      }

      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Browsers may block fullscreen; the play mode still works without it.
      }
    }

    function createBurst() {
      const nextBurst: Burst = {
        id: Date.now() + Math.random(),
        x: randomBetween(12, 88),
        y: randomBetween(16, 82),
        hue: randomBetween(0, 360),
        label: pickRandom(CELEBRATIONS),
        shape: pickRandom(SHAPES),
      };

      setCheerCount((count) => count + 1);
      setGradientSeed(randomBetween(0, 360));
      setBursts((current) => [...current.slice(-10), nextBurst]);
    }

    void enterFullscreen();
    stageRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKey(formatKeyLabel(event.key));
      createBurst();

      if (event.key !== "Meta" && event.key !== "OS") {
        event.preventDefault();
      }

      if (event.key === "Escape") {
        void enterFullscreen();
      }
    };

    const handlePointerDown = () => {
      stageRef.current?.focus();
      createBurst();
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        stageRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (bursts.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setBursts((current) => current.slice(1));
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [bursts]);

  const backgroundStyle = useMemo(
    () =>
      ({
        "--hero-a": `hsl(${gradientSeed} 90% 64%)`,
        "--hero-b": `hsl(${(gradientSeed + 70) % 360} 95% 72%)`,
        "--hero-c": `hsl(${(gradientSeed + 170) % 360} 86% 68%)`,
      }) as React.CSSProperties,
    [gradientSeed],
  );

  return (
    <main className="page page--baby" style={backgroundStyle}>
      <section className="shell">
        <div className="play-shell">
          <div className="play-topbar">
            <div className="status-pill">Baby mode on</div>
            <Link className="exit-button exit-button--link" href="/">
              終了
            </Link>
          </div>

          <div className="play-stage" ref={stageRef} tabIndex={-1}>
            <p className="play-caption">esc でも enter でも たのしい</p>
            <div className="big-key">{pressedKey}</div>
            <div className="mini-stats">
              <div>
                <span>よろこび回数</span>
                <strong>{cheerCount}</strong>
              </div>
              <div>
                <span>いまはだれのターン?</span>
                <strong>こども</strong>
              </div>
            </div>
            {bursts.map((burst) => (
              <div
                key={burst.id}
                className="burst"
                style={{
                  left: `${burst.x}%`,
                  top: `${burst.y}%`,
                  color: `hsl(${burst.hue} 90% 45%)`,
                }}
              >
                <span>{burst.shape}</span>
                <span>{burst.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
