import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import junePhoto1 from "@/assets/IMG_2282-1.jpeg.asset.json";
import junePhoto2 from "@/assets/IMG_2314.jpeg.asset.json";
import junePhoto3 from "@/assets/IMG_2317.jpeg.asset.json";
import junePhoto4 from "@/assets/IMG_2332-1.jpeg.asset.json";
import junePhoto5 from "@/assets/IMG_2277.jpeg.asset.json";
import junePhoto6 from "@/assets/IMG_2291.jpeg.asset.json";
import junePhoto7 from "@/assets/IMG_2311.jpeg.asset.json";
import junePhoto8 from "@/assets/IMG_2318-1.jpeg.asset.json";
import junePhoto9 from "@/assets/IMG_2314-2.jpeg.asset.json";

const photos = [
  { src: junePhoto1.url, alt: { nl: "Detail van een gerecht", en: "Close-up of a dish" } },
  { src: junePhoto2.url, alt: { nl: "Gasten aan tafel", en: "Guests at the table" } },
  { src: junePhoto3.url, alt: { nl: "Judith in de keuken", en: "Judith in the kitchen" } },
  { src: junePhoto4.url, alt: { nl: "De moestuin", en: "The kitchen garden" } },
  { src: junePhoto5.url, alt: { nl: "De serre tijdens de service", en: "The greenhouse during service" } },
  { src: junePhoto6.url, alt: { nl: "Kroketjes klaar om te serveren", en: "Croquettes ready to serve" } },
  { src: junePhoto7.url, alt: { nl: "Aan de bar", en: "At the bar" } },
  { src: junePhoto8.url, alt: { nl: "Het menu aan tafel", en: "The menu at the table" } },
  { src: junePhoto9.url, alt: { nl: "Gasten in de avond", en: "Guests in the evening" } },
];


const Gallery = () => {
  const { lang, t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? photos.length - 1 : lightboxIndex - 1);
  }, [lightboxIndex]);
  const next = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === photos.length - 1 ? 0 : lightboxIndex + 1);
  }, [lightboxIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, prev, next]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  return (
    <div className="min-h-screen px-6 py-16 md:px-10 md:py-20">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl leading-[0.95]" style={{ WebkitTextStroke: '0.5px currentColor' }}>
            {t("galleryTitle")}
          </h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i)}
              className="group relative block w-full overflow-hidden bg-foreground/5 cursor-pointer border-0 p-0 text-left"
              aria-label={`${t("openPhoto")} ${i + 1}`}
            >
              <img
                src={photo.src}
                alt={photo.alt[lang]}
                loading="lazy"
                className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <span className="pointer-events-none absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
            </button>
          ))}
        </div>

        {/* Back link */}
        <div className="text-center mt-16">
          <Link
            to="/"
            className="font-body text-sm tracking-wide opacity-70 hover:opacity-100 underline underline-offset-4 transition-opacity"
          >
            {t("galleryBack")}
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={t("galleryTitle")}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 p-2 text-foreground opacity-70 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-0"
            aria-label={t("closeLightbox")}
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 md:left-6 z-10 p-2 text-foreground opacity-60 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-0"
            aria-label={t("prevPhoto")}
          >
            <ChevronLeft size={40} strokeWidth={1.5} />
          </button>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] px-12"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIndex].src}
              alt={photos[lightboxIndex].alt[lang]}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain shadow-2xl"
            />
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 md:right-6 z-10 p-2 text-foreground opacity-60 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-0"
            aria-label={t("nextPhoto")}
          >
            <ChevronRight size={40} strokeWidth={1.5} />
          </button>

          {/* Counter */}
          <p className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-sm tracking-[2px] opacity-60">
            {lightboxIndex + 1} / {photos.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
