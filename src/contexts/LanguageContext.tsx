import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "nl" | "en";

const translations = {
  // Index page
  subtitle: { nl: "Dinner Club · Leuven", en: "Dinner Club · Leuven" },
  intro1: {
    nl: "Chef Lil J's Dinner Club is waar ik voluit ga in wat ik het liefste doe: experimenteren met eten, onverwachte combinaties ontdekken, ingrediënten herontdekken die mijn oma dagelijks gebruikt, en een plek creëren waar mensen kunnen samenkomen, ontspannen, zich helemaal verwend voelen, praten over het leven en dromen over wat komen gaat.",
    en: "Chef Lil J's Dinner Club is where I get to go all out doing what I love most: experimenting with food, discovering unexpected combinations, rediscovering ingredients my grandma uses every day, and creating a space where people can gather, relax, feel completely spoiled, talk about life, and dream about what's next.",
  },
  intro2: {
    nl: "Ik zou het geweldig vinden als jij erbij bent. Reserveer hier je plek — tot snel.",
    en: "I'd love for you to be part of it. Reserve your seat here — see you soon.",
  },
  upcomingDinners: { nl: "Komende diners", en: "Upcoming dinners" },
  reserveSeat: { nl: "Reserveer je plek", en: "Reserve your seat" },
  discoverMenu: { nl: "ontdek het menu ↓", en: "discover the menu ↓" },
  menu: { nl: "Menu", en: "Menu" },
  discoverOtherMenu: { nl: "ontdek het menu van", en: "discover the" },
  discoverOtherMenuSuffix: { nl: "", en: "menu" },
  courses: { nl: "gangen", en: "courses" },
  dietaryNote: {
    nl: "Dieetwensen of allergieën? Laat het ons weten, wij zorgen ervoor.",
    en: "Any dietary preferences or allergies? Just let us know, we've got you.",
  },
  earlyAccess: { nl: "Vroege toegang tot nieuwe diners?", en: "Want early access to new dinners?" },
  joinNewsletter: { nl: "Schrijf je in voor de nieuwsbrief", en: "Join the newsletter" },
  cookingBetween: { nl: "Koken tussen de diners:", en: "Cooking between dinners:" },
  recipesNotes: { nl: "Recepten & notities uit mijn keuken", en: "Recipes & notes from my kitchen" },
  waterIncluded: {
    nl: "water & aperitief inbegrepen · wijn beschikbaar",
    en: "water & aperitif included · wine available",
  },

  // Menu courses
  toStart: { nl: "Voorgerecht", en: "To start" },
  secondCourse: { nl: "Tweede gang", en: "Second course" },
  mainCourse: { nl: "Hoofdgerecht", en: "Main course" },
  dessert: { nl: "Dessert", en: "Dessert" },

  // Reserve dialog
  name: { nl: "Naam", en: "Name" },
  namePlaceholder: { nl: "Je volledige naam", en: "Your full name" },
  email: { nl: "E-mail", en: "Email" },
  numberOfGuests: { nl: "Aantal gasten", en: "Number of guests" },
  guest: { nl: "gast", en: "guest" },
  guests: { nl: "gasten", en: "guests" },
  addToEvening: { nl: "Voeg toe aan je avond", en: "Add to your evening" },
  winePairing: { nl: "Wijnpakket", en: "Wine pairing" },
  wineDesc: { nl: "4 geselecteerde wijnen, één per gang", en: "4 curated wines, one per course" },
  cheeseCourse: { nl: "Kaasplank", en: "Cheese course" },
  cheeseDesc: { nl: "Selectie artisanale kazen voor het dessert", en: "Selection of artisan cheeses before dessert" },
  dietaryNeeds: { nl: "Dieetwensen", en: "Dietary needs" },
  allergiesLabel: { nl: "Allergieën of dieetbeperkingen", en: "Allergies or dietary restrictions" },
  allergiesPlaceholder: { nl: "Laat ons weten over allergieën of speciale wensen...", en: "Let us know about any allergies or special requirements..." },
  summary: { nl: "Overzicht", en: "Summary" },
  total: { nl: "Totaal", en: "Total" },
  payReserve: { nl: "Betaal & Reserveer", en: "Pay & Reserve" },
  patience: { nl: "Even geduld...", en: "Please wait..." },
  securePayment: { nl: "Veilig betalen via Bancontact of kaart", en: "Secure payment via Bancontact or card" },

  // Seasonal surprise
  seasonalSurprise: { nl: "Seizoensverrassing", en: "Seasonal surprise" },
  toBeAnnounced: { nl: "— wordt aangekondigd", en: "— to be announced" },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: TranslationKey): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
