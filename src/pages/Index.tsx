import { useState } from "react";
import ReserveDialog from "@/components/ReserveDialog";

const menus = {
  june: {
    date: "June 27",
    courses: [
      { title: "To start", items: ["Heritage tomato salad, burrata", "and garden herb gremolata"] },
      { title: "Second course", items: ["Dumplings in a warm seasonal broth", "with fragrant herbs and chili crisp"] },
      { title: "Main course", items: ["Lincolnshire potato, oak smoked cheddar,", "bbq spring onions and baby gem lettuce,", "lovage velouté"] },
      { title: "Dessert", items: ["Sticky toffee pudding,", "vanilla ice cream"] },
    ],
  },
  august: {
    date: "August 15",
    courses: [
      { title: "To start", items: ["Seasonal surprise", "— to be announced"] },
      { title: "Second course", items: ["Seasonal surprise", "— to be announced"] },
      { title: "Main course", items: ["Seasonal surprise", "— to be announced"] },
      { title: "Dessert", items: ["Seasonal surprise", "— to be announced"] },
    ],
  },
};

const events = [
  { date: "June 27", slug: "june-27", seats: "Seats available" },
  { date: "August 15", slug: "august-15", seats: "Seats available" },
];

const Index = () => {
  const [activeMenu, setActiveMenu] = useState<"june" | "august">("june");
  const [switching, setSwitching] = useState(false);
  const menu = menus[activeMenu];
  const otherMenu = activeMenu === "june" ? "august" : "june";

  const handleSwitch = () => {
    setSwitching(true);
    setTimeout(() => {
      setActiveMenu(otherMenu);
      setSwitching(false);
    }, 450);
  };

  return (
    <div className="max-w-[650px] mx-auto px-6 py-16 md:px-10 md:py-20 text-center">
      {/* Header */}
      <h1 className="font-display text-5xl md:text-6xl mb-2">Chef Lil J</h1>
      <p className="text-sm tracking-[2px] mb-4">Dinner Club · Leuven</p>
      <p className="text-base leading-relaxed max-w-[460px] mx-auto mb-16">
        Small dinners. Few tables. Surprising food, cooked & served by Chef Lil J.
      </p>

      {/* Menu */}
      <p className={`text-sm tracking-[2px] uppercase mb-8 transition-all duration-[450ms] ${switching ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
        {menu.date}
      </p>

      <div className={`transition-all duration-500 ${switching ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"}`}>
        {menu.courses.map((course) => (
          <div key={course.title}>
            <h3 className="font-display text-3xl md:text-4xl mt-16 mb-6">{course.title}</h3>
            <div className="text-base tracking-[1px] leading-[1.8] max-w-[420px] mx-auto">
              {course.items.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-[13px] opacity-70 leading-relaxed">
        Vegetarian, vegan or allergies? Let us know when booking.
      </p>

      <div className="mt-10">
        <button
          onClick={handleSwitch}
          className="bg-transparent border-none border-b border-foreground pb-0 font-body text-[15px] cursor-pointer text-foreground hover:opacity-60 transition-opacity underline underline-offset-4"
        >
          {menus[otherMenu].date} menu →
        </button>
      </div>

      {/* Divider */}
      <div className="my-20 w-[60px] h-px bg-foreground opacity-20 mx-auto" />

      {/* Upcoming Dinners */}
      <div className="mt-28">
        <h2 className="font-display text-4xl md:text-[42px] mb-16">Upcoming dinners</h2>

        {events.map((event) => (
          <div key={event.slug} className="mb-16">
            <p className="font-display text-3xl">{event.date}</p>
            <div className="text-[15px] tracking-[1px] mt-2 leading-[1.7]">
              <p>Leuven · 19:00</p>
              <p>4 courses · €67</p>
              <p className="text-[13px] opacity-70">water & aperitif included · wine available</p>
            </div>
            <button
              onClick={() => { setSelectedEvent(event); setReserveOpen(true); }}
              className="inline-block mt-6 px-8 py-3 border border-foreground text-foreground text-sm tracking-[2px] hover:bg-foreground hover:text-primary-foreground transition-colors bg-transparent font-body cursor-pointer"
            >
              Reserve your seat
            </button>
            <p className="mt-2 text-[13px] tracking-[1px] opacity-60">{event.seats}</p>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-28 text-sm">
        <p>Want early access to new dinners?</p>
        <a href="#" className="border-b border-foreground text-foreground no-underline">
          Join the newsletter
        </a>
      </div>

      <div className="mt-28 text-sm">
        <p>Cooking between dinners:</p>
        <a href="#" className="border-b border-foreground text-foreground no-underline">
          Recipes & notes from my kitchen
        </a>
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
