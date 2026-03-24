import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { recipes } from "@/data/recipes";
import { Copy, Check } from "lucide-react";

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const recipe = recipes.find((r) => r.slug === slug);
  const [servings, setServings] = useState(recipe?.servings ?? 2);
  const [copied, setCopied] = useState(false);

  const ratio = recipe ? servings / recipe.servings : 1;

  const relatedRecipes = useMemo(() => {
    if (!recipe) return [];
    return recipes
      .filter((r) => r.slug !== recipe.slug)
      .filter((r) => r.sfeer.some((s) => recipe.sfeer.includes(s)) || r.kicker === recipe.kicker)
      .slice(0, 4);
  }, [recipe]);

  if (!recipe) {
    return (
      <div className="max-w-[860px] mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-5xl mb-4">Recept niet gevonden</h1>
        <Link to="/recipes" className="border-b border-foreground pb-px hover:opacity-70 transition-opacity">
          ← Terug naar recepten
        </Link>
      </div>
    );
  }

  const formatQty = (qty: number | null) => {
    if (qty === null) return "";
    const scaled = qty * ratio;
    if (scaled === Math.floor(scaled)) return scaled.toString();
    // Handle common fractions
    const rounded = Math.round(scaled * 4) / 4;
    if (rounded === Math.floor(rounded)) return rounded.toString();
    return rounded.toFixed(1).replace(/\.0$/, "");
  };

  const copyIngredients = () => {
    const text = recipe.ingredients
      .filter((i) => !i.type)
      .map((i) => {
        const q = i.qty !== null ? `${formatQty(i.qty)} ${i.unit}` : "";
        return `${q} ${i.label}`.trim();
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center pt-8 pb-6 px-4">
        <Link to="/" className="inline-block">
          <h1 className="font-display text-4xl">Chef Lil J</h1>
        </Link>
      </header>

      <div className="max-w-[860px] mx-auto px-[clamp(18px,4vw,40px)] pt-2 pb-16">
        {/* Title block */}
        <div className="text-center pb-4">
          <p className="font-body text-[12px] font-bold tracking-[0.16em] uppercase opacity-70 mb-3.5">
            {recipe.kicker}
          </p>
          <h2 className="font-display text-[clamp(50px,8vw,72px)] leading-[0.95] mb-3">{recipe.title}</h2>
          <p className="max-w-[40ch] mx-auto font-body text-[19px] leading-relaxed opacity-80 mb-4">
            {recipe.description}
          </p>
          {recipe.notes && (
            <p className="font-display text-[clamp(28px,4vw,38px)] leading-none mb-4">
              {recipe.notes}
            </p>
          )}
          <div className="w-[60px] h-px bg-foreground opacity-20 mx-auto mt-6" />
        </div>

        {/* Meta pills */}
        <div className="flex gap-2.5 justify-center flex-wrap py-7">
          <div className="inline-flex gap-1.5 items-baseline px-3.5 py-1.5 border border-foreground">
            <span className="font-body text-[10px] font-bold uppercase tracking-[0.12em] opacity-60">Tijd</span>
            <span className="font-body text-base">{recipe.time}</span>
          </div>
          <div className="inline-flex gap-1.5 items-baseline px-3.5 py-1.5 border border-foreground">
            <span className="font-body text-[10px] font-bold uppercase tracking-[0.12em] opacity-60">Porties</span>
            <span className="font-body text-base">{recipe.servings}</span>
          </div>
          <div className="inline-flex gap-1.5 items-baseline px-3.5 py-1.5 border border-foreground">
            <span className="font-body text-[10px] font-bold uppercase tracking-[0.12em] opacity-60">Niveau</span>
            <span className="font-body text-base">{recipe.level}</span>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1.9fr_3.1fr] gap-14 mt-6">
          {/* Ingredients */}
          <div>
            <h3 className="font-body text-[12px] font-bold uppercase tracking-[0.14em] opacity-80 mb-3.5">
              Ingrediënten
            </h3>
            <div className="py-5 border-t-2 border-b border-foreground/20">
              {/* Servings stepper */}
              <div className="flex justify-between items-center gap-4 mb-3.5">
                <label className="font-body text-[11px] font-bold tracking-[0.12em] uppercase">Personen</label>
                <div className="inline-flex items-center gap-2 border border-foreground px-2 py-0.5">
                  <button
                    type="button"
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-7 h-7 bg-transparent border-none font-body text-[15px] font-bold cursor-pointer hover:bg-foreground/5 transition-colors"
                  >
                    −
                  </button>
                  <span className="font-body text-base min-w-[24px] text-center">{servings}</span>
                  <button
                    type="button"
                    onClick={() => setServings(servings + 1)}
                    className="w-7 h-7 bg-transparent border-none font-body text-[15px] font-bold cursor-pointer hover:bg-foreground/5 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Ingredient list */}
              <ul className="list-none m-0 p-0">
                {recipe.ingredients.map((ing, idx) =>
                  ing.type === "divider" ? (
                    <li key={idx}>
                      <hr className="border-0 border-t border-foreground/20 my-3" />
                    </li>
                  ) : (
                    <li
                      key={idx}
                      className="grid grid-cols-[92px_1fr] gap-3 py-1.5 font-body text-[18px] leading-relaxed"
                    >
                      <span className="font-semibold">
                        {ing.qty !== null ? `${formatQty(ing.qty)} ${ing.unit}` : ""}
                      </span>
                      <span>{ing.label}</span>
                    </li>
                  )
                )}
              </ul>

              {/* Copy button */}
              <button
                type="button"
                onClick={copyIngredients}
                className="w-full mt-5 px-7 py-3 border border-foreground bg-transparent text-foreground font-body text-sm tracking-[0.12em] uppercase cursor-pointer hover:bg-foreground hover:text-primary-foreground transition-colors flex items-center justify-center gap-2"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Gekopieerd!" : "Kopieer ingrediëntenlijst"}
              </button>
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="font-body text-[12px] font-bold uppercase tracking-[0.14em] opacity-80 mb-3.5">
              Stappen
            </h3>
            <ol className="list-none m-0 p-0 counter-reset-step">
              {recipe.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="grid grid-cols-[42px_1fr] gap-3.5 py-3.5 border-b border-foreground/20 first:border-t-2"
                >
                  <span className="font-body text-[18px] font-bold leading-none mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="m-0 font-body text-[19px] leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Related recipes */}
        {relatedRecipes.length > 0 && (
          <div className="mt-20 w-screen -ml-[calc((100vw-100%)/2)] border-t border-foreground/20 pt-10">
            <div className="max-w-[860px] mx-auto px-6 pb-12">
              <h2 className="font-display text-[38px] leading-none mb-7 text-center">Meer om te koken</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {relatedRecipes.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/recipes/${r.slug}`}
                    className="block text-foreground no-underline group"
                  >
                    <div className="w-full aspect-square bg-foreground/10 overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover transition-all duration-200 group-hover:opacity-95 group-hover:-translate-y-0.5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <p className="mt-2.5 text-center font-body text-[18px] leading-tight">
                      {r.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="text-center mt-12 font-body text-base opacity-80">
          <Link to="/recipes" className="border-b border-foreground pb-px hover:opacity-70 transition-opacity">
            ← Alle recepten
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-14 text-center font-body text-base opacity-80">
          © Chef Lil J
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
