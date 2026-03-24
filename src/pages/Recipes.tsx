import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { recipes, allKickers, allSfeer, allDieet } from "@/data/recipes";

const MultiSelect = ({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const display = selected.length === 0 ? label : `${label} (${selected.length})`;

  return (
    <div className="relative w-[210px] max-w-[90vw]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full min-h-[44px] px-4 py-2.5 border border-foreground bg-transparent text-foreground flex items-center justify-between gap-3 font-body text-[15px] leading-tight cursor-pointer hover:bg-foreground/[0.04] transition-colors"
      >
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{display}</span>
        <span
          className="flex-shrink-0 w-2.5 h-2.5 border-r border-b border-foreground rotate-45 -mt-0.5 opacity-85"
        />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 top-[calc(100%+8px)] left-0 w-full max-h-[280px] overflow-auto p-2.5 border border-foreground bg-background shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2.5 py-2 px-2 font-body text-[17px] leading-tight cursor-pointer hover:bg-foreground/[0.04]"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => {
                    onChange(
                      selected.includes(opt)
                        ? selected.filter((s) => s !== opt)
                        : [...selected, opt]
                    );
                  }}
                  className="w-4 h-4 accent-foreground"
                />
                {opt}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Recipes = () => {
  const [selectedKicker, setSelectedKicker] = useState<string[]>([]);
  const [selectedSfeer, setSelectedSfeer] = useState<string[]>([]);
  const [selectedDieet, setSelectedDieet] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const hasFilters = selectedKicker.length > 0 || selectedSfeer.length > 0 || selectedDieet.length > 0 || search.length > 0;

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (selectedKicker.length > 0 && !selectedKicker.includes(r.kicker)) return false;
      if (selectedSfeer.length > 0 && !r.sfeer.some((s) => selectedSfeer.includes(s))) return false;
      if (selectedDieet.length > 0 && !selectedDieet.every((d) => r.dieet.includes(d))) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.ingredientsFilter.some((i) => i.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedKicker, selectedSfeer, selectedDieet, search]);

  const clearAll = () => {
    setSelectedKicker([]);
    setSelectedSfeer([]);
    setSelectedDieet([]);
    setSearch("");
    setSearchOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center pt-8 pb-6 px-4">
        <Link to="/" className="inline-block">
          <h1 className="font-display text-5xl md:text-6xl">Chef Lil J</h1>
        </Link>
      </header>

      {/* Intro */}
      <div className="max-w-[760px] mx-auto px-4 text-center pb-3">
        <p className="font-body text-[19px] leading-relaxed opacity-85 max-w-[38ch] mx-auto">
          Filter of zoek door de recepten
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-[1100px] mx-auto mt-8 mb-6 px-[clamp(18px,4vw,40px)] grid grid-cols-[repeat(auto-fit,minmax(210px,210px))] gap-3.5 justify-center items-start">
        <MultiSelect label="Categorie" options={allKickers} selected={selectedKicker} onChange={setSelectedKicker} />
        <MultiSelect label="Sfeer" options={allSfeer} selected={selectedSfeer} onChange={setSelectedSfeer} />
        <MultiSelect label="Dieet" options={allDieet} selected={selectedDieet} onChange={setSelectedDieet} />

        <div className="col-span-full flex flex-wrap gap-3 justify-center items-center mt-1.5">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-11 h-11 border border-foreground bg-transparent text-foreground flex items-center justify-center cursor-pointer hover:bg-foreground/[0.04] transition-colors"
            >
              <Search size={18} />
            </button>
            {searchOpen && (
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoek een recept..."
                className="w-[280px] max-w-[70vw] px-4 py-2.5 border border-foreground bg-[#fffdf8] text-foreground font-body text-[17px] leading-tight"
              />
            )}
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1.5 font-body text-sm opacity-70 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-foreground"
            >
              <X size={14} />
              Wis alle filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1100px] mx-auto mt-8 mb-20 px-[clamp(18px,4vw,48px)]">
        {filtered.length === 0 ? (
          <div className="max-w-[560px] mx-auto mt-10 py-7 px-6 text-center border-t-2 border-b border-foreground/20 font-body text-[19px] leading-relaxed opacity-80">
            Geen recepten gevonden. Pas je filters aan of wis de zoekopdracht.
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-7">
            {filtered.map((recipe) => (
              <Link
                key={recipe.slug}
                to={`/recipes/${recipe.slug}`}
                className="break-inside-avoid block mb-8 text-foreground no-underline group"
              >
                <div className="w-full aspect-[4/3] bg-foreground/10 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-95"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="pt-3 px-1 text-center">
                  <span className="font-body text-[19px] leading-tight opacity-95 group-hover:underline group-hover:underline-offset-[5px] group-hover:decoration-1">
                    {recipe.title}
                  </span>
                  <p className="mt-1 font-body text-[10px] font-bold tracking-[0.14em] uppercase opacity-60">
                    {recipe.kicker} · {recipe.time}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pb-12 font-body text-base opacity-80">
        <Link to="/" className="border-b border-foreground pb-px hover:opacity-70 transition-opacity">
          ← Terug naar Chef Lil J
        </Link>
      </div>
    </div>
  );
};

export default Recipes;
