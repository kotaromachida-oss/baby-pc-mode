"use client";

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

export default function Home() {
  const [babyMode, setBabyMode] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [pressedKey, setPressedKey] = useState("space");
  const [cheerCount, setCheerCount] = useState(0);
  const [gradientSeed, setGradientSeed] = useState(32);

  useEffect(() => {
    if (!babyMode) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();

      const label =
        event.key === " " ? "space" : event.key.length === 1 ? event.key : "tap";
      const newBurst: Burst = {
        id: Date.now() + Math.random(),
        x: randomBetween(12, 88),
        y: randomBetween(16, 82),
        hue: randomBetween(0, 360),
        label: pickRandom(CELEBRATIONS),
        shape: pickRandom(SHAPES),
      };

      setPressedKey(label);
      setCheerCount((count) => count + 1);
      setGradientSeed(randomBetween(0, 360));
      setBursts((current) => [...current.slice(-10), newBurst]);
    };

    const handlePointerDown = () => {
      const newBurst: Burst = {
        id: Date.now() + Math.random(),
        x: randomBetween(15, 85),
        y: randomBetween(18, 80),
        hue: randomBetween(0, 360),
        label: pickRandom(CELEBRATIONS),
        shape: pickRandom(SHAPES),
      };

      setCheerCount((count) => count + 1);
      setGradientSeed(randomBetween(0, 360));
      setBursts((current) => [...current.slice(-10), newBurst]);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [babyMode]);

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

  async function enterBabyMode() {
    setBabyMode(true);

    if (document.fullscreenElement || !document.documentElement.requestFullscreen) {
      return;
    }

    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen may be blocked depending on the browser; the app still works without it.
    }
  }

  async function leaveBabyMode() {
    setBabyMode(false);

    if (!document.fullscreenElement || !document.exitFullscreen) {
      return;
    }

    try {
      await document.exitFullscreen();
    } catch {
      // Ignore exit failures to keep the main interaction reliable.
    }
  }

  return (
    <main className={`page ${babyMode ? "page--baby" : ""}`} style={backgroundStyle}>
      <section className="shell">
        <div className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Remote work helper for parents</p>
            <h1>赤ちゃんが来たら、すぐに楽しいPCへ切り替える。</h1>
            <p className="lead">
              ボタンを押すと画面全体が赤ちゃん向けモードに変わり、キーを押すたびに色・形・ことばが弾けます。
              まずは最小の喜びをつくる初版です。
            </p>
            <div className="actions">
              <button
                className="primary-button"
                onClick={() => {
                  if (babyMode) {
                    void leaveBabyMode();
                    return;
                  }

                  void enterBabyMode();
                }}
                type="button"
              >
                {babyMode ? "仕事画面に戻る" : "赤ちゃんモードを開始"}
              </button>
              <p className="hint">
                {babyMode
                  ? "キーボードでも画面タップでも反応します"
                  : "1クリックで全画面風の体験に切り替える想定です"}
              </p>
            </div>
          </div>

          <div className={`preview ${babyMode ? "preview--live" : ""}`}>
            <div className="preview-window">
              <div className="preview-header">
                <span className="dot dot--pink" />
                <span className="dot dot--yellow" />
                <span className="dot dot--mint" />
              </div>
              <div className="preview-stage">
                {babyMode ? (
                  <button className="exit-button" onClick={() => void leaveBabyMode()} type="button">
                    終了
                  </button>
                ) : null}
                <div className="status-pill">
                  {babyMode ? "Baby mode on" : "Waiting"}
                </div>
                <div className="big-key">{pressedKey}</div>
                <div className="mini-stats">
                  <div>
                    <span>よろこび回数</span>
                    <strong>{cheerCount}</strong>
                  </div>
                  <div>
                    <span>おすすめ導線</span>
                    <strong>大きな終了ボタン</strong>
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
          </div>
        </div>

        <section className="feature-grid">
          <article className="feature-card">
            <h2>最初のユーザー価値</h2>
            <p>
              親はすぐ仕事を中断せずに済み、赤ちゃんは「押すと楽しい」が続くので、数分の緩衝時間をつくれます。
            </p>
          </article>
          <article className="feature-card">
            <h2>公開しやすい構成</h2>
            <p>
              `Next.js` でフロントを作り、`GitHub` で管理し、`Vercel` に載せれば初版は最短で公開できます。
            </p>
          </article>
          <article className="feature-card">
            <h2>次の伸びしろ</h2>
            <p>
              音、カメラ、複数テーマ、利用ログ、保護者プロフィールはあとから `Supabase` で足せます。
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
