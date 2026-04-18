import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const faqItems = [
  {
    q: { en: "Can I take the chef home afterwards so she cooks for me every day?", nl: "Kan ik de chef mee naar huis nemen zodat ze elke dag voor me kookt?" },
    a: {
      en: "No, that's called kidnapping and we don't approve.\n\nWhat you can do is invite her as a private chef for your yacht in the south of France.",
      nl: "Nee, dat heet ontvoering en dat keuren we niet goed.\n\nWat je wél kunt doen is haar uitnodigen als privéchef voor op je jacht in het zuiden van Frankrijk.",
    },
  },
  {
    q: { en: "Can I come alone?", nl: "Kan ik alleen komen?" },
    a: {
      en: "Absolutely. Some guests come with friends, others come alone, both work beautifully. When reserving your seat, you can opt to join a shared table. Who knows who you'll meet.",
      nl: "Absoluut. Sommige gasten komen met vrienden, anderen alleen, allebei werkt prima. Bij het reserveren kun je kiezen om aan te sluiten aan een gedeelde tafel. Wie weet wie je ontmoet.",
    },
  },
  {
    q: { en: "Will we sit at a table with people we don't know?", nl: "Zitten we aan een tafel met mensen die we niet kennen?" },
    a: {
      en: "Only if you're open to it. When reserving your seat, you can let us know what you prefer.",
      nl: "Als je ervoor openstaat. Bij het reserveren van je plaats kan je aangeven wat je het liefst hebt.",
    },
  },
  {
    q: { en: "What's included?", nl: "Wat is inbegrepen?" },
    a: {
      en: "The 4-course dinner is included.\nWater (still & sparkling) is on the table all night, and we start with an aperitif.\n\nStill craving more? When you reserve, you can add a selection of artisan cheeses, served between the main course and dessert.\nYou can also opt for a wine pairing, matched to the dishes.\n\nPrefer just a glass of wine or something soft? Just order it at the table.",
      nl: "Het 4-gangendiner is inbegrepen.\nWater (plat & bruis) staat de hele avond op tafel, en we starten met een aperitief.\n\nNog goesting? Bij je reservatie kan je een selectie artisanale kazen toevoegen, geserveerd tussen het hoofdgerecht en het dessert.\nJe kan er ook voor kiezen om een wijnpairing te nemen, afgestemd op de gerechten.\n\nLiever gewoon één glas wijn of iets fris? Dat bestel je gewoon aan tafel.",
    },
  },
  {
    q: { en: "Is there a dress code?", nl: "Is er een dresscode?" },
    a: {
      en: "No strict rules, but most guests like to dress up a little. The perfect moment to bring out that one slightly-too-fancy outfit. Most importantly, wear something that makes you feel awesome. It's a night to enjoy.",
      nl: "Geen strikte regels, maar de meeste gasten kleden zich graag wat op. Dé moment om die ene net te fancy outfit eens boven te halen. Het belangrijkste: draag iets waarin je je awesome voelt. Het is een avond om van te genieten.",
    },
  },
  {
    q: { en: "Can you accommodate dietary requirements?", nl: "Kunnen jullie rekening houden met dieetwensen?" },
    a: {
      en: "If you decided last week you're on a strict carrot-only diet, we might not be able to help you with that.\n\nAnything else — we'll do our very best to accommodate.\n\nIf we can't fully meet your needs, we'll let you know in advance and think along with you to find what works.",
      nl: "Als je vorige week hebt besloten dat je op een strikt wortelonly-dieet zit, kunnen we je daar misschien niet mee helpen.\n\nAl het andere — we doen ons uiterste best.\n\nAls we niet volledig aan je wensen kunnen voldoen, laten we het je vooraf weten en denken we met je mee.",
    },
  },
  {
    q: { en: "Can I cancel my reservation?", nl: "Kan ik mijn reservatie annuleren?" },
    a: {
      en: "Tickets are non-refundable, but you're welcome to transfer your seat to someone else. No empty chairs, please.",
      nl: "Tickets zijn niet terugbetaalbaar, maar je kunt je plek aan iemand anders overdragen. Geen lege stoelen, alsjeblieft.",
    },
  },
  {
    q: { en: "Where is it exactly?", nl: "Waar is het precies?" },
    a: {
      en: "Dinner Club moves between locations. Your confirmation email will include the location for the date you booked.\n\nA few days before Dinner Club, you'll also get an extra email with everything you need to know: directions, parking, etc.",
      nl: "Dinner Club wisselt van locatie. In je bevestigingsmail vind je de locatie voor het moment dat jij gereserveerd hebt.\n\nEen paar dagen voor Dinner Club ontvang je sowieso nog extra een mailtje met alles wat je moet weten: routebeschrijving, parkeren, ect.",
    },
  },
  {
    q: { en: "I have an amazing venue — can I host the next dinner club?", nl: "Ik heb een geweldige locatie — kan ik de volgende dinner club hosten?" },
    a: {
      en: "We love your enthusiasm. We're always on the lookout for exceptional locations.\n\nIf you have a space you think would be a great fit, please reach out.",
      nl: "We waarderen je enthousiasme. We zijn altijd op zoek naar uitzonderlijke locaties.\n\nAls je een ruimte hebt die goed zou passen, neem gerust contact op.",
    },
  },
  {
    q: { en: "I've got a brand and would love to host a dinner to wow my clients — is this possible?", nl: "Ik heb een merk en zou graag een diner organiseren om mijn klanten te verrassen — is dit mogelijk?" },
    a: {
      en: "Yes, it is.\n\nSend us an email and we'd love to talk details.",
      nl: "Ja, dat kan.\n\nStuur ons een e-mail en we bespreken graag de details.",
    },
  },
  {
    q: { en: "Any other questions?", nl: "Nog andere vragen?" },
    a: {
      en: "Feel free to reach out. You can send an email to judithcaeyers@gmail.com",
      nl: "Neem gerust contact op. Je kan een mailtje sturen naar judithcaeyers@gmail.com",
    },
  },
];

