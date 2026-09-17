// assets/js/recipe.js

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

function findRecipeBySlug(slug) {
  if (!window.RECIPES || !Array.isArray(window.RECIPES)) return null;
  return window.RECIPES.find(r => r.slug === slug) || null;
}

function formatNumberNL(n) {
  // Rond af op 1 decimaal, maar toon geen .0
  const rounded = Math.round(n * 10) / 10;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded).replace(".", ",");
}

function formatQty(qty, unit) {
  if (qty === null || qty === undefined || qty === "") return "";
  const num = typeof qty === "number" ? qty : parseFloat(qty);
  if (Number.isNaN(num)) return unit ? `${qty} ${unit}` : String(qty);
  const s = formatNumberNL(num);
  return unit ? `${s} ${unit}` : s;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value ?? "";
}

function renderError(message) {
  setText("recipe-kicker", "");
  setText("recipe-title", "Recept niet gevonden");
  setText("recipe-subtitle", message);

  setText("meta-time", "");
  setText("meta-servings", "");
  setText("meta-level", "");

  const ingList = document.getElementById("ing-list");
  const stepList = document.getElementById("step-list");
  if (ingList) ingList.innerHTML = "";
  if (stepList) stepList.innerHTML = "";
}

function renderRecipe(recipe) {
  // Document title
  document.title = `${recipe.title} — Chef Lil J`;

  // Header block
  setText("recipe-kicker", recipe.kicker || "");
  setText("recipe-title", recipe.title || "");
  setText("recipe-subtitle", recipe.description || "");

  // Meta
  setText("meta-time", recipe.time || "");
  setText("meta-level", recipe.level || "");

  const baseServings = recipe.servings ?? 2;
  let currentServings = baseServings;

  const servingsOut = document.getElementById("servings");
  const metaServings = document.getElementById("meta-servings");
  if (servingsOut) servingsOut.textContent = baseServings;
  if (metaServings) metaServings.textContent = baseServings;

  // Ingredients list build
  const ingList = document.getElementById("ing-list");
  if (!ingList) return;
  ingList.innerHTML = "";

  (recipe.ingredients || []).forEach(item => {
    if (item && item.type === "divider") {
      const hr = document.createElement("hr");
      hr.className = "subdivider";
      ingList.appendChild(hr);
      return;
    }

    const li = document.createElement("li");
    li.dataset.qty = item?.qty ?? "";
    li.dataset.unit = item?.unit ?? "";

    const qtySpan = document.createElement("span");
    qtySpan.className = "ing-qty";
    qtySpan.textContent = formatQty(item?.qty, item?.unit);

    const labelSpan = document.createElement("span");
    labelSpan.textContent = item?.label ?? "";

    li.appendChild(qtySpan);
    li.appendChild(labelSpan);
    ingList.appendChild(li);
  });

  // Steps build
  const stepList = document.getElementById("step-list");
  if (stepList) {
    stepList.innerHTML = "";
    (recipe.steps || []).forEach(text => {
      const li = document.createElement("li");
      li.className = "step";
      const p = document.createElement("p");
      p.textContent = text;
      li.appendChild(p);
      stepList.appendChild(li);
    });
  }

  function renderQuantities(servings) {
    [...ingList.querySelectorAll("li[data-qty]")].forEach(li => {
      const baseQty = parseFloat(li.dataset.qty);
      const unit = li.dataset.unit || "";
      const qtyEl = li.querySelector(".ing-qty");

      // Als qty geen nummer is: laat staan
      if (Number.isNaN(baseQty) || !qtyEl) return;

      const scaled = baseQty * (servings / baseServings);
      qtyEl.textContent = formatQty(scaled, unit);
    });
  }

  function updateServings(n) {
    currentServings = Math.max(1, n);
    if (servingsOut) servingsOut.textContent = currentServings;
    if (metaServings) metaServings.textContent = currentServings;
    renderQuantities(currentServings);
  }

  // Listeners (1x, na render)
  const btnMinus = document.getElementById("btn-minus");
  const btnPlus = document.getElementById("btn-plus");
  const btnCopy = document.getElementById("copy-btn");

  if (btnMinus) {
    btnMinus.addEventListener("click", () => updateServings(currentServings - 1));
  }
  if (btnPlus) {
    btnPlus.addEventListener("click", () => updateServings(currentServings + 1));
  }

  if (btnCopy) {
    btnCopy.addEventListener("click", async () => {
      const servings = servingsOut ? servingsOut.textContent : String(currentServings);

      const lines = [];
      lines.push(`${recipe.title} – ingrediënten (${servings} personen)`);
      lines.push("");

      [...ingList.querySelectorAll("li[data-qty]")].forEach(li => {
        const qtyText = li.querySelector(".ing-qty")?.textContent?.trim() || "";
        const name = li.querySelector("span:last-child")?.textContent?.trim() || "";
        if (qtyText || name) lines.push(`- ${qtyText} ${name}`.trim());
      });

      try {
        await navigator.clipboard.writeText(lines.join("\n"));
        const old = btnCopy.textContent;
        btnCopy.textContent = "Gekopieerd!";
        setTimeout(() => (btnCopy.textContent = old), 1500);
      } catch (e) {
        alert("Kopiëren lukt niet in deze browser. Selecteer en kopieer handmatig.");
      }
    });
  }

  // Initial quantities
  renderQuantities(baseServings);

renderMoreRecipes(recipe);

}

document.addEventListener("DOMContentLoaded", () => {
  const slug = getSlug();

  if (!slug) {
    renderError("Er ontbreekt een slug in de URL. Gebruik bv. recept.html?slug=bietello-tonato");
    return;
  }

  const recipe = findRecipeBySlug(slug);

  if (!recipe) {
    renderError(`Geen recept gevonden voor slug: "${slug}".`);
    return;
  }

  renderRecipe(recipe);
});

function renderMoreRecipes(currentRecipe) {
  const container = document.getElementById("more-grid");
  if (!container) return;

  // simpele score: gedeelde sfeer + gedeelde ingrediënten
  function score(a, b) {
    let s = 0;

    if (a.sfeer && b.sfeer) {
      s += a.sfeer.filter(x => b.sfeer.includes(x)).length * 2;
    }

    if (a.ingredientsFilter && b.ingredientsFilter) {
      s += a.ingredientsFilter.filter(x =>
        b.ingredientsFilter.includes(x)
      ).length;
    }

    return s;
  }

  const suggestions = RECIPES
    .filter(r => r.slug !== currentRecipe.slug)
    .map(r => ({ recipe: r, score: score(currentRecipe, r) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(x => x.recipe);

  container.innerHTML = "";

  suggestions.forEach(r => {
    const a = document.createElement("a");
    a.className = "more-card";
    a.href = `recept.html?slug=${r.slug}`;

    const img = document.createElement("img");
    img.src = `../${r.image}`;
    img.alt = r.title;

    const title = document.createElement("div");
    title.className = "more-card-title";
    title.textContent = r.title;

    a.appendChild(img);
    a.appendChild(title);
    container.appendChild(a);
  });
}
