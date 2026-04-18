import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const faqItems = [
  {
    q: { en: "Can I take the chef home afterwards so she cooks for me every day?", nl: "Kan ik de chef mee naar huis nemen zodat ze elke dag voor me kookt?" },
    a: {
      en: "No — that's called kidnapping and we don't approve.\n\nWhat you can do is invite her as a private chef for your (future) yacht holiday in the south of France.",
      nl: "Nee — dat heet ontvoering en daar keuren we niet goed.\n\nWat je wél kunt doen is haar uitnodigen als privéchef voor je (toekomstige) jachtvakantie in het zuiden van Frankrijk.",
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
    q: { en: "Will we sit with strangers?", nl: "Zitten we bij onbekenden?" },
    a: {
      en: "If you're open to it, we'll mix tables thoughtfully. If not, we'll keep your table as is. No surprises — unless you want them.",
      nl: "Als je ervoor openstaat, mixen we tafels doordacht. Zo niet, dan houden we je tafel zoals die is. Geen verrassingen — tenzij je ze wilt.",
    },
  },
  {
    q: { en: "What's included?", nl: "Wat is inbegrepen?" },
    a: {
      en: "A 4-course dinner, with water and an aperitif to start.\n\nAdditional drinks are available throughout the night — have a look at our drinks menu.",
      nl: "Een 4-gangendiner, met water en een aperitief om te beginnen.\n\nExtra drankjes zijn de hele avond beschikbaar — bekijk ons drankenmenu.",
    },
  },
  {
    q: { en: "Is there a dress code?", nl: "Is er een dresscode?" },
    a: {
      en: "No strict rules — but most guests like to dress up a little. Most importantly, wear something that makes you feel great. It's a night to enjoy.",
      nl: "Geen strikte regels — maar de meeste gasten kleden zich graag wat op. Het belangrijkste: draag iets waarin je je geweldig voelt. Het is een avond om van te genieten.",
    },
  },
  {
    q: { en: "Can you accommodate dietary requirements?", nl: "Kunnen jullie rekening houden met dieetwensen?" },
    a: {
      en: "If you decided last week you're on a strict carrot-only diet, we might not be able to help you with that.\n\nAnything else — we'll do our very best to accommodate.\n\nIf we can't fully meet your needs, we'll let you know in advance and think along with you to find what works.",
      nl: "Als je vorige week hebt besloten dat je op een strikt wortel-dieet zit, kunnen we je daar misschien niet mee helpen.\n\nAl het andere — we doen ons uiterste best.\n\nAls we niet volledig aan je wensen kunnen voldoen, laten we het je vooraf weten en denken we met je mee.",
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
    q: { en: "Can I book with a group?", nl: "Kan ik boeken met een groep?" },
    a: {
      en: "Yes — just reserve multiple seats together. For larger groups, feel free to reach out and we'll make it work.",
      nl: "Ja — reserveer gewoon meerdere plekken samen. Voor grotere groepen, neem gerust contact op en we zorgen ervoor.",
    },
  },
  {
    q: { en: "Where is it exactly?", nl: "Waar is het precies?" },
    a: {
      en: "The exact location will be shared after booking.\n\nA few days before, you'll receive everything you need — directions, parking, the usual.",
      nl: "De exacte locatie wordt gedeeld na het boeken.\n\nEen paar dagen ervoor ontvang je alles wat je nodig hebt — routebeschrijving, parkeren, het gebruikelijke.",
    },
  },
  {
    q: { en: "What kind of food can I expect?", nl: "Wat voor soort eten kan ik verwachten?" },
    a: {
      en: "Seasonal, expressive, and built around contrast. Familiar ingredients, unexpected combinations — the kind of dishes you'll think about the next day.",
      nl: "Seizoensgebonden, expressief en gebouwd rond contrast. Bekende ingrediënten, onverwachte combinaties — het soort gerechten waar je de volgende dag nog aan denkt.",
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
      en: "Feel free to reach out.",
      nl: "Neem gerust contact op.",
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
                  <p key={i} className={i > 0 ? "mt-3" : ""}>{paragraph}</p>
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
