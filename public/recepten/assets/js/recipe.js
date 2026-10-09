function getSlug() { return new URLSearchParams(window.location.search).get("slug"); }
function findRecipeBySlug(slug) { return Array.isArray(window.RECIPES) ? window.RECIPES.find(r => r.slug === slug) || null : null; }
function formatNumberNL(n) {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(".", ",");
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
  if (el) el.textContent = value ?? "";
}
function renderError(message) {
  setText("recipe-title", "Recept niet gevonden");
  setText("recipe-subtitle", message);
}
function renderRecipe(recipe) {
  document.title = `${recipe.title} — Chef Lil J`;
  setText("recipe-kicker", recipe.kicker || recipe.type?.[0] || "");
  setText("recipe-title", recipe.title || "");
  setText("recipe-subtitle", recipe.description || "");
  setText("meta-time", recipe.time || "");
  setText("meta-level", recipe.level || "");

  const imageWrap = document.getElementById("recipe-image-wrap");
  const image = document.getElementById("recipe-image");
  const useStepPlanAsHero = Boolean(recipe.detailImage) &&
    ["pizza-basisdeeg", "vietnamese-spring-rolls"].includes(recipe.slug);
  const heroImage = useStepPlanAsHero ? recipe.detailImage : recipe.image;
  if (heroImage && image && imageWrap) {
    image.src = `../${heroImage}`;
    image.alt = useStepPlanAsHero
      ? recipe.detailImageAlt || `Stappenplan voor ${recipe.title}`
      : recipe.title;
    if (useStepPlanAsHero) {
      image.style.aspectRatio = "auto";
      image.style.height = "auto";
      image.style.objectFit = "contain";
    }
    imageWrap.hidden = false;
  }

  const referenceImageWrap = document.getElementById("recipe-reference-image-wrap");
  const referenceImage = document.getElementById("recipe-reference-image");
  if (recipe.detailImage && !useStepPlanAsHero && referenceImage && referenceImageWrap) {
    referenceImage.src = `../${recipe.detailImage}`;
    referenceImage.alt = recipe.detailImageAlt || `Stappenplan voor ${recipe.title}`;
    referenceImageWrap.hidden = false;
  }

  const notesSection = document.getElementById("recipe-notes-section");
  if (recipe.notes && notesSection) {
    setText("recipe-notes", recipe.notes);
    notesSection.hidden = false;
  }

  const baseServings = recipe.servings ?? 2;
  let currentServings = baseServings;
  const servingsOut = document.getElementById("servings");
  const metaServings = document.getElementById("meta-servings");
  if (servingsOut) servingsOut.textContent = baseServings;
  if (metaServings) metaServings.textContent = baseServings;

  const ingList = document.getElementById("ing-list");
  if (!ingList) return;
  (recipe.ingredients || []).forEach(item => {
    if (item?.type === "divider") {
      const divider = document.createElement("li");
      divider.className = "ingredient-section-divider";
      if (item.label) {
        const heading = document.createElement("div");
        heading.className = "ingredient-section-title";
        heading.textContent = item.label;
        divider.appendChild(heading);
      } else {
        divider.setAttribute("aria-hidden", "true");
        divider.innerHTML = '<hr class="subdivider">';
      }
      ingList.appendChild(divider);
      return;
    }
    const li = document.createElement("li");
    li.dataset.qty = item?.qty ?? "";
    li.dataset.unit = item?.unit ?? "";
    const qty = document.createElement("span");
    qty.className = "ing-qty";
    qty.textContent = formatQty(item?.qty, item?.unit);
    let label;
    if (item?.linkTo) {
      label = document.createElement("a");
      label.className = "ingredient-name ingredient-recipe-link";
      label.href = `recept.html?slug=${item.linkTo}`;
    } else {
      label = document.createElement("span");
      label.className = "ingredient-name";
    }
    label.textContent = item?.label ?? "";
    li.append(qty, label);
    ingList.appendChild(li);
  });

  const stepList = document.getElementById("step-list");
  (recipe.steps || []).forEach(text => {
    const li = document.createElement("li");
    li.className = "step";
    const p = document.createElement("p");
    p.textContent = text;
    li.appendChild(p);
    stepList?.appendChild(li);
  });

  function renderQuantities(servings) {
    [...ingList.querySelectorAll("li[data-qty]")].forEach(li => {
      const baseQty = parseFloat(li.dataset.qty);
      const qtyEl = li.querySelector(".ing-qty");
      if (Number.isNaN(baseQty) || !qtyEl) return;
      qtyEl.textContent = formatQty(baseQty * (servings / baseServings), li.dataset.unit || "");
    });
  }
  function updateServings(n) {
    currentServings = Math.max(1, n);
    if (servingsOut) servingsOut.textContent = currentServings;
    if (metaServings) metaServings.textContent = currentServings;
    renderQuantities(currentServings);
  }
  document.getElementById("btn-minus")?.addEventListener("click", () => updateServings(currentServings - 1));
  document.getElementById("btn-plus")?.addEventListener("click", () => updateServings(currentServings + 1));

  const copyBtn = document.getElementById("copy-btn");
  copyBtn?.addEventListener("click", async () => {
    const lines = [`${recipe.title} – ingrediënten (${currentServings} personen)`, ""];
    [...ingList.querySelectorAll("li[data-qty]")].forEach(li => {
      const qty = li.querySelector(".ing-qty")?.textContent?.trim() || "";
      const name = li.querySelector(".ingredient-name")?.textContent?.trim() || "";
      if (qty || name) lines.push(`- ${qty} ${name}`.trim());
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      const old = copyBtn.textContent;
      copyBtn.textContent = "Gekopieerd!";
      setTimeout(() => { copyBtn.textContent = old; }, 1500);
    } catch {
      alert("Kopiëren lukt niet in deze browser.");
    }
  });

  const shareBtn = document.getElementById("share-btn");
  shareBtn?.addEventListener("click", async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: recipe.title, text: recipe.description || "", url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        const old = shareBtn.textContent;
        shareBtn.textContent = "Link gekopieerd";
        setTimeout(() => { shareBtn.textContent = old; }, 1500);
      }
    } catch (error) {
      if (error?.name !== "AbortError") console.error(error);
    }
  });

  renderQuantities(baseServings);
  renderRelatedRecipes(recipe);
  renderMoreRecipes(recipe);
}

