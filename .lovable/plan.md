# Receptensite (frigo) integreren onder /recipes

## Doel
Judith's zelfgeprogrammeerde receptenwebsite (github.com/judithcaeyers/frigo — pure HTML/CSS/JS) draait voortaan op deze site onder `/recipes`, met haar eigen structuur en code behouden, zodat ze er zelf in haar eigen stijl op verder kan werken in één gecombineerde GitHub-repo.

## Aanpak: statische integratie (structuur 100% behouden)

Haar site blijft gewoon HTML/CSS/JS — geen rewrite naar React. Haar bestanden worden 1-op-1 gekopieerd naar `public/recepten/`, zodat ze door zowel Vercel als GitHub Pages als echte bestanden geserveerd worden.

### 1. Bestanden kopiëren uit de frigo-repo
Bron: `https://github.com/judithcaeyers/frigo` (main branch, via raw.githubusercontent of git clone in /tmp).

Doelstructuur in dit project:
```
public/recepten/
├── index.html              (haar receptenoverzicht met filters)
├── pages/recept.html       (haar detailpagina)
├── assets/
│   ├── css/base.css, home.css, recipe.css
│   ├── js/app.js, recipe.js
│   ├── data/recipes.js     (haar receptendata)
│   ├── images/…PNG         (alle receptfoto's)
│   └── logo.PNG
```
Al haar relatieve paden (`assets/...`, `pages/recept.html`) blijven werken, zowel lokaal, op Vercel als op GitHub Pages (`/chef-lil-j-s-table/recepten/`).

De extra experimentpagina's `dinnerclub.html` en `supperclub.html` worden niet overgenomen.

### 2. Routing in de app aanpassen
- In `src/App.tsx` de React-routes `/recipes` en `/recipes/:slug` verwijderen — haar statische bestanden krijgen voorrang en de React-versies zijn dan overbodig.
- De React-bestanden `src/pages/Recipes.tsx`, `src/pages/RecipeDetail.tsx` en `src/data/recipes.ts` worden uit de routing gehaald (verwijderen, ze staan in de git-history als referentie).
- Link in de navigatie/homepage die nu naar de React-receptenpagina of Instagram wijst, vervangen door een echte link naar `/recepten/` (gewone `<a href>` zodat de browser naar haar pagina navigeert in plaats van client-side routing).
- Terug-link in haar `index.html` ("Terug naar…") waar nodig laten wijzen naar de homepage van de dinnerclub-site — enkel dat ene pad, haar styling/structuur blijft intact.

### 3. Hosting-checks (GitHub Pages + Vercel)
- **Vercel**: statische bestanden in `public/` worden automatisch geserveerd vóór de SPA-rewrite; geen wijziging nodig in `vercel.json`. Wel verifiëren.
- **GitHub Pages**: `public/recepten/index.html` wordt `…/chef-lil-j-s-table/recepten/index.html` — directory-index werkt daar standaard. Haar relatieve paden blijven correct.
- Haar Google-Fonts-links en inline SVG-pictogrammen blijven gewoon staan.

### 4. GitHub-koppeling (antwoord op de hoofdvraag)
Eén repo per site: na deze merge bevat de repo van dit project de volledige frigo-code onder `public/recepten/`. Via de GitHub-sync van dit project kan Judith lokaal in haar eigen editor aan `public/recepten/` blijven werken en pushen — het synct automatisch naar de live site. Haar oorspronkelijke `frigo`-repo blijft bestaan (kan ze later archiveren); het advies is om daar niet langer parallel te werken, anders lopen de twee uiteen.

### 5. Verificatie
- Build controleren.
- Playwright: `/recipes/` toont haar overzicht met filters, een receptdetail opent (`pages/recept.html?...`), terug-link naar home werkt.
- Screenshot desktop + mobiel ter controle.

## Niet in dit plan (optioneel later)
- Compressie van de grote PNG-foto's (tot 5 MB) — haar bestanden blijven nu exact zoals ze zijn.
- Het eventueel schrappen/archiveren van de oude frigo-repo op GitHub.
