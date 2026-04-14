import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import ReserveDialog from "@/components/ReserveDialog";
import { useLanguage } from "@/contexts/LanguageContext";

const menusData = {
  june: {
    date: "June 27",
    courses: [
      { titleKey: "toStart" as const, items: { nl: ["Focaccia, kruidenboter", "Tomaat en gegrilde perzik"], en: ["Focaccia, herb butter", "Tomato and grilled peach"] } },
      { titleKey: "secondCourse" as const, items: { nl: ["Dumplings in een warme bouillon", "met kruiden en chili crisp"], en: ["Dumplings in a warm broth", "with herbs and chili crisp"] } },
      { titleKey: "mainCourse" as const, items: { nl: ["Verse pita met halloumi,", "geroosterd zomerfruit, avocado", "en limoen-lenteui mayo"], en: ["Fresh pita with halloumi,", "roasted summer fruit, avocado", "and lime spring onion mayo"] } },
      { titleKey: "dessert" as const, items: { nl: ["Chocolademousse", "met framboos en pistache"], en: ["Chocolate mousse", "with raspberry and pistachio"] } },
    ],
  },
  august: {
    date: "August 15",
    courses: [
      { titleKey: "toStart" as const, items: { nl: ["Verse focaccia met kruidenboter", "", "Padrón pepers", "en courgette met habanero knoflookhoning"], en: ["Fresh focaccia with herb butter", "", "Padrón peppers", "and zucchini with habanero garlic honey"] } },
      { titleKey: "secondCourse" as const, items: { nl: ["Vietnamese loempia's", "met scampi, ingelegde honing-chili radijs en avocado"], en: ["Vietnamese spring rolls", "with scampi, pickled honey-chili radish and avocado"] } },
      { titleKey: "mainCourse" as const, items: { nl: ["Geroosterde oesterzwam", "met rum-ingelegde ananas en chimichurri"], en: ["Roasted oyster mushroom", "with rum-pickled pineapple and chimichurri"] } },
      { titleKey: "dessert" as const, items: { nl: ["Sticky toffee pudding", "met verse karamel"], en: ["Sticky toffee pudding", "with fresh caramel"] } },
    ],
  },
};

const events = [
  { date: "June 27", slug: "june-27", menuKey: "june" as const, locationKey: "locationJune" as const },
  { date: "August 15", slug: "august-15", menuKey: "august" as const, locationKey: "locationAugust" as const },
];

