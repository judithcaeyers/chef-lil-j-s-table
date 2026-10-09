const gridEl = document.getElementById("grid");
const emptyStateEl = document.getElementById("emptyState");
const resultCountEl = document.getElementById("resultCount");

function normalize(str = "") {
  return String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function escapeHtml(str = "") {
  return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function createMultiSelect(el, options) {
  if (!el) {
    return {
      getValues: () => [],
      clear: () => {}
    };
  }

  const label = el.dataset.label || "Filter";
  el.innerHTML = `
    <button type="button" class="ms-btn" aria-haspopup="listbox" aria-expanded="false">
      <span class="ms-label">${escapeHtml(label)}</span>
      <span class="ms-caret" aria-hidden="true"></span>
    </button>
    <div class="ms-panel" role="listbox" aria-label="${escapeHtml(label)}"></div>
  `;
  const btn = el.querySelector(".ms-btn");
  const lbl = el.querySelector(".ms-label");
  const panel = el.querySelector(".ms-panel");
  panel.innerHTML = options.map(opt => `
    <label class="ms-item">
      <input type="checkbox" value="${escapeHtml(opt.value)}">
      <span>${escapeHtml(opt.text)}</span>
    </label>
  `).join("");
  function updateLabel() {
    const checked = panel.querySelectorAll("input:checked").length;
    lbl.textContent = checked ? `${label} (${checked})` : label;
  }
  function close() {
    el.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }
  btn.addEventListener("click", () => {
    const open = el.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", e => { if (!el.contains(e.target)) close(); });
  panel.addEventListener("change", () => {
    updateLabel();
    el.dispatchEvent(new CustomEvent("ms:change"));
  });
  return {
    getValues: () => [...panel.querySelectorAll("input:checked")].map(i => i.value),
    clear: () => {
      panel.querySelectorAll("input").forEach(i => { i.checked = false; });
      updateLabel();
    }
  };
}
function buildIngredientOptionsFromRecipes(recipes) {
  const values = new Set();
  recipes.forEach(recipe => (recipe.ingredientsFilter || []).forEach(i => { if (i) values.add(i.trim()); }));
  return [...values].sort((a, b) => a.localeCompare(b, "nl", { sensitivity: "base" })).map(name => ({ value: name, text: name }));
}
function recipeMatchesFilters(recipe, state) {
  const { selIngredients, selType, selDieet, search } = state;
  if (selIngredients.length) {
    const recipeIngredients = (recipe.ingredientsFilter || []).map(normalize);
    if (!selIngredients.every(i => recipeIngredients.includes(normalize(i)))) return false;
  }
  if (selType.length && (!recipe.type || !selType.some(t => recipe.type.includes(t)))) return false;
  if (selDieet.length && (!recipe.dieet || !selDieet.some(d => recipe.dieet.includes(d)))) return false;
  if (search) {
    const haystack = normalize([recipe.title, recipe.description, ...(recipe.ingredientsFilter || []), ...(recipe.type || [])].join(" "));
    if (!haystack.includes(search)) return false;
  }
  return true;
}
function createCard(recipe) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = `pages/recept.html?slug=${recipe.slug}`;
  const media = document.createElement("div");
  media.className = "card-media";
  const overviewImage = recipe.overviewImage || recipe.image;
  if (overviewImage) {
    const img = document.createElement("img");
    img.src = overviewImage;
    img.alt = recipe.title;
    img.loading = "lazy";
    media.appendChild(img);
  }
  const content = document.createElement("div");
  content.className = "card-content";
  const title = document.createElement("div");
  title.className = "card-name";
  title.textContent = recipe.title;
  content.append(title);
  a.append(media, content);
  return a;
}
function renderGrid(recipes, state) {
  gridEl.innerHTML = "";
  const matches = recipes.filter(r => recipeMatchesFilters(r, state));
  emptyStateEl.classList.toggle("show", matches.length === 0);
  if (resultCountEl) resultCountEl.textContent = `${matches.length} ${matches.length === 1 ? "recept" : "recepten"}`;
  matches.forEach(r => gridEl.appendChild(createCard(r)));
}
document.addEventListener("DOMContentLoaded", () => {
  if (!Array.isArray(window.RECIPES)) return;
  const recipes = window.RECIPES;
  const elIng = document.getElementById("f-ingredient");
  const elType = document.getElementById("f-type");
  const elDieet = document.getElementById("f-dieet");
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearFilters");

  const ingMS = createMultiSelect(elIng, buildIngredientOptionsFromRecipes(recipes));
  const typeMS = createMultiSelect(elType, [
    { value: "ontbijt", text: "Ontbijt" },
    { value: "brunch", text: "Brunch" },
    { value: "lunch", text: "Lunch" },
    { value: "dinner", text: "Dinner" },
    { value: "tapas", text: "Tapas / hapjes" },
    { value: "voorgerecht", text: "Voorgerecht" },
    { value: "bijgerecht", text: "Bijgerecht" },
    { value: "dessert", text: "Dessert" },
    { value: "brood", text: "Brood" },
    { value: "saus", text: "Saus" },
    { value: "bakken", text: "Bakken" }
  ]);
  const dieetMS = createMultiSelect(elDieet, [
    { value: "vegan", text: "Vegan" },
    { value: "vegetarisch", text: "Vegetarisch" },
    { value: "glutenvrij", text: "Glutenvrij" },
    { value: "lactosevrij", text: "Lactosevrij" },
    { value: "histamine-arm", text: "Histamine-arm" }
  ]);

  function getState() {
    return {
      selIngredients: ingMS.getValues(),
      selType: typeMS.getValues(),
      selDieet: dieetMS.getValues(),
      search: normalize(searchInput?.value || "")
    };
  }
  const rerender = () => renderGrid(recipes, getState());
  [elIng, elType, elDieet].filter(Boolean).forEach(el => el.addEventListener("ms:change", rerender));
  searchInput?.addEventListener("input", rerender);
  clearBtn?.addEventListener("click", () => {
    ingMS.clear();
    typeMS.clear();
    dieetMS.clear();
    if (searchInput) searchInput.value = "";
    rerender();
  });
  rerender();
});