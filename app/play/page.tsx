"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

export default function PlayPage() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [pressedKey, setPressedKey] = useState("space");
  const [cheerCount, setCheerCount] = useState(0);
  const [gradientSeed, setGradientSeed] = useState(32);

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

    void enterFullscreen();

    const createBurst = () => {
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
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      setPressedKey(event.key === " " ? "space" : event.key.length === 1 ? event.key : "tap");
      createBurst();
    };

    const handlePointerDown = () => {
      createBurst();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
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

          <div className="play-stage">
            <p className="play-caption">どのキーでも、たのしい</p>
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
