import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import junePhoto1 from "@/assets/IMG_2282-1.jpeg";
import junePhoto2 from "@/assets/IMG_2314.jpeg";
import junePhoto3 from "@/assets/IMG_2317.jpeg";
import junePhoto4 from "@/assets/IMG_2332-1.jpeg";
import junePhoto5 from "@/assets/IMG_2277.jpeg";
import junePhoto6 from "@/assets/IMG_2291.jpeg";
import junePhoto7 from "@/assets/IMG_2311.jpeg";
import junePhoto8 from "@/assets/IMG_2318-1.jpeg";
import junePhoto9 from "@/assets/B0ED7C06-7ADF-4B0E-B7BC-76175E8E0638.jpeg";
import junePhoto10 from "@/assets/01B3B558-3BDF-44BF-A72D-213B392AD913.jpeg";
import junePhoto11 from "@/assets/B16C6F31-195F-47C8-8E45-F40F72853424.jpeg";
import junePhoto12 from "@/assets/8A77DD89-6B0D-4CB0-AF75-743F351B9E44.jpeg";
import junePhoto13 from "@/assets/04A17E60-42B8-4639-A3F9-0BC81D7EEAA8.jpeg";
import junePhoto14 from "@/assets/IMG_2303.jpeg";
import junePhoto15 from "@/assets/IMG_2278-1.jpeg";
import junePhoto16 from "@/assets/IMG_2313.jpeg";
import junePhoto17 from "@/assets/IMG_2320.jpeg";
import junePhoto18 from "@/assets/IMG_2311-2.jpeg";

const photos = [
  { src: junePhoto1, alt: { nl: "Detail van een gerecht", en: "Close-up of a dish" } },
  { src: junePhoto2, alt: { nl: "Gasten aan tafel", en: "Guests at the table" } },
  { src: junePhoto3, alt: { nl: "Judith in de keuken", en: "Judith in the kitchen" } },
  { src: junePhoto4, alt: { nl: "De moestuin", en: "The kitchen garden" } },
  { src: junePhoto5, alt: { nl: "De serre tijdens de service", en: "The greenhouse during service" } },
  { src: junePhoto6, alt: { nl: "Kroketjes klaar om te serveren", en: "Croquettes ready to serve" } },
  { src: junePhoto7, alt: { nl: "Aan de bar", en: "At the bar" } },
  { src: junePhoto8, alt: { nl: "Het menu aan tafel", en: "The menu at the table" } },
  { src: junePhoto9, alt: { nl: "Gesprekken bij kaarslicht", en: "Conversations by candlelight" } },
  { src: junePhoto10, alt: { nl: "Twee gasten in de serre", en: "Two guests in the greenhouse" } },
  { src: junePhoto11, alt: { nl: "Wandeling in de avondzon", en: "A walk in the evening sun" } },
  { src: junePhoto12, alt: { nl: "Deeg kneden in de keuken", en: "Kneading dough in the kitchen" } },
  { src: junePhoto13, alt: { nl: "Bloemen in de serre", en: "Flowers in the greenhouse" } },
  { src: junePhoto14, alt: { nl: "Gasten aan tafel bij het voorgerecht", en: "Guests at the table during the starter" } },
  { src: junePhoto15, alt: { nl: "Wijn wordt geschonken", en: "Pouring the wine" } },
  { src: junePhoto16, alt: { nl: "Een gerecht wordt geserveerd", en: "Serving a dish" } },
  { src: junePhoto17, alt: { nl: "Sfeer aan de lange tafel", en: "Atmosphere at the long table" } },
  { src: junePhoto18, alt: { nl: "Achter de bar", en: "Behind the bar" } },
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

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i)}
              className="group relative block w-full overflow-hidden bg-foreground/5 cursor-pointer border-0 p-0 text-left break-inside-avoid mb-4 md:mb-6"
              aria-label={`${t("openPhoto")} ${i + 1}`}
            >
              <img
                src={photo.src}
                alt={photo.alt[lang]}
                loading="lazy"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.03]"
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
