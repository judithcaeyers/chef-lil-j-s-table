// assets/js/app.js
// Bouwt recepten-grid + filters op basis van window.RECIPES

const gridEl = document.getElementById("grid");
const emptyStateEl = document.getElementById("emptyState");

/* =========================
   Helpers
========================= */

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesPrep(recipePrep, selectedPrep) {
  if (!selectedPrep.length) return true;
  const rp = recipePrep ?? Infinity;
  return selectedPrep.some(max => rp <= Number(max));
}

/* =========================
   Multiselect (pill dropdown)
========================= */

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createMultiSelect(el, options) {
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

  panel.innerHTML = options
    .map(opt => {
      const v = escapeHtml(opt.value);
      const t = escapeHtml(opt.text);
      return `
        <label class="ms-item">
          <input type="checkbox" value="${v}">
          <span>${t}</span>
        </label>
      `;
    })
    .join("");

  function updateLabel() {
    const checked = panel.querySelectorAll("input:checked").length;
    lbl.textContent = checked ? `${label} (${checked})` : label;
  }

  function open() {
    el.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  }

  function close() {
    el.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", () => {
    el.classList.contains("is-open") ? close() : open();
  });

  // close when clicking outside
  document.addEventListener("click", (e) => {
    if (!el.contains(e.target)) close();
  });

  // update on check/uncheck
  panel.addEventListener("change", () => {
    updateLabel();
    el.dispatchEvent(new CustomEvent("ms:change"));
  });

  updateLabel();

  return {
    getValues: () => [...panel.querySelectorAll("input:checked")].map(i => i.value),
    clear: () => {
      panel.querySelectorAll("input").forEach(i => (i.checked = false));
      updateLabel();
      el.dispatchEvent(new CustomEvent("ms:change"));
    }
  };
}

/* =========================
   Build filter options from RECIPES
========================= */

function buildIngredientOptionsFromRecipes(recipes) {
  const set = new Set();

  recipes.forEach(recipe => {
    (recipe.ingredientsFilter || []).forEach(i => {
      if (i) set.add(i.trim());
    });
  });

  const sorted = Array.from(set).sort((a, b) =>
    a.localeCompare(b, "nl", { sensitivity: "base" })
  );

  return sorted.map(name => ({ value: name, text: name }));
}

/* =========================
   Filtering logic
========================= */

function recipeMatchesFilters(recipe, state) {
  const { selIngredients, selSfeer, selDieet, selPrep, search } = state;

  // Ingrediënten (AND)
  if (selIngredients.length) {
    const rIngs = (recipe.ingredientsFilter || []).map(normalize);
    if (!selIngredients.every(i => rIngs.includes(normalize(i)))) {
      return false;
    }
  }

  // Sfeer (OR)
  if (selSfeer.length) {
    if (!recipe.sfeer || !selSfeer.some(s => recipe.sfeer.includes(s))) {
      return false;
    }
  }

  // Dieet (OR)
  if (selDieet.length) {
    if (!recipe.dieet || !selDieet.some(d => recipe.dieet.includes(d))) {
      return false;
    }
  }

  // Prep tijd
  if (!matchesPrep(recipe.prep, selPrep)) {
    return false;
  }

  // Vrije zoek
  if (search) {
    const haystack = normalize(
      [
        recipe.title,
        recipe.description,
        ...(recipe.ingredientsFilter || [])
      ].join(" ")
    );
    if (!haystack.includes(search)) return false;
  }

  return true;
}

/* =========================
   Rendering
========================= */

function createCard(recipe) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = `pages/recept.html?slug=${recipe.slug}`;

  const img = document.createElement("img");
  img.src = recipe.image;
  img.alt = recipe.title;

  const titleWrap = document.createElement("div");
  titleWrap.className = "card-title";

  const title = document.createElement("div");
  title.className = "caps";
  title.textContent = recipe.title;

  titleWrap.appendChild(title);
  a.appendChild(img);
  a.appendChild(titleWrap);

  return a;
}

function renderGrid(recipes, state) {
  gridEl.innerHTML = "";

  const matches = recipes.filter(r => recipeMatchesFilters(r, state));

  if (!matches.length) {
    emptyStateEl.classList.add("show");
    return;
  }

  emptyStateEl.classList.remove("show");
  matches.forEach(r => gridEl.appendChild(createCard(r)));
}

/* =========================
   Init + Events
========================= */

document.addEventListener("DOMContentLoaded", () => {
  if (!window.RECIPES || !Array.isArray(window.RECIPES)) {
    console.error("RECIPES niet geladen.");
    return;
  }

  const recipes = window.RECIPES;

  // elements
  const elIng = document.getElementById("f-ingredient");
  const elSfeer = document.getElementById("f-sfeer");
  const elDieet = document.getElementById("f-dieet");
  const elPrep = document.getElementById("f-prep");

  const searchInput = document.getElementById("searchInput");
  const toggleBtn = document.getElementById("searchToggle");
  const clearBtn = document.getElementById("clearFilters");

  // build multiselects
  const ingMS = createMultiSelect(elIng, buildIngredientOptionsFromRecipes(recipes));

  const sfeerMS = createMultiSelect(elSfeer, [
    { value: "fris", text: "fris" },
    { value: "comfort", text: "comfort" },
    { value: "weeknight", text: "weeknight" },
    { value: "spicy", text: "spicy" },
    { value: "feest", text: "feest" },
    { value: "brunch", text: "brunch" }
  ]);

  const dieetMS = createMultiSelect(elDieet, [
    { value: "vegan", text: "vegan" },
    { value: "vegetarisch", text: "vegetarisch" },
    { value: "glutenvrij", text: "glutenvrij" },
    { value: "lactosevrij", text: "lactosevrij" }
  ]);

  const prepMS = createMultiSelect(elPrep, [
    { value: "15", text: "≤ 15 min" },
    { value: "30", text: "≤ 30 min" },
    { value: "45", text: "≤ 45 min" },
    { value: "60", text: "≤ 60 min" },
    { value: "120", text: "≤ 120 min" }
  ]);

  function getState() {
    return {
      selIngredients: ingMS.getValues(),
      selSfeer: sfeerMS.getValues(),
      selDieet: dieetMS.getValues(),
      selPrep: prepMS.getValues(),
      search: normalize(searchInput?.value || "")
    };
  }

  function rerender() {
    renderGrid(recipes, getState());
  }

  // bind multiselect events
  [elIng, elSfeer, elDieet, elPrep].forEach(el => {
    if (el) el.addEventListener("ms:change", rerender);
  });

  // search events
  if (searchInput) {
    searchInput.addEventListener("input", rerender);
  }

  if (toggleBtn && searchInput) {
    toggleBtn.addEventListener("click", () => {
      searchInput.classList.toggle("show");
      if (searchInput.classList.contains("show")) searchInput.focus();
    });
  }

  // clear
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      ingMS.clear();
      sfeerMS.clear();
      dieetMS.clear();
      prepMS.clear();
      if (searchInput) searchInput.value = "";
      rerender();
    });
  }

  // first render
  rerender();
});
