import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const dinnerDetails: Record<string, { date: string; label: string }> = {
  "june-27": { date: "June 27", label: "June 27 Dinner" },
  "august-15": { date: "August 15", label: "August 15 Dinner" },
};

const Reserve = () => {
  const { slug } = useParams();
  const dinner = dinnerDetails[slug || ""] || dinnerDetails["june-27"];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("1");
  const [winesPairing, setWinesPairing] = useState(false);
  const [cheesePairing, setCheesePairing] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [dietaryNotes, setDietaryNotes] = useState("");

  const basePrice = 67;
  const winePrice = 35;
  const cheesePrice = 18;
  const guestCount = parseInt(guests) || 1;
  const totalPerPerson = basePrice + (winesPairing ? winePrice : 0) + (cheesePairing ? cheesePrice : 0);
  const totalPrice = totalPerPerson * guestCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Stripe Checkout with Bancontact
    alert("Payment integration coming soon! Your reservation details have been noted.");
  };

  return (
    <div className="max-w-[550px] mx-auto px-6 py-16 md:px-10 md:py-20">
      <Link
        to="/"
        className="text-[13px] tracking-[1px] opacity-60 hover:opacity-100 transition-opacity no-underline text-foreground"
      >
        ← Back to menu
      </Link>

      <h1 className="font-display text-5xl mt-8 mb-2 text-center">Reserve your seat</h1>
      <p className="text-center text-sm tracking-[2px] mb-12">{dinner.date} · Leuven · 19:00</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm tracking-[1px]">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your full name"
            className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm tracking-[1px]">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground"
          />
        </div>

        {/* Guests */}
        <div className="space-y-2">
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
        <div className="space-y-4">
          <p className="font-display text-2xl text-center">Add to your evening</p>

          <div className="flex items-start space-x-3 p-4 border border-foreground/10">
            <Checkbox
              id="wines"
              checked={winesPairing}
              onCheckedChange={(checked) => setWinesPairing(checked === true)}
              className="mt-0.5 border-foreground/30"
            />
            <div>
              <Label htmlFor="wines" className="text-sm tracking-[1px] cursor-pointer">
                Wine pairing · +€{winePrice}
              </Label>
              <p className="text-[13px] opacity-60 mt-1">4 curated wines, one per course</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 border border-foreground/10">
            <Checkbox
              id="cheese"
              checked={cheesePairing}
              onCheckedChange={(checked) => setCheesePairing(checked === true)}
              className="mt-0.5 border-foreground/30"
            />
            <div>
              <Label htmlFor="cheese" className="text-sm tracking-[1px] cursor-pointer">
                Cheese course · +€{cheesePrice}
              </Label>
              <p className="text-[13px] opacity-60 mt-1">Selection of artisan cheeses before dessert</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

        {/* Dietary */}
        <div className="space-y-4">
          <p className="font-display text-2xl text-center">Dietary needs</p>

          <div className="space-y-2">
            <Label htmlFor="dietary" className="text-sm tracking-[1px]">
              Dietary preference
            </Label>
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

          <div className="space-y-2">
            <Label htmlFor="allergies" className="text-sm tracking-[1px]">
              Allergies or other notes
            </Label>
            <Textarea
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Let us know about any allergies or special requirements..."
              className="bg-transparent border-foreground/20 font-body text-base focus:border-foreground min-h-[80px]"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto" />

        {/* Summary */}
        <div className="text-center space-y-3">
          <p className="font-display text-2xl">Summary</p>
          <div className="text-sm tracking-[1px] space-y-1">
            <p>{dinner.date} · {guestCount} {guestCount === 1 ? "guest" : "guests"}</p>
            <p>4 courses · €{basePrice}/pp</p>
            {winesPairing && <p>Wine pairing · +€{winePrice}/pp</p>}
            {cheesePairing && <p>Cheese course · +€{cheesePrice}/pp</p>}
          </div>
          <p className="font-display text-3xl mt-4">Total: €{totalPrice}</p>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="inline-block px-10 py-4 border border-foreground text-foreground text-sm tracking-[2px] hover:bg-foreground hover:text-primary-foreground transition-colors cursor-pointer bg-transparent font-body"
          >
            Pay & Reserve
          </button>
          <p className="text-[13px] opacity-50 mt-3">
            Secure payment via Bancontact or card
          </p>
        </div>
      </form>
    </div>
  );
};

export default Reserve;
