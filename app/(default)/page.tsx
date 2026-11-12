"use client";
import { LocaleLink } from "@/components/i18n";
import { T, useLocale } from "@/components/i18n";
import { LanguageNav } from "@/components/language-nav";
import { Experience } from "@/components/experience";
import { galleryCardsClickable, scenes } from "@/lib/content";
import { Visual } from "@/components/visual";
export default function Home() {
  const { t } = useLocale();
  return (
    <Experience>
      <header className="site-header">
        <LocaleLink className="wordmark" href="/" aria-label={t("WAYLINE home")}>
          WAYLINE
          <span className="brand-line" />
        </LocaleLink>
        <LanguageNav>
          <LocaleLink className="nav-link nav-secondary" href="/services/"><T>{"SERVICES"}</T></LocaleLink>
          <LocaleLink className="nav-link nav-secondary" href="/services/#pricing"><T>{"PRICING"}</T></LocaleLink>
          <LocaleLink className="nav-link" href="/about/"><T>{"ABOUT US"}</T>{" "}
            <span className="nav-plus" aria-hidden="true">
              +
            </span>
          </LocaleLink>
        </LanguageNav>
      </header>
      <main
        id="main"
        className="scene-stage"
        aria-label={t("What WAYLINE does")}
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
              {i === 0 ? (
                <h1 id={`title-${scene.id}`}>
                  {scene.title.map((line) => (
                    <span className="title-line" key={line}>
                      <T>{line}</T>
                    </span>
                  ))}
                </h1>
              ) : (
                <h2 id={`title-${scene.id}`}>
                  {scene.title.map((line) => (
                    <span className="title-line" key={line}>
                      <T>{line}</T>
                    </span>
                  ))}
                </h2>
              )}
              <p className="scene-description"><T>{scene.description}</T></p>
              <LocaleLink className="text-link" href={scene.href}>
                <T>{scene.action}</T>
                <span aria-hidden="true" className="link-arrow">
                  ↗
                </span>
              </LocaleLink>
            </div>
            {galleryCardsClickable ? (
              <LocaleLink
                className={`visual-link visual-${scene.visual}`}
                href={scene.href}
                aria-label={t(scene.label)}
                tabIndex={i === 0 ? 0 : -1}
              >
                <div className="visual-frame">
                  <Visual kind={scene.visual} />
                </div>
              </LocaleLink>
            ) : (
              <div
                className={`visual-link visual-${scene.visual}`}
                aria-hidden="true"
              >
                <div className="visual-frame">
                  <Visual kind={scene.visual} />
                </div>
              </div>
            )}
          </section>
        ))}
      </main>
    </Experience>
  );
}