const Index = () => {
  const [activeMenu, setActiveMenu] = useState<"june" | "august">("june");
  const [switching, setSwitching] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const menuRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();

  const menu = menusData[activeMenu];
  const otherMenu = activeMenu === "june" ? "august" : "june";

  const scrollToMenu = (menuKey: "june" | "august") => {
    if (activeMenu !== menuKey) {
      setSwitching(true);
      setTimeout(() => {
        setActiveMenu(menuKey);
        setSwitching(false);
        menuRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 450);
    } else {
      menuRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getItems = (items: string[] | { nl: string[]; en: string[] }) => {
    if (Array.isArray(items)) return items;
    return items[lang];
  };

  return (
    <div className="max-w-[650px] mx-auto px-6 py-16 md:px-10 md:py-20 text-center">
      {/* Language toggle */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setLang(lang === "en" ? "nl" : "en")}
          className="bg-transparent border-none font-body text-[13px] tracking-[1px] opacity-50 hover:opacity-100 transition-opacity cursor-pointer text-foreground"
        >
          <span className={lang === "nl" ? "opacity-100" : "opacity-40"}>NL</span>
          <span className="mx-1.5 opacity-30">/</span>
          <span className={lang === "en" ? "opacity-100" : "opacity-40"}>EN</span>
        </button>
      </div>

      {/* Header */}
      <h1 className="font-display text-5xl md:text-6xl mb-2" style={{ WebkitTextStroke: '0.5px currentColor' }}>Chef Lil J</h1>
      <p className="text-sm tracking-[2px] mb-12">{t("subtitle")}</p>

      {/* Intro */}
      <p className="text-base leading-relaxed max-w-[440px] mx-auto mb-4 text-justify px-4 md:px-0">
        {t("intro1")}
      </p>
      <p className="text-base leading-relaxed max-w-[440px] mx-auto mb-0 text-justify px-4 md:px-0">
        {t("intro2")}
      </p>

      {/* Divider */}
      <div className="my-16 w-[60px] h-px bg-foreground opacity-20 mx-auto" />

      {/* Upcoming Dinners */}
      <h2 className="font-display text-4xl md:text-[42px] mb-16" style={{ WebkitTextStroke: '0.5px currentColor' }}>{t("upcomingDinners")}</h2>

      {events.map((event) => (
        <div key={event.slug} className="mb-16">
          <p className="font-display text-3xl">{event.date}</p>
          <div className="text-[15px] tracking-[1px] mt-2 leading-[1.7]">
            <p>{t(event.locationKey)} · 19:00</p>
            <p>4 {t("courses")} · €70</p>
            <p className="text-[13px] opacity-70">{t("waterIncluded")}</p>
          </div>
          <button
            onClick={() => { setSelectedEvent(event); setReserveOpen(true); }}
            className="inline-block mt-6 px-8 py-3 border border-foreground text-foreground text-sm tracking-[2px] hover:bg-foreground hover:text-primary-foreground transition-colors bg-transparent font-body cursor-pointer"
          >
            {t("reserveSeat")}
          </button>
          <p className="mt-3">
            <button
              onClick={() => scrollToMenu(event.menuKey)}
              className="bg-transparent border-none font-body text-[13px] tracking-[1px] opacity-60 hover:opacity-100 transition-opacity cursor-pointer text-foreground underline underline-offset-4"
            >
              {t("discoverMenu")}
            </button>
          </p>
        </div>
      ))}

      {/* Divider */}
      <div className="my-20 w-[60px] h-px bg-foreground opacity-20 mx-auto" />

      {/* Menu */}
      <div ref={menuRef}>
        <h3 className="font-display text-4xl md:text-[42px] mb-3" style={{ WebkitTextStroke: '0.5px currentColor' }}>{t("menu")} {menu.date}</h3>
        <button
          onClick={() => {
            setSwitching(true);
            setTimeout(() => {
              setActiveMenu(otherMenu);
              setSwitching(false);
            }, 450);
          }}
          className="bg-transparent border-none font-body text-[13px] tracking-[1px] opacity-50 hover:opacity-100 transition-opacity cursor-pointer text-foreground underline underline-offset-4 mb-8 inline-block"
        >
          {t("discoverOtherMenu")} {menusData[otherMenu].date} {t("discoverOtherMenuSuffix")}
        </button>

        <div className={`transition-all duration-500 ${switching ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"}`}>
          {menu.courses.map((course) => (
            <div key={course.titleKey}>
              <h3 className="font-display text-3xl md:text-4xl mt-16 mb-6">{t(course.titleKey)}</h3>
              <div className="text-base tracking-[1px] leading-[1.8] max-w-[420px] mx-auto">
                {getItems(course.items).map((item, i) => (
                  <p key={i}>{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[13px] tracking-[1px] opacity-70 leading-relaxed">
          {t("dietaryNote")}
        </p>

        <div className="mt-16 w-[60px] h-px bg-foreground opacity-20 mx-auto" />
      </div>

      {/* Newsletter */}
      <div className="mt-28 text-sm">
        <p>{t("earlyAccess")}</p>
        <a href="https://chefjudith.substack.com/subscribe" target="_blank" rel="noopener noreferrer" className="border-b border-foreground text-foreground no-underline">
          {t("joinNewsletter")}
        </a>
      </div>

      <div className="mt-10 text-sm">
        <p>{t("cookingBetween")}</p>
        <a href="https://www.instagram.com/cheflil_j/" target="_blank" rel="noopener noreferrer" className="border-b border-foreground text-foreground no-underline">
          {t("recipesNotes")}
        </a>
      </div>

      <div className="mt-10 text-sm">
        <Link to="/faq" className="border-b border-foreground text-foreground no-underline">
          FAQ
        </Link>
      </div>

      {/* Bottom language toggle */}
      <div className="flex justify-center mt-16">
        <button
          onClick={() => setLang(lang === "en" ? "nl" : "en")}
          className="bg-transparent border-none font-body text-[13px] tracking-[1px] opacity-50 hover:opacity-100 transition-opacity cursor-pointer text-foreground"
        >
          <span className={lang === "nl" ? "opacity-100" : "opacity-40"}>NL</span>
          <span className="mx-1.5 opacity-30">/</span>
          <span className={lang === "en" ? "opacity-100" : "opacity-40"}>EN</span>
        </button>
      </div>

      <ReserveDialog
        open={reserveOpen}
        onOpenChange={setReserveOpen}
        dinner={selectedEvent}
      />
    </div>
  );
};

export default Index;