function renderRelatedRecipes(recipe) {
  const section = document.getElementById("related-recipes");
  const list = document.getElementById("related-recipes-list");
  if (!section || !list || !Array.isArray(recipe.relatedRecipes) || !recipe.relatedRecipes.length) return;

  list.innerHTML = "";
  recipe.relatedRecipes.forEach(item => {
    const a = document.createElement("a");
    a.className = "related-recipe-link";
    a.href = `recept.html?slug=${item.slug}`;
    a.textContent = item.label;
    list.appendChild(a);
  });

  section.hidden = false;
}
function renderMoreRecipes(currentRecipe) {
  const container = document.getElementById("more-grid");
  if (!container || !Array.isArray(window.RECIPES)) return;
  function score(a, b) {
    let s = 0;
    if (a.type && b.type) s += a.type.filter(x => b.type.includes(x)).length * 2;
    if (a.ingredientsFilter && b.ingredientsFilter) s += a.ingredientsFilter.filter(x => b.ingredientsFilter.includes(x)).length;
    return s;
  }
  const suggestions = window.RECIPES
    .filter(r => r.slug !== currentRecipe.slug)
    .map(r => ({ recipe: r, score: score(currentRecipe, r) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(x => x.recipe);

  suggestions.forEach(r => {
    const a = document.createElement("a");
    a.className = "more-card";
    a.href = `recept.html?slug=${r.slug}`;
    const media = document.createElement("div");
    media.className = "more-card-media";
    if (r.image) {
      const img = document.createElement("img");
      img.src = `../${r.image}`;
      img.alt = r.title;
      img.loading = "lazy";
      media.appendChild(img);
    }
    const title = document.createElement("div");
    title.className = "more-card-title";
    title.textContent = r.title;
    a.append(media, title);
    container.appendChild(a);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const slug = getSlug();
  if (!slug) return renderError("Er ontbreekt een recept in de URL.");
  const recipe = findRecipeBySlug(slug);
  if (!recipe) return renderError(`Geen recept gevonden voor "${slug}".`);
  renderRecipe(recipe);
});