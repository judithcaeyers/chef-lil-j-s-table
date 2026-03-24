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

interface ReserveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dinner: { date: string; slug: string };
}

const basePrice = 67;
const winePrice = 35;
const cheesePrice = 18;

const ReserveDialog = ({ open, onOpenChange, dinner }: ReserveDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("1");
  const [wineCount, setWineCount] = useState(0);
  const [cheeseCount, setCheeseCount] = useState(0);
  const [allergies, setAllergies] = useState("");
  const [dietaryNotes, setDietaryNotes] = useState("");

  const guestCount = parseInt(guests) || 1;

  // Cap pairing counts when guest count decreases
  useEffect(() => {
    if (wineCount > guestCount) setWineCount(guestCount);
    if (cheeseCount > guestCount) setCheeseCount(guestCount);
  }, [guestCount, wineCount, cheeseCount]);

  const totalPrice = (basePrice * guestCount) + (winePrice * wineCount) + (cheesePrice * cheeseCount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Payment integration coming soon! Your reservation details have been noted.");
  };

  const counterOptions = Array.from({ length: guestCount + 1 }, (_, i) => i);

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
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm tracking-[1px]">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
              className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground rounded-none"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm tracking-[1px]">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground rounded-none"
            />
          </div>

          {/* Guests */}
          <div className="space-y-1.5">
            <Label htmlFor="guests" className="text-sm tracking-[1px]">Number of guests</Label>
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent border border-foreground/20 px-3 py-2 font-body text-base focus:border-foreground outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

          {/* Pairings */}
          <div className="space-y-3">
            <p className="font-display text-2xl text-center">Add to your evening</p>

            {/* Wine pairing */}
            <div className="p-3 border border-foreground/10 space-y-2">
              <div>
                <p className="text-sm tracking-[1px]">Wine pairing · +€{winePrice}/pp</p>
                <p className="text-[13px] opacity-60 mt-0.5">4 curated wines, one per course</p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="wine-count" className="text-[13px] tracking-[1px] opacity-80">
                  How many guests?
                </Label>
                <select
                  id="wine-count"
                  value={wineCount}
                  onChange={(e) => setWineCount(parseInt(e.target.value))}
                  className="bg-transparent border border-foreground/20 px-2 py-1 font-body text-sm focus:border-foreground outline-none"
                >
                  {counterOptions.map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? "None" : `${n} of ${guestCount}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cheese course */}
            <div className="p-3 border border-foreground/10 space-y-2">
              <div>
                <p className="text-sm tracking-[1px]">Cheese course · +€{cheesePrice}/pp</p>
                <p className="text-[13px] opacity-60 mt-0.5">Selection of artisan cheeses before dessert</p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="cheese-count" className="text-[13px] tracking-[1px] opacity-80">
                  How many guests?
                </Label>
                <select
                  id="cheese-count"
                  value={cheeseCount}
                  onChange={(e) => setCheeseCount(parseInt(e.target.value))}
                  className="bg-transparent border border-foreground/20 px-2 py-1 font-body text-sm focus:border-foreground outline-none"
                >
                  {counterOptions.map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? "None" : `${n} of ${guestCount}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

          {/* Dietary */}
          <div className="space-y-3">
            <p className="font-display text-2xl text-center">Dietary needs</p>

            <div className="space-y-1.5">
              <Label htmlFor="dietary" className="text-sm tracking-[1px]">Dietary preference</Label>
              <select
                id="dietary"
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
                className="w-full bg-transparent border border-foreground/20 px-3 py-2 font-body text-base focus:border-foreground outline-none"
              >
                <option value="">No preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescatarian">Pescatarian</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="allergies" className="text-sm tracking-[1px]">Allergies or other notes</Label>
              <Textarea
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Let us know about any allergies or special requirements..."
                className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground min-h-[70px] rounded-none"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

          {/* Summary */}
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

          {/* Submit */}
          <div className="text-center pb-2">
            <button
              type="submit"
              className="inline-block px-10 py-3 border border-foreground text-foreground text-sm tracking-[2px] hover:bg-foreground hover:text-primary-foreground transition-colors cursor-pointer bg-transparent font-body"
            >
              Pay & Reserve
            </button>
            <p className="text-[13px] opacity-50 mt-2">
              Secure payment via Bancontact or card
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReserveDialog;
