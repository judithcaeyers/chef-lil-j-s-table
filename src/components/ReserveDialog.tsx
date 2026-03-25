import { useState, useEffect } from "react";
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

interface ReserveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dinner: { date: string; slug: string };
}

const basePrice = 67;
const winePrice = 35;
const cheesePrice = 18;

const PairingCounter = ({
  count,
  max,
  onChange,
}: {
  count: number;
  max: number;
  onChange: (n: number) => void;
}) => (
  <div className="flex items-center gap-2 mt-1.5">
    <button
      type="button"
      onClick={() => onChange(Math.max(0, count - 1))}
      className="w-7 h-7 border border-foreground/20 bg-transparent text-foreground font-body text-base flex items-center justify-center cursor-pointer hover:bg-foreground/5 transition-colors"
    >
      −
    </button>
    <span className="text-sm tracking-[1px] min-w-[60px] text-center">
      {count} of {max}
    </span>
    <button
      type="button"
      onClick={() => onChange(Math.min(max, count + 1))}
      className="w-7 h-7 border border-foreground/20 bg-transparent text-foreground font-body text-base flex items-center justify-center cursor-pointer hover:bg-foreground/5 transition-colors"
    >
      +
    </button>
  </div>
);

const ReserveDialog = ({ open, onOpenChange, dinner }: ReserveDialogProps) => {
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

    // Send to Google Sheets webhook (fire & forget)
    if (WEBHOOK_URL) {
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      }).catch(() => {});
    }

    // Redirect to Stripe Checkout
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
      <DialogContent className="bg-background border-foreground/20 max-w-[500px] max-h-[90vh] overflow-y-auto p-8 sm:rounded-none">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="font-display text-4xl font-normal">
            Reserve your seat
          </DialogTitle>
          <p className="text-sm tracking-[2px] mt-1">
            {dinner.date} · Leuven · 19:00
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm tracking-[1px]">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground rounded-none" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm tracking-[1px]">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground rounded-none" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guests" className="text-sm tracking-[1px]">Number of guests</Label>
            <select id="guests" value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full bg-transparent border border-foreground/20 px-3 py-2 font-body text-base focus:border-foreground outline-none">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
              ))}
            </select>
          </div>

          <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

          {/* Pairings */}
          <div className="space-y-3">
            <p className="font-display text-2xl text-center">Add to your evening</p>

            <div className="flex items-start space-x-3 p-3 border border-foreground/10">
              <Checkbox
                id="wines"
                checked={wineCount > 0}
                onCheckedChange={(checked) => setWineCount(checked ? guestCount : 0)}
                className="mt-0.5 border-foreground/30"
              />
              <div className="flex-1">
                <Label htmlFor="wines" className="text-sm tracking-[1px] cursor-pointer">
                  Wine pairing · +€{winePrice}/pp
                </Label>
                <p className="text-[13px] opacity-60 mt-0.5">4 curated wines, one per course</p>
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
                  Cheese course · +€{cheesePrice}/pp
                </Label>
                <p className="text-[13px] opacity-60 mt-0.5">Selection of artisan cheeses before dessert</p>
                {cheeseCount > 0 && guestCount > 1 && (
                  <PairingCounter count={cheeseCount} max={guestCount} onChange={setCheeseCount} />
                )}
              </div>
            </div>
          </div>

          <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

          <div className="space-y-3">
            <p className="font-display text-2xl text-center">Dietary needs</p>
            <div className="space-y-1.5">
              <Label htmlFor="allergies" className="text-sm tracking-[1px]">Allergies or dietary restrictions</Label>
              <Textarea id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Let us know about any allergies or special requirements..." className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground min-h-[70px] rounded-none" />
            </div>
          </div>

          <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

          <div className="text-center space-y-2">
            <p className="font-display text-2xl">Summary</p>
            <div className="text-sm tracking-[1px] space-y-0.5">
              <p>{dinner.date} · {guestCount} {guestCount === 1 ? "guest" : "guests"}</p>
              <p>4 courses · €{basePrice} × {guestCount}</p>
              {wineCount > 0 && <p>Wine pairing · €{winePrice} × {wineCount}</p>}
              {cheeseCount > 0 && <p>Cheese course · €{cheesePrice} × {cheeseCount}</p>}
            </div>
            <p className="font-display text-3xl mt-3">Total: €{totalPrice}</p>
          </div>

          <div className="text-center pb-2">
            <button type="submit" className="inline-block px-10 py-3 border border-foreground text-foreground text-sm tracking-[2px] hover:bg-foreground hover:text-primary-foreground transition-colors cursor-pointer bg-transparent font-body">
              Pay & Reserve
            </button>
            <p className="text-[13px] opacity-50 mt-2">Secure payment via Bancontact or card</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReserveDialog;
