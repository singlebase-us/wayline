import { T } from "@/components/i18n";
import type { scenes } from "@/lib/content";

const photographs = {
  overview: { image: "studio", caption: "Good work starts here." },
  landing: { image: "brand", caption: "Make your first impression count." },
  product: { image: "product", caption: "Ideas become everyday tools." },
  "back-office": { image: "operations", caption: "Room for the work that matters." },
  infrastructure: { image: "infrastructure", caption: "Behind every smooth launch." },
  pricing: { image: "partnership", caption: "A team for the long run." },
} as const;

export function HomeVisual({ scene }: { scene: (typeof scenes)[number] }) {
  const photo = photographs[scene.id];
  return (
    <figure className={`editorial-photo editorial-photo--${scene.id}`}>
      <img
        src={`/images/${photo.image}.jpg`}
        alt=""
        width={1200}
        height={800}
        draggable={false}
        decoding="async"
        fetchPriority={scene.id === "overview" ? "high" : "auto"}
      />
      <figcaption className="editorial-photo-caption">
        <div className="editorial-photo-meta">
          <span>WAYLINE / <T>{scene.label}</T></span>
          <span>{scene.number}</span>
        </div>
        <strong><T>{photo.caption}</T></strong>
      </figcaption>
    </figure>
  );
}
