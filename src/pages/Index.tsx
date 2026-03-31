import { useState, useRef } from "react";
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
  { date: "June 27", slug: "june-27", menuKey: "june" as const },
  { date: "August 15", slug: "august-15", menuKey: "august" as const },
];

const Index = () => {
  const [activeMenu, setActiveMenu] = useState<"june" | "august">("june");
  const [switching, setSwitching] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const menuRef = useRef<HTMLDivElement>(null);
  const menu = menus[activeMenu];
  const otherMenu = activeMenu === "june" ? "august" : "june";

  const handleSwitch = () => {
    setSwitching(true);
    setTimeout(() => {
      setActiveMenu(otherMenu);
      setSwitching(false);
    }, 450);
  };

  const scrollToMenu = (menuKey: "june" | "august") => {
    if (activeMenu !== menuKey) {
      setSwitching(true);
      setTimeout(() => {
        setActiveMenu(menuKey);
        setSwitching(false);
        menuRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 450);
    } else {
      menuRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-[650px] mx-auto px-6 py-16 md:px-10 md:py-20 text-center">
      {/* Header */}
      <h1 className="font-display text-5xl md:text-6xl mb-2">Chef Lil J</h1>
      <p className="text-sm tracking-[2px] mb-12">Dinner Club · Leuven</p>

      {/* Intro */}
      <p className="text-base leading-relaxed max-w-[440px] mx-auto mb-4 text-justify px-4 md:px-0">
        Chef Lil J's Dinner Club is where I get to go all out doing what I love most: experimenting with food, discovering unexpected combinations, rediscovering ingredients my grandma uses every day, and creating a space where people can gather, relax, feel completely spoiled, talk about life, and dream about what's next.
      </p>
      <p className="text-base leading-relaxed max-w-[440px] mx-auto mb-0 text-justify px-4 md:px-0">
        I'd love for you to be part of it. Reserve your seat here — see you soon.
      </p>

      {/* Divider */}
      <div className="my-16 w-[60px] h-px bg-foreground opacity-20 mx-auto" />

      {/* Upcoming Dinners */}
      <h2 className="font-display text-4xl md:text-[42px] mb-16">Upcoming dinners</h2>

      {events.map((event) => (
        <div key={event.slug} className="mb-16">
          <p className="font-display text-3xl">{event.date}</p>
          <div className="text-[15px] tracking-[1px] mt-2 leading-[1.7]">
            <p>Leuven · 19:00</p>
            <p>4 courses · €70</p>
            <p className="text-[13px] opacity-70">water & aperitif included · wine available</p>
          </div>
          <button
            onClick={() => { setSelectedEvent(event); setReserveOpen(true); }}
            className="inline-block mt-6 px-8 py-3 border border-foreground text-foreground text-sm tracking-[2px] hover:bg-foreground hover:text-primary-foreground transition-colors bg-transparent font-body cursor-pointer"
          >
            Reserve your seat
          </button>
          <p className="mt-3">
            <button
              onClick={() => scrollToMenu(event.menuKey)}
              className="bg-transparent border-none font-body text-[13px] tracking-[1px] opacity-60 hover:opacity-100 transition-opacity cursor-pointer text-foreground underline underline-offset-4"
            >
              discover the menu ↓
            </button>
          </p>
        </div>
      ))}

      {/* Divider */}
      <div className="my-20 w-[60px] h-px bg-foreground opacity-20 mx-auto" />

      {/* Menu */}
      <div ref={menuRef}>
        {/* Menu title */}
        <h3 className="font-display text-4xl md:text-[42px] mb-3">Menu {menu.date}</h3>
        <button
          onClick={() => {
            setSwitching(true);
            setTimeout(() => {
              setActiveMenu(otherMenu);
              setSwitching(false);
            }, 450);
          }}
          className="bg-transparent border-none font-body text-[13px] tracking-[1px] opacity-50 hover:opacity-100 transition-opacity cursor-pointer text-foreground underline underline-offset-4 mb-8 inline-block"
        >
          discover the {menus[otherMenu].date} menu
        </button>

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

        {/* Divider */}
        <div className="mt-16 w-[60px] h-px bg-foreground opacity-20 mx-auto" />
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
        <a href="https://www.instagram.com/cheflil_j/" target="_blank" rel="noopener noreferrer" className="border-b border-foreground text-foreground no-underline">
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
