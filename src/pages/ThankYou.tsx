import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const ThankYou = () => {
  const { lang } = useLanguage();

  const content = {
    nl: {
      title: "Bedankt!",
      subtitle: "Je reservatie is bevestigd",
      body: "We kijken er enorm naar uit om je te ontvangen. Je krijgt binnenkort een bevestigingsmail met alle details. Heb je vragen of wijzigingen? Stuur gerust een bericht.",
      back: "← Terug naar de hoofdpagina",
    },
    en: {
      title: "Thank you!",
      subtitle: "Your reservation is confirmed",
      body: "We can't wait to welcome you. You'll receive a confirmation email shortly with all the details. Any questions or changes? Just send us a message.",
      back: "← Back to home",
    },
  }[lang];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-[500px] text-center space-y-6">
        <h1 className="font-display text-6xl md:text-7xl">{content.title}</h1>
        <div className="w-[60px] h-px bg-foreground opacity-30 mx-auto" />
        <p className="text-sm tracking-[2px] uppercase">{content.subtitle}</p>
        <p className="font-body text-base leading-relaxed opacity-80">
          {content.body}
        </p>
        <div className="pt-6">
          <Link
            to="/"
            className="inline-block px-10 py-3 border border-foreground text-foreground text-sm tracking-[2px] hover:bg-foreground hover:text-primary-foreground transition-colors no-underline font-body"
          >
            {content.back}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
