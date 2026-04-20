import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const ThankYou = () => {
  const { lang } = useLanguage();

  const content = {
    nl: {
      eyebrow: "Reservatie bevestigd",
      title: "Bedankt",
      body: "We kijken er enorm naar uit om je te ontvangen. Je krijgt binnenkort een bevestigingsmail met alle details over je avond.",
      questions: "Vragen of wijzigingen?",
      questionsBody: "Stuur gerust een bericht via Instagram of e-mail. We helpen je graag verder.",
      back: "← home",
      signoff: "— Judith",
    },
    en: {
      eyebrow: "Reservation confirmed",
      title: "Thank you",
      body: "We can't wait to welcome you. You'll receive a confirmation email shortly with all the details about your evening.",
      questions: "Any questions or changes?",
      questionsBody: "Just send us a message on Instagram or email. We're happy to help.",
      back: "← home",
      signoff: "— Judith",
    },
  }[lang];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-[620px] w-full text-center">
        {/* Eyebrow */}
        <p className="text-[11px] tracking-[4px] uppercase opacity-60 mb-10">
          {content.eyebrow}
        </p>

        {/* Display title */}
        <h1 className="font-display text-6xl md:text-7xl leading-none mb-10">
          {content.title}
        </h1>

        {/* Divider */}
        <div className="w-[60px] h-px bg-foreground opacity-30 mx-auto mb-10" />

        {/* Body */}
        <p className="font-body text-base leading-relaxed opacity-85 mb-12 max-w-[480px] mx-auto">
          {content.body}
        </p>

        {/* Questions block */}
        <div className="mb-14 space-y-2">
          <p className="font-body text-base leading-relaxed opacity-85 max-w-[480px] mx-auto">
            {content.questions}
          </p>
          <p className="font-body text-base leading-relaxed opacity-85 max-w-[480px] mx-auto">
            {content.questionsBody}
          </p>
        </div>

        {/* Sign-off */}
        <p className="font-display text-3xl opacity-80 mb-12">
          {content.signoff}
        </p>

        {/* Back link */}
        <div>
          <Link
            to="/"
            className="font-body text-sm tracking-wide opacity-70 hover:opacity-100 underline underline-offset-4 transition-opacity"
          >
            {content.back}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
