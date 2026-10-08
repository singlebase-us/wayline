import { Experience } from "@/components/experience";
import { scenes } from "@/lib/content";
import { Visual } from "@/components/visual";
export default function Home() {
  return (
    <Experience>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="WAYLINE home">
          WAYLINE
          <span className="brand-line" />
        </a>
        <a className="nav-link" href="/about/">
          ABOUT US{" "}
          <span className="nav-plus" aria-hidden="true">
            +
          </span>
        </a>
      </header>
      <main
        id="main"
        className="scene-stage"
        aria-label="Operational workflow systems"
      >
        {scenes.map((scene, i) => (
          <section
            key={scene.id}
            id={scene.id}
            className={`scene ${i === 0 ? "is-active" : ""}`}
            style={
              {
                "--scene-color": scene.color,
                "--scene-ink": scene.ink,
              } as React.CSSProperties
            }
            aria-labelledby={`title-${scene.id}`}
          >
            <div className="scene-copy">
              <p className="eyebrow">{scene.eyebrow}</p>
              {i === 0 ? (
                <h1 id={`title-${scene.id}`}>
                  {scene.title.map((line) => (
                    <span className="title-line" key={line}>
                      {line}
                    </span>
                  ))}
                </h1>
              ) : (
                <h2 id={`title-${scene.id}`}>
                  {scene.title.map((line) => (
                    <span className="title-line" key={line}>
                      {line}
                    </span>
                  ))}
                </h2>
              )}
              <p className="scene-description">{scene.description}</p>
              <a className="text-link" href={scene.href}>
                {scene.action}
                <span aria-hidden="true" className="link-arrow">
                  ↗
                </span>
              </a>
            </div>
            <a
              className={`visual-link visual-${scene.visual}`}
              href={scene.href}
              aria-label={scene.label}
              tabIndex={i === 0 ? 0 : -1}
            >
              <div className="visual-frame">
                <Visual kind={scene.visual} />
              </div>
            </a>
          </section>
        ))}
      </main>
      <div className="scene-footer">
        <span className="footer-signoff">LESS FRICTION. MORE FORWARD.</span>
      </div>
    </Experience>
  );
}
