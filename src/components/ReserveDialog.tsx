import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { STRIPE_CHECKOUT_API_URL, WEBHOOK_URL } from "@/config";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReserveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dinner: { date: string; slug: string };
}

const basePrice = 70;
const winePrice = 20;
const cheesePrice = 13;

const PairingCounter = ({
  count,
  max,
  onChange,
}: {
  count: number;
  max: number;
  onChange: (n: number) => void;
}) => (
  <div className="flex items-center gap-3 mt-2">
    <button
      type="button"
      onClick={() => onChange(Math.max(1, count - 1))}
      className="w-7 h-7 border border-foreground/20 bg-transparent text-foreground font-body text-base flex items-center justify-center cursor-pointer hover:bg-foreground/5"
    >
      −
    </button>
    <span className="text-sm tracking-[1px] min-w-[1.5rem] text-center">{count}</span>
    <button
      type="button"
      onClick={() => onChange(Math.min(max, count + 1))}
      className="w-7 h-7 border border-foreground/20 bg-transparent text-foreground font-body text-base flex items-center justify-center cursor-pointer hover:bg-foreground/5"
    >
      +
    </button>
  </div>
);

const ReserveDialog = ({ open, onOpenChange, dinner }: ReserveDialogProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("1");
  const [wineCount, setWineCount] = useState(0);
  const [cheeseCount, setCheeseCount] = useState(0);
  const [allergies, setAllergies] = useState("");
  const [dietaryNotes, setDietaryNotes] = useState("");

  const guestCount = parseInt(guests) || 1;

  useEffect(() => {
    if (wineCount > guestCount) setWineCount(guestCount);
    if (cheeseCount > guestCount) setCheeseCount(guestCount);
  }, [guestCount, wineCount, cheeseCount]);

  const totalPrice = (basePrice * guestCount) + (winePrice * wineCount) + (cheesePrice * cheeseCount);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reservationData = {
      dinnerDate: dinner.date,
      guestCount,
      wineCount,
      cheeseCount,
      name,
      email,
      allergies,
    };

    if (WEBHOOK_URL) {
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      }).catch(() => {});
    }

    if (STRIPE_CHECKOUT_API_URL) {
      try {
        const res = await fetch(STRIPE_CHECKOUT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservationData),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      } catch (err) {
        console.error("Checkout error:", err);
      }
    }

    setIsSubmitting(false);
    alert("Payment integration not yet configured. Your reservation details have been noted.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-foreground/20 max-w-[500px] max-h-[90vh] overflow-y-auto p-8 sm:rounded-none w-[calc(100%-2rem)]">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="font-display text-4xl font-normal">
            {t("reserveSeat")}
          </DialogTitle>
          <p className="text-sm tracking-[2px] mt-1">
            {dinner.date} · Leuven · 19:00
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm tracking-[1px]">{t("name")}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder={t("namePlaceholder")} className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground rounded-none" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm tracking-[1px]">{t("email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground rounded-none" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guests" className="text-sm tracking-[1px]">{t("numberOfGuests")}</Label>
            <select id="guests" value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full bg-transparent border border-foreground/20 px-3 py-2 font-body text-base focus:border-foreground outline-none">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? t("guest") : t("guests")}</option>
              ))}
            </select>
          </div>

          <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

          <div className="space-y-3">
            <p className="font-display text-2xl text-center">{t("addToEvening")}</p>

            <div className="flex items-start space-x-3 p-3 border border-foreground/10">
              <Checkbox
                id="wines"
                checked={wineCount > 0}
                onCheckedChange={(checked) => setWineCount(checked ? guestCount : 0)}
                className="mt-0.5 border-foreground/30"
              />
              <div className="flex-1">
                <Label htmlFor="wines" className="text-sm tracking-[1px] cursor-pointer">
                  {t("winePairing")} · +€{winePrice}/pp
                </Label>
                <p className="text-[13px] opacity-60 mt-0.5">{t("wineDesc")}</p>
                {wineCount > 0 && guestCount > 1 && (
                  <PairingCounter count={wineCount} max={guestCount} onChange={setWineCount} />
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border border-foreground/10">
              <Checkbox
                id="cheese"
                checked={cheeseCount > 0}
                onCheckedChange={(checked) => setCheeseCount(checked ? guestCount : 0)}
                className="mt-0.5 border-foreground/30"
              />
              <div className="flex-1">
                <Label htmlFor="cheese" className="text-sm tracking-[1px] cursor-pointer">
                  {t("cheeseCourse")} · +€{cheesePrice}/pp
                </Label>
                <p className="text-[13px] opacity-60 mt-0.5">{t("cheeseDesc")}</p>
                {cheeseCount > 0 && guestCount > 1 && (
                  <PairingCounter count={cheeseCount} max={guestCount} onChange={setCheeseCount} />
                )}
              </div>
            </div>
          </div>

          <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

          <div className="space-y-3">
            <p className="font-display text-2xl text-center">{t("dietaryNeeds")}</p>
            <div className="space-y-1.5">
              <Label htmlFor="allergies" className="text-sm tracking-[1px]">{t("allergiesLabel")}</Label>
              <Textarea id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder={t("allergiesPlaceholder")} className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground min-h-[70px] rounded-none" />
            </div>
          </div>

          <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

          <div className="text-center space-y-2">
            <p className="font-display text-2xl">{t("summary")}</p>
            <div className="text-sm tracking-[1px] space-y-0.5">
              <p>{dinner.date} · {guestCount} {guestCount === 1 ? t("guest") : t("guests")}</p>
              <p>4 {t("courses")} · €{basePrice} × {guestCount}</p>
              {wineCount > 0 && <p>{t("winePairing")} · €{winePrice} × {wineCount}</p>}
              {cheeseCount > 0 && <p>{t("cheeseCourse")} · €{cheesePrice} × {cheeseCount}</p>}
            </div>
            <p className="font-display text-3xl mt-3">{t("total")}: €{totalPrice}</p>
          </div>

          <div className="text-center pb-2">
            <button type="submit" disabled={isSubmitting} className="inline-block px-10 py-3 border border-foreground text-foreground text-sm tracking-[2px] hover:bg-foreground hover:text-primary-foreground transition-colors cursor-pointer bg-transparent font-body disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? t("patience") : t("payReserve")}
            </button>
            <p className="text-[13px] opacity-50 mt-2">{t("securePayment")}</p>
            <p className="mt-3">
              <Link to="/faq" className="text-[13px] tracking-[1px] opacity-50 hover:opacity-100 transition-opacity text-foreground underline underline-offset-4">
                FAQ
              </Link>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReserveDialog;