const FAQ = () => {
  const { lang, setLang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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

      {/* Back to home */}
      <div className="mb-8">
        <Link
          to="/"
          className="font-body text-[13px] tracking-[1px] opacity-50 hover:opacity-100 transition-opacity text-foreground underline underline-offset-4"
        >
          ← {lang === "nl" ? "Terug naar home" : "Back to home"}
        </Link>
      </div>

      {/* Title */}
      <h1 className="font-display text-5xl md:text-6xl mb-16" style={{ WebkitTextStroke: '0.5px currentColor' }}>
        FAQ
      </h1>

      {/* FAQ items - accordion */}
      <div className="text-left max-w-[480px] mx-auto">
        {faqItems.map((item, index) => (
          <div key={index} className="border-b border-foreground/15">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left py-5 flex items-center justify-between bg-transparent border-none cursor-pointer text-foreground"
            >
              <span className="font-body text-lg md:text-xl tracking-[0.3px] pr-4">
                {item.q[lang]}
              </span>
              <span
                className="text-sm opacity-50 transition-transform duration-300 shrink-0"
                style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                +
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: openIndex === index ? '500px' : '0',
                opacity: openIndex === index ? 1 : 0,
              }}
            >
              <div className="pb-5 text-base leading-relaxed tracking-[0.5px] opacity-85">
                {item.a[lang].split("\n\n").map((paragraph, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : ""}>
                    {paragraph.split("\n").map((line, j, arr) => (
                      <span key={j}>
                        {line}
                        {j < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back link */}
      <div className="mt-20">
        <Link
          to="/"
          className="font-body text-[13px] tracking-[1px] opacity-50 hover:opacity-100 transition-opacity text-foreground underline underline-offset-4"
        >
          ← {lang === "nl" ? "Terug naar home" : "Back to home"}
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
    </div>
  );
};

export default FAQ;
