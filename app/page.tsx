import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <section className="shell">
        <div className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Instant play mode for shared family PCs</p>
            <h1>諦めてPCを明け渡そう</h1>
            <p className="lead">
              親が作業中でも、いったんPCを子どもに譲る。その瞬間に、今の作業はそのままで、
              キーボードを押すたび楽しい反応が返るプレイモードへ切り替えます。
            </p>
            <div className="actions">
              <Link className="primary-button" href="/play">
                赤ちゃんモードを開始
              </Link>
              <p className="hint">
                説明画面と遊ぶ画面を分離し、開始したらそのまま子ども用の画面へ遷移します
              </p>
            </div>
          </div>

          <div className="preview preview--summary">
            <div className="preview-window">
              <div className="preview-header">
                <span className="dot dot--pink" />
                <span className="dot dot--yellow" />
                <span className="dot dot--mint" />
              </div>
              <div className="preview-stage preview-stage--summary">
                <div className="status-pill">How it works</div>
                <div className="summary-steps">
                  <div className="summary-step">
                    <strong>1.</strong>
                    <span>親が開始ボタンを押す</span>
                  </div>
                  <div className="summary-step">
                    <strong>2.</strong>
                    <span>子どもにPCを渡す</span>
                  </div>
                  <div className="summary-step">
                    <strong>3.</strong>
                    <span>どのキーでも色と形がはじける</span>
                  </div>
                </div>
                <div className="summary-note">
                  元のドキュメントやアプリを閉じなくても、そのまま切り替えて遊ばせる想定です。
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="feature-grid">
          <article className="feature-card">
            <h2>誰のための体験か</h2>
            <p>在宅勤務中に子どもがPCへ来た瞬間、数分だけ楽しい時間へ切り替えたい親子向けです。</p>
          </article>
          <article className="feature-card">
            <h2>削らない価値</h2>
            <p>すぐ始まり、すぐ楽しく、終わったらすぐ戻れる。この3つをMVPの芯にしています。</p>
          </article>
          <article className="feature-card">
            <h2>今は捨てるもの</h2>
            <p>ログイン、保存、細かい設定は後回しにして、まずは5分の楽しさだけに集中します。</p>
          </article>
        </section>
      </section>
    </main>
  );
}
