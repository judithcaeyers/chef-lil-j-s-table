// assets/data/recipes.js
// Centrale databron voor ALLE recepten

window.RECIPES = [
  {
    slug: "komkommer-edamame",
    kicker: "Salade",
    title: "Komkommer–edamame salade",
    description: "Fris, knapperig en perfect als lichte lunch of bijgerecht.",
    time: "15 min",
    prep: 15,
    servings: 2,
    level: "Supersimpel",
    sfeer: ["fris"],
    dieet: ["vegan", "vegetarisch", "lactosevrij"],
    ingredientsFilter: ["komkommer","edamame","koriander","pinda","ui","chili","soyasaus"],
    image: "assets/images/komkommer-edamame.PNG",
    ingredients: [
      { qty: 1, unit: "st", label: "komkommer" },
      { qty: 150, unit: "g", label: "edamame" },
      { qty: 1, unit: "handje", label: "koriander" },
      { qty: 30, unit: "g", label: "pinda’s" },
      { qty: 0.5, unit: "st", label: "ui" },
      { qty: 1, unit: "tl", label: "chilivlokken" },
      { qty: 1, unit: "el", label: "sojasaus" }
    ],
    steps: [
      "Snij de komkommer in blokjes.",
      "Kook of ontdooi de edamame.",
      "Meng alles samen met sojasaus en chilivlokken.",
      "Werk af met pinda’s en koriander."
    ]
  },


{
  slug: "schnitzel-rosti-peperroomsaus",
  kicker: "Comfort",
  title: "Schnitzel met rösti, peperroomsaus & appelmoes",
  description: "Krokante schnitzel met rösti’s, romige peperroomsaus, appelmoes en een fris slaatje met limoenpeperdressing.",
  time: "± 40 min",
  prep: 40,
  servings: 1,
  level: "Makkelijk",
  sfeer: ["comfort", "weeknight"],
  dieet: [],
  ingredientsFilter: [
    "schnitzel",
    "aardappel",
    "room",
    "peper",
    "appel",
    "sla",
    "spinazie",
    "tomaat",
    "komkommer",
    "lente-ui",
    "limoen",
    "citroen"
  ],
  image: "assets/images/schnitzel-rosti.PNG",

  ingredients: [
    { qty: 1, unit: "st", label: "schnitzel" },
    { qty: 1, unit: "st", label: "ei" },
    { qty: 20, unit: "g", label: "bloem" },
    { qty: 30, unit: "g", label: "panko of paneermeel" },
    { qty: null, unit: "", label: "zout" },
    { qty: null, unit: "", label: "peper" },
    { qty: null, unit: "", label: "boter of olie om te bakken" },

    { type: "divider" },

    { qty: 200, unit: "g", label: "aardappel" },
    { qty: null, unit: "", label: "zout" },
    { qty: null, unit: "", label: "boter of olie om de rösti’s te bakken" },

    { type: "divider" },

    { qty: 100, unit: "ml", label: "room" },
    { qty: 0.5, unit: "tl", label: "grof gemalen zwarte peper" },
    { qty: 0.5, unit: "tl", label: "groene peperbolletjes, optioneel" },
    { qty: 0.5, unit: "tl", label: "mosterd" },
    { qty: null, unit: "", label: "zout" },

    { type: "divider" },

    { qty: 75, unit: "g", label: "appelmoes" },

    { type: "divider" },

    { qty: 1, unit: "hand", label: "sla" },
    { qty: 1, unit: "hand", label: "verse spinazie" },
    { qty: 0.5, unit: "st", label: "tomaat" },
    { qty: 0.25, unit: "st", label: "komkommer" },
    { qty: 1, unit: "stengel", label: "lente-ui" },

    { type: "divider" },

    { qty: 1, unit: "tl", label: "mayonaise" },
    { qty: 1, unit: "el", label: "olijfolie" },
    { qty: null, unit: "", label: "limoenpeper" },

    { type: "divider" },

    { qty: 0.25, unit: "st", label: "citroen, als garnituur" }
  ],

  steps: [
    "Begin met de rösti’s. Rasp de aardappel grof en knijp er zoveel mogelijk vocht uit. Meng met een snuf zout.",
    "Vorm kleine platte rösti’s en bak ze in boter of olie op middelhoog vuur tot ze aan beide kanten goudbruin en krokant zijn.",
    "Kruid de schnitzel met zout en peper.",
    "Haal de schnitzel eerst door de bloem, vervolgens door het losgeklopte ei en ten slotte door de panko of het paneermeel.",
    "Bak de schnitzel in een royale hoeveelheid boter of olie tot de korst goudbruin en krokant is en het vlees gaar is.",
    "Maak de peperroomsaus in dezelfde pan. Verwijder eventueel overtollig bakvet, maar laat de aanbaksels zitten.",
    "Voeg de room, zwarte peper, eventueel groene peperbolletjes en mosterd toe. Laat zachtjes inkoken tot een romige saus. Proef en kruid indien nodig bij met zout.",
    "Maak het slaatje door sla, spinazie, tomaat, komkommer en fijngesneden lente-ui te mengen.",
    "Meng voor de dressing de mayonaise met olijfolie en limoenpeper. Voeg eventueel een klein scheutje water toe als de dressing te dik is.",
    "Meng de dressing vlak voor het serveren door het slaatje.",
    "Serveer de schnitzel met de krokante rösti’s, peperroomsaus, appelmoes en het frisse slaatje. Werk af met een stukje citroen."
  ],

  notes: "Bak de schnitzel in voldoende vet zodat de korst mooi krokant en luchtig wordt. Serveer de citroen apart zodat je die vlak voor het eten over de schnitzel kan uitknijpen."
},

{
  slug: "beef-tataki",
  kicker: "Starter",
  title: "Beef tataki",
  description: "Kort aangebakken rundvlees met een frisse, zoute dressing van soja, limoen en sesam. Rosé vanbinnen, veel smaak erbuiten.",
  time: "± 25 min + rusttijd",
  prep: 25,
  servings: 2,
  level: "Makkelijk",
  sfeer: ["fris", "feest"],
  dieet: [],
  ingredientsFilter: [
    "rundvlees",
    "sojasaus",
    "limoen",
    "rijstazijn",
    "sesamolie",
    "look",
    "gember",
    "lente-ui",
    "sesam"
  ],
  image: "assets/images/beef-tataki.PNG",

  ingredients: [
    { qty: 250, unit: "g", label: "rundvlees, bv. ossenhaas of entrecote" },
    { qty: null, unit: "", label: "zout" },
    { qty: null, unit: "", label: "zwarte peper" },
    { qty: 1, unit: "el", label: "neutrale olie om te bakken" },

    { type: "divider" },

    { qty: 2, unit: "el", label: "sojasaus" },
    { qty: 1, unit: "el", label: "rijstazijn" },
    { qty: 0.5, unit: "st", label: "limoen, sap" },
    { qty: 1, unit: "tl", label: "sesamolie" },
    { qty: 1, unit: "tl", label: "honing" },
    { qty: 0.5, unit: "teentje", label: "look, fijn geraspt" },
    { qty: 1, unit: "tl", label: "verse gember, fijn geraspt" },

    { type: "divider" },

    { qty: 1, unit: "stengel", label: "lente-ui" },
    { qty: 1, unit: "tl", label: "sesamzaad" },
    { qty: null, unit: "", label: "koriander, optioneel" },
    { qty: 0.25, unit: "st", label: "limoen, als garnituur" }
  ],

  steps: [
    "Haal het rundvlees ongeveer 20 minuten voor het bakken uit de koelkast en dep het goed droog.",
    "Kruid rondom met zout en zwarte peper.",
    "Verhit een pan zeer heet met een klein beetje neutrale olie.",
    "Schroei het vlees kort en krachtig aan alle kanten dicht. Reken ongeveer 30–45 seconden per zijde: de buitenkant moet mooi kleuren terwijl de binnenkant vrijwel rauw blijft.",
    "Haal het vlees onmiddellijk uit de pan en laat het volledig afkoelen. Leg het daarna eventueel 10–15 minuten in de koelkast zodat je het makkelijker dun kunt snijden.",
    "Meng ondertussen de sojasaus, rijstazijn, limoensap, sesamolie, honing, look en gember tot een dressing.",
    "Snijd de beef met een scherp mes in zo dun mogelijke plakjes, dwars op de draad.",
    "Schik de plakjes op een bord en lepel de dressing erover.",
    "Snijd de lente-ui fijn en strooi samen met het sesamzaad over het vlees.",
    "Werk eventueel af met koriander en serveer met een stukje limoen."
  ],

  notes: "De pan moet echt heet zijn: het doel is een donkere, gekaramelliseerde buitenkant terwijl het midden rood blijft. Laat het vlees na het bakken goed afkoelen voor je het snijdt."
},


  {
  slug: "ceviche-tostada-mango-avocado-jalapeno-mayo",
  kicker: "Starter",
  title: "Ceviche tostada met mango–avocado salsa & jalapeño mayo",
  description: "Krokante tostada met frisse ceviche, zoete mango, romige avocado en pittige jalapeño mayo.",
  time: "± 30 min",
  prep: 30,
  servings: 1,
  level: "Makkelijk",
  sfeer: ["fris", "feest"],
  dieet: [],
  ingredientsFilter: [
    "wrap",
    "vis",
    "mango",
    "avocado",
    "rode ui",
    "jalapeno",
    "mayo",
    "koriander",
    "limoen",
    "panko"
  ],
  image: "assets/images/ceviche-tostada.PNG",

  ingredients: [
    { qty: 1, unit: "st", label: "wrap" },
    { qty: 10, unit: "ml", label: "maïsolie" },

    { type: "divider" },

    { qty: 30, unit: "g", label: "mango" },
    { qty: 0.2, unit: "st", label: "avocado" },
    { qty: 0.1, unit: "st", label: "rode ui" },
    { qty: 2, unit: "ml", label: "olijfolie" },
    { qty: 0.2, unit: "st", label: "limoen (sap)" },
    { qty: 5, unit: "g", label: "gefrituurde panko" },

    { type: "divider" },

    { qty: 15, unit: "g", label: "mayonaise" },
    { qty: 3, unit: "g", label: "jalapeño" },
    { qty: 1, unit: "ml", label: "olijfolie" },

    { type: "divider" },

    { qty: 40, unit: "g", label: "vis" },
    { qty: 0.3, unit: "st", label: "limoen (sap)" },
    { qty: 3, unit: "g", label: "koriander" },
    { qty: 0.5, unit: "g", label: "zout" }
  ],

  steps: [
    "Maak eerst de tostada. Snijd of duw de wrap in de gewenste vorm en bak of frituur hem in de maïsolie tot hij goudbruin en krokant is. Laat uitlekken.",
    "Maak de salsa door mango, avocado en rode ui fijn te snijden. Meng met olijfolie en limoensap.",
    "Werk de salsa af met de gefrituurde panko voor extra crunch.",
    "Maak de jalapeño mayo door de jalapeño fijn te hakken of glad te mixen met de mayonaise en olijfolie.",
    "Snijd de vis in kleine blokjes voor de ceviche.",
    "Meng de vis met limoensap, koriander en zout en laat kort marineren.",
    "Lepel wat jalapeño mayo op de tostada.",
    "Verdeel daarover de mango–avocado salsa.",
    "Werk af met de ceviche en serveer meteen."
  ],

  notes: "Serveer meteen zodat de tostada krokant blijft. Gebruik voor de ceviche een verse vis die geschikt is om rauw te eten."
},

  {
  slug: "iberico-croqueta",
  kicker: "Tapas",
  title: "Ibérico croqueta",
  description: "Romige croqueta met Ibérico, Parmezaan en een krokant laagje panko.",
  time: "± 45 min + opstijven",
  prep: 45,
  servings: 1,
  level: "Makkelijk",
  sfeer: ["feest", "delen"],
  dieet: [],
  ingredientsFilter: [
    "bloem",
    "boter",
    "melk",
    "iberico",
    "panko",
    "parmezaan",
    "ei"
  ],
  image: "assets/images/iberico-croqueta.PNG",

  ingredients: [
    { qty: 3, unit: "g", label: "bloem" },
    { qty: 3, unit: "g", label: "boter" },
    { qty: 30, unit: "ml", label: "melk" },
    { qty: 10, unit: "g", label: "Ibérico" },
    { qty: 2.5, unit: "g", label: "Parmezaan" },
    { qty: 0.2, unit: "g", label: "peper" },
    { qty: null, unit: "", label: "zout" },

    { type: "divider" },

    { qty: 0.3, unit: "st", label: "ei" },
    { qty: 4, unit: "g", label: "panko" }
  ],

  steps: [
    "Smelt de boter in een pan en voeg de bloem toe. Laat kort garen terwijl je blijft roeren.",
    "Voeg de melk beetje bij beetje toe en roer tot een dikke, gladde béchamel ontstaat.",
    "Meng de fijngesneden Ibérico en Parmezaan erdoor en kruid met peper en eventueel een beetje zout.",
    "Laat het mengsel volledig afkoelen en opstijven in de koelkast.",
    "Vorm kleine croqueta’s van het stevige mengsel.",
    "Haal ze door het losgeklopte ei en vervolgens door de panko.",
    "Frituur tot de buitenkant goudbruin en krokant is."
  ]
},

  {
  slug: "dadeltaart",
  kicker: "Dessert",
  title: "Dadeltaart met karamel",
  description: "Zachte, sticky dadeltaart met warme karamel. Rijk, smeuïg en gevaarlijk makkelijk om nog een stukje van te nemen.",
  time: "± 45–60 min",
  prep: 60,
  servings: 24,
  level: "Makkelijk",
  sfeer: ["feest", "comfort"],
  dieet: ["vegetarisch"],
  ingredientsFilter: [
    "dadels",
    "bruine suiker",
    "boter",
    "eieren",
    "bloem",
    "room",
    "vanille"
  ],
  image: "assets/images/dadeltaart.PNG",

  ingredients: [
    { qty: 448, unit: "g", label: "dadels" },
    { qty: 1.6, unit: "zakjes", label: "bakpoeder" },
    { qty: 400, unit: "ml", label: "kokend water" },
    { qty: 64, unit: "g", label: "bruine suiker" },
    { qty: 128, unit: "g", label: "boter" },
    { qty: 3.2, unit: "st", label: "eieren" },
    { qty: 296, unit: "g", label: "zelfrijzende bloem" },

    { type: "divider" },

    { qty: 88, unit: "g", label: "boter" },
    { qty: 288, unit: "g", label: "bruine suiker" },
    { qty: 144, unit: "ml", label: "room" },
    { qty: 96, unit: "ml", label: "room" },
    { qty: 1.6, unit: "zakjes", label: "vanillesuiker" }
  ],

  steps: [
    "Snijd de dadels fijn en doe ze in een kom met het bakpoeder.",
    "Giet het kokende water over de dadels en laat even weken tot ze zacht zijn.",
    "Klop de boter met de bruine suiker tot een romig mengsel.",
    "Voeg de eieren één voor één toe en meng goed.",
    "Meng de zachte dadels en het weekwater door het beslag.",
    "Spatel de zelfrijzende bloem erdoor tot alles net gemengd is.",
    "Giet het beslag in een ingevette bakvorm en bak tot de taart gaar en mooi goudbruin is.",
    "Maak ondertussen de karamel door boter en bruine suiker samen te verwarmen.",
    "Voeg de room toe en laat zachtjes koken tot een gladde, dikke karamelsaus ontstaat.",
    "Voeg de vanillesuiker toe en roer goed door.",
    "Serveer de dadeltaart warm of lauwwarm met de karamel."
  ]
},

  {
  slug: "empanada-gehakt-feta",
  kicker: "Empanada",
  title: "Empanada met gehakt, feta & za’atar",
  description: "Boterig, krokant empanadadeeg gevuld met gekruid gehakt, rode ui, feta en za’atar.",
  time: "± 60 min + rusttijd",
  prep: 60,
  servings: 1,
  level: "Even werk",
  sfeer: ["feest", "delen"],
  dieet: [],
  ingredientsFilter: [
    "bloem",
    "ei",
    "boter",
    "feta",
    "gehakt",
    "rode ui",
    "za'atar"
  ],
  image: "assets/images/empanada-gehakt-feta.PNG",

  ingredients: [
    { qty: 41.7, unit: "g", label: "bloem" },
    { qty: 0.2, unit: "st", label: "ei" },
    { qty: 20.8, unit: "g", label: "koude boter" },
    { qty: 9, unit: "g", label: "koud water" },
    { qty: 1, unit: "g", label: "zout" },
    { qty: 1, unit: "ml", label: "azijn" },

    { type: "divider" },

    { qty: 25, unit: "g", label: "feta" },
    { qty: 50, unit: "g", label: "gehakt" },
    { qty: 30, unit: "g", label: "rode ui" },
    { qty: 1.5, unit: "g", label: "za’atar" }
  ],

  steps: [
    "Zorg dat de boter, het water en liefst ook de kom goed koud zijn. Het deeg moet tijdens het hele proces zo koud mogelijk blijven.",
    "Meng de bloem met het zout. Snijd de koude boter in kleine blokjes en werk ze kort door de bloem. Er mogen nog kleine stukjes boter zichtbaar blijven.",
    "Meng het ei, koude water en de azijn en voeg dit beetje bij beetje toe aan de bloem. Meng enkel tot het deeg net samenkomt. Niet lang kneden.",
    "Vorm het deeg tot een platte schijf, wikkel het in en laat minstens 30 minuten rusten in de koelkast.",
    "Maak ondertussen de vulling. Snijd de rode ui fijn en bak samen met het gehakt tot het vlees gaar is en de ui zacht is.",
    "Voeg de za’atar toe en laat de vulling volledig afkoelen. Meng daarna de verkruimelde feta erdoor.",
    "Haal het koude deeg uit de koelkast en rol het op een licht bebloemd werkvlak uit. Draai het deeg tijdens het uitrollen regelmatig een kwartslag. Zo rol je het gelijkmatig uit en voorkom je dat het aan het werkvlak blijft kleven.",
    "Werk snel zodat de boter koud blijft. Voelt het deeg zacht, vettig of plakkerig aan, leg het dan opnieuw 10–15 minuten in de koelkast voordat je verdergaat.",
    "Rol het deeg uit tot ongeveer 2–3 mm dik en steek of snijd er cirkels uit.",
    "Leg de afgekoelde vulling op één helft van iedere deegcirkel. Laat rondom voldoende rand vrij.",
    "Maak de rand eventueel licht vochtig, vouw het deeg dicht en druk de randen stevig aan. Werk de rand af met een vork of plooi hem tot een klassieke empanadarand.",
    "Leg de gevormde empanada’s nog even in de koelkast terwijl de oven voorverwarmt. Koud deeg dat een hete oven ingaat geeft het beste resultaat.",
    "Bestrijk de bovenkant eventueel met losgeklopt ei en bak goudbruin in een hete oven."
  ],

  notes: "Hou het deeg koud. Draai het tijdens het uitrollen regelmatig een kwartslag en voeg zo weinig mogelijk extra bloem toe. Zodra de boter zacht begint te worden: stop en zet het deeg opnieuw koud."
},

  {
  slug: "avocado-mango-salade",
  kicker: "Salade",
  title: "Avocado–mango salade",
  description: "Frisse avocado en mango met limoen, koriander, lente-ui en crunch. Serveren met huisgemaakte chiliolie.",
  time: "10 min",
  prep: 10,
  servings: 1,
  level: "Supersimpel",
  sfeer: ["fris", "spicy"],
  dieet: ["vegetarisch"],
  ingredientsFilter: [
    "avocado",
    "mango",
    "limoen",
    "koriander",
    "pinda",
    "lente-ui"
  ],
  image: "assets/images/avocado-mango-salade.PNG",

  ingredients: [
    { qty: 0.3, unit: "st", label: "avocado" },
    { qty: 40, unit: "g", label: "mango" },
    { qty: 0.1, unit: "st", label: "limoen" },
    { qty: 2, unit: "g", label: "koriander" },
    { qty: 3, unit: "g", label: "pinda’s" },
    { qty: 3, unit: "g", label: "fried onions" },
    { qty: 0.3, unit: "stengel", label: "lente-ui" }
  ],

  steps: [
    "Snijd de avocado en mango in kleine blokjes.",
    "Snijd de lente-ui fijn en hak de koriander grof.",
    "Meng avocado, mango, lente-ui en koriander voorzichtig door elkaar.",
    "Knijp de limoen erover uit.",
    "Werk af met pinda’s en fried onions.",
    "Serveer met huisgemaakte chiliolie."
  ],

  relatedRecipes: [
    {
      label: "Maak de chiliolie",
      slug: "chiliolie"
    }
  ],

  notes: "De chiliolie maakt dit gerecht af: pittig, zout, zuur en licht zoet tegenover de romige avocado en zoete mango."
},

  {
  slug: "chiliolie",
  kicker: "Saus",
  title: "Chiliolie",
  description: "Pittige, hartige chiliolie met sesam, look, soja en een beetje zoet. Goed op zowat alles.",
  time: "15 min",
  prep: 15,
  servings: 1,
  level: "Supersimpel",
  sfeer: ["spicy"],
  dieet: [],
  ingredientsFilter: [
    "chili",
    "sesam",
    "look",
    "zonnebloemolie",
    "sojasaus",
    "rijstazijn",
    "honing",
    "oestersaus",
    "sesamolie"
  ],
  image: "assets/images/chiliolie.PNG",

  ingredients: [
    { qty: 0.4, unit: "g", label: "chiliflakes" },
    { qty: 0.3, unit: "g", label: "sesamzaad" },
    { qty: 0.1, unit: "teentje", label: "look" },
    { qty: 0.4, unit: "g", label: "suiker" },
    { qty: 10, unit: "ml", label: "zonnebloemolie" },

    { type: "divider" },

    { qty: 1.5, unit: "ml", label: "sojasaus" },
    { qty: 0.8, unit: "ml", label: "rijstazijn" },
    { qty: 0.5, unit: "ml", label: "honing" },
    { qty: 0.3, unit: "ml", label: "oestersaus" },
    { qty: 0.3, unit: "ml", label: "sesamolie" }
  ],

  steps: [
    "Doe de chiliflakes, het sesamzaad, de fijngesneden of geperste look en de suiker in een hittebestendige kom.",
    "Verwarm de zonnebloemolie tot ze goed heet is, maar niet begint te roken.",
    "Giet de hete olie voorzichtig over het chilimengsel. Het geheel moet onmiddellijk beginnen sissen.",
    "Laat kort afkoelen.",
    "Meng de sojasaus, rijstazijn, honing, oestersaus en sesamolie erdoor.",
    "Proef en stuur indien nodig bij met extra zuur, zout of zoet.",
    "Laat volledig afkoelen en bewaar afgesloten in de koelkast."
  ],

  notes: "Gebruik als dressing of afwerking bij onder andere de avocado–mango salade."
},
  
{
  slug: "rode curry-miso noedel bowl",
  kicker: "Noedels",
  title: "Ramen bowl",
  description: "Romige kokos-miso ramen met rode curry, gehakt of tofu en vooral heel veel toppings naar keuze.",
  time: "25–30 min",
  prep: 30,
  servings: 2,
  level: "Makkelijk",
  sfeer: ["weeknight", "comfort"],
  dieet: ["flexibel"],
  ingredientsFilter: [
    "noedels",
    "gehakt",
    "tofu",
    "miso",
    "rode curry",
    "kokosmelk",
    "sojasaus",
    "sugarsnaps",
    "paksoi",
    "lente-ui",
    "koriander",
    "limoen",
    "sesam",
    "edamame",
    "komkommer",
    "pinda",
    "chili",
    "ei"
  ],

  image: "assets/images/ramen-bowl.PNG",

  ingredients: [
    { qty: null, unit: "", label: "gehakt of tofu" },
    { qty: null, unit: "", label: "teriyakisaus" },

    { type: "divider" },

    { qty: 1, unit: "el", label: "miso" },
    { qty: 1, unit: "el", label: "rode currypasta" },
    { qty: 1, unit: "el", label: "sojasaus" },
    { qty: null, unit: "", label: "kokosmelk" },
    { qty: null, unit: "", label: "noedels" },

    { type: "divider" },

    { qty: null, unit: "", label: "sugarsnaps" },
    { qty: null, unit: "", label: "paksoi" },
    { qty: null, unit: "", label: "lente-ui" },
    { qty: null, unit: "", label: "koriander" },
    { qty: null, unit: "", label: "limoen" },
    { qty: null, unit: "", label: "sesamzaad" },
    { qty: null, unit: "", label: "edamame" },
    { qty: null, unit: "", label: "komkommer" },
    { qty: null, unit: "", label: "pinda’s" },
    { qty: null, unit: "", label: "chilivlokken" },
    { qty: null, unit: "", label: "zachtgekookt ei" }
  ],

  steps: [
    "Bak het gehakt of de tofu aan in een hete pan met een beetje teriyakisaus.",
    "Bereid ondertussen de toppings voor. Gebruik wat je in huis hebt: sugarsnaps, paksoi, lente-ui, koriander, limoen, sesamzaad, edamame, komkommer, pinda’s, chilivlokken en/of een zachtgekookt eitje.",
    "Meng de miso, rode currypasta en sojasaus in een kookpot en verwarm kort samen.",
    "Giet de kokosmelk erbij, roer glad en verwarm tot de bouillon zachtjes begint te koken.",
    "Voeg de noedels toe en laat ze rechtstreeks in de kokosbouillon garen.",
    "Verdeel de noedels en bouillon over kommen. Voeg het gehakt of de tofu toe en werk af met zoveel toppings als je zin in hebt."
  ],

  notes: "Dit is vooral een koelkast-opmaak-ramen: de kokos-miso-currybasis blijft hetzelfde, de toppings zijn volledig vrij."
},

{
  slug: "vietnamese-spring-rolls",
  kicker: "Street food",
  title: "Vietnamese spring rolls",
  description: "Fris, knapperig en licht, met warme vullingen, kruiden en crunch. Zelf rollen, zelf kiezen.",
  time: "40 min",
  prep: 40,
  servings: 2,
  level: "Sociaal",
  sfeer: ["fris", "delen"],
  dieet: ["flexibel"],
  ingredientsFilter: [
    "rijstpapier",
    "scampi",
    "kip",
    "champignon",
    "tofu",
    "vermicelli",
    "komkommer",
    "wortel",
    "avocado",
    "radijs",
    "koriander",
    "lente-ui",
    "fried onions",
    "vissaus"
  ],
  image: "assets/images/vietnamese-spring-rolls.PNG",
  ingredients: [
    { qty: 8, unit: "vellen", label: "rijstpapier" },
    { qty: 100, unit: "g", label: "vermicelli glasnoedels" },

    { qty: 200, unit: "g", label: "scampi’s" },
    { qty: 1, unit: "el", label: "sesamolie" },
    { qty: 1, unit: "teentje", label: "look, fijngehakt" },
    { qty: 1, unit: "el", label: "zoete sojasaus" },
    { qty: 1, unit: "el", label: "vissaus" },

    { qty: 150, unit: "g", label: "kip, fijngesneden" },
    { qty: 150, unit: "g", label: "champignons, fijngesneden" },
    { qty: 1, unit: "el", label: "sojasaus" },
    { qty: 1, unit: "tl", label: "sriracha" },
    { qty: 1, unit: "el", label: "sesamolie" },

    { qty: 2, unit: "st", label: "wortels, julienne" },
    { qty: 1, unit: "st", label: "komkommer, in linten" },
    { qty: 1, unit: "st", label: "avocado, in plakjes" },
    { qty: 1, unit: "st", label: "rode ui, fijn gesneden" },
    { qty: 2, unit: "st", label: "lente-ui, fijn" },
    { qty: 1, unit: "hand", label: "verse koriander" },
    { qty: 1, unit: "hand", label: "fried onions" },

    { qty: 6, unit: "st", label: "radijsjes, gepikkeld (rijstazijn & suiker)" }
  ],
  steps: [
    "Marineer de scampi’s met sesamolie, look, zoete sojasaus en vissaus. Bak kort en heet.",
    "Marineer kip en champignons met sojasaus, sriracha en sesamolie. Bak goudbruin.",
    "Kook de vermicelli volgens de verpakking en spoel koud.",
    "Snijd alle rauwe groenten en zet alles apart klaar op tafel.",
    "Meng voor de saus: vissaus, citroensap (of limoen), look, chilivlokken en witte suiker. Proef en balanceer.",
    "Week een vel rijstpapier kort in warm water.",
    "Beleg met noedels, groenten, kruiden en een warme vulling naar keuze.",
    "Werk af met koriander en fried onions voor crunch.",
    "Rol strak op en serveer meteen."
  ],
  options: [
    "Zoetzure saus als extra dip",
    "Hoisin",
    "Sriracha-mayo",
    "Wasabi-mayo"
  ],
  variations: [
    "Vervang kip en scampi’s door gebakken tofu voor een vegetarische versie",
    "Extra kruiden: munt of Thaise basilicum"
  ],
  notes: "Spring rolls draaien om balans: warm/koud, zacht/krokant, zuur/zout. Proeven blijft de basis."
},

  
  {
    slug: "pasta-ragu",
    kicker: "Pasta",
    title: "Pasta ragù",
    description: "Traag gegaarde klassieker voor echte comfortmomenten.",
    time: "2 uur",
    prep: 120,
    servings: 4,
    level: "Comfort",
    sfeer: ["comfort"],
    dieet: [],
    ingredientsFilter: ["pasta","rundsvlees","tomaat","ui","look","wortel","selder","parmezaan"],
    image: "assets/images/pasta-ragu.PNG",
    ingredients: [
      { qty: 400, unit: "g", label: "rundergehakt" },
      { qty: 1, unit: "st", label: "ui" },
      { qty: 2, unit: "st", label: "wortel" },
      { qty: 2, unit: "st", label: "selderstengels" },
      { qty: 2, unit: "st", label: "lookteentjes" },
      { qty: 800, unit: "g", label: "tomaten uit blik" }
    ],
    steps: [
      "Fruit ui, wortel en selder.",
      "Voeg gehakt toe en bak rul.",
      "Doe tomaten erbij en laat zachtjes sudderen.",
      "Serveer met pasta en parmezaan."
    ]
  },

  {
    slug: "pitta-kip-pindasaus",
    kicker: "Weeknight",
    title: "Pitta kip met pindasaus",
    description: "Snel, vullend en altijd een succes.",
    time: "30 min",
    prep: 30,
    servings: 2,
    level: "Makkelijk",
    sfeer: ["weeknight"],
    dieet: [],
    ingredientsFilter: ["pitta","kip","pinda","komkommer","ui","limoen","look","sriracha","soyasaus","yoghurt"],
    image: "assets/images/pitta-kip-pindasaus.PNG",
    ingredients: [
      { qty: 2, unit: "st", label: "pitabroodjes" },
      { qty: 250, unit: "g", label: "kipfilet" },
      { qty: 2, unit: "el", label: "pindakaas" },
      { qty: 1, unit: "st", label: "komkommer" },
      { qty: 1, unit: "st", label: "limoen" }
    ],
    steps: [
      "Bak de kip goudbruin.",
      "Meng pindakaas met yoghurt, sojasaus en limoensap.",
      "Vul de pita’s met kip, saus en groenten."
    ]
  },

  {
    slug: "bietello-tonato",
    kicker: "Vooraf",
    title: "Bietello tonato",
    description: "Aards, romig en perfect in balans.",
    time: "20 min",
    prep: 20,
    servings: 2,
    level: "Supersimpel",
    sfeer: ["feest"],
    dieet: [],
    ingredientsFilter: ["rode biet","tonijn","mayonaise","kappertjes","citroen","olijfolie"],
    image: "assets/images/bietello-tonato.PNG",
    ingredients: [
      { qty: 2, unit: "st", label: "gekookte rode bieten" },
      { qty: 1, unit: "blik", label: "tonijn" },
      { qty: 2, unit: "el", label: "mayonaise" },
      { qty: 1, unit: "el", label: "kappertjes" },
      { qty: 0.5, unit: "st", label: "citroen" }
    ],
    steps: [
      "Snij de bieten in plakken.",
      "Mix tonijn, mayonaise en citroensap.",
      "Serveer de saus over de bieten en werk af met kappertjes."
    ]
  },

{
  slug: "miso-champignon-pasta",
  kicker: "Pasta",
  title: "Miso–champignon pasta",
  description: "Romig, hartig en diep umami – met miso, spinazie en een snuifje lef.",
  time: "30 min",
  prep: 30,
  servings: 2,
  level: "Comfort",
  sfeer: ["comfort"],
  dieet: ["vegetarisch"],
  ingredientsFilter: [
    "pasta",
    "champignon",
    "miso",
    "spinazie",
    "ui",
    "look",
    "room",
    "soyasaus",
    "pecorino",
    "parmezaan"
  ],
  image: "assets/images/miso-champignon-pasta.PNG",
  ingredients: [
    { qty: 200, unit: "g", label: "pasta" },
    { qty: 350, unit: "g", label: "champignons, in plakjes" },
    { qty: 1, unit: "st", label: "ui, fijngehakt" },
    { qty: 1, unit: "teentje", label: "look, fijngehakt" },
    { qty: 2, unit: "handen", label: "verse spinazie" },
    { qty: 1, unit: "zakje", label: "miso soup (bouillon)" },
    { qty: 200, unit: "ml", label: "room" },
    { qty: 60, unit: "g", label: "Parmezaan & pecorino (half/half), vers geraspt" }
  ],
  steps: [
    "Snipper de ui fijn en bak glazig in olijfolie.",
    "Voeg de spinazie toe en laat slinken. Doe de look erbij en bak kort mee.",
    "Snijd de champignons in plakjes en bak mee tot ze goudbruin en sappig zijn.",
    "Voeg de room en het zakje miso soup toe en laat zachtjes stoven.",
    "Meng de helft van de geraspte Parmezaan/pecorino door de saus.",
    "Kook de pasta al dente en meng alles goed onder elkaar.",
    "Proef en stuur bij: eventueel extra look, een scheutje sojasaus of een snuifje chili.",
    "Werk af met extra vers geraspte Parmezaan/pecorino en eventueel gebakken spekblokjes."
  ],
  notes: "Dit gerecht leeft van proeven en bijsturen. Umami is geen exacte wetenschap."
},

  {
    slug: "pizza-basisdeeg",
    kicker: "Pizza",
    title: "Pizza (luchtig basisdeeg)",
    description: "Eenvoudig pizzadeeg met veel smaak. Door het deeg regelmatig te overplooien ontstaat een extra luchtige textuur.",
    time: "± 15 min bakken",
    prep: 15,
    servings: 3,
    level: "Basis",
    sfeer: ["comfort", "feest"],
    dieet: ["vegetarisch"],
    ingredientsFilter: ["bloem","gist","olijfolie","honing","zout"],
    image: "assets/images/pizza.PNG",
    ingredients: [
      { qty: 500, unit: "g", label: "bloem" },
      { qty: 300, unit: "ml", label: "lauwwarm water" },
      { qty: 7, unit: "g", label: "droge gist" },
      { qty: 12, unit: "g", label: "zout" },
      { qty: 10, unit: "g", label: "olijfolie" },
      { qty: 10, unit: "g", label: "honing" }
    ],
    steps: [
      "Meng alle ingrediënten tot een samenhangend deeg. Het deeg mag wat plakkerig zijn.",
      "Laat het deeg rusten en plooi het elke 30 minuten even over zichzelf om gluten op te bouwen.",
      "Verwarm de oven voor op 275 °C (of zo heet mogelijk).",
      "Vorm pizza’s en beleg naar smaak.",
      "Bak ongeveer 15 minuten en hou goed in de gaten: baktijd hangt sterk af van je oven."
    ]
  },

  {
    slug: "courgette-habanero-look",
    kicker: "Groenten",
    title: "Courgette–Habanero–Look",
    description: "Zachte, langzaam geroosterde courgette met een warme, huisgemaakte chili–knoflookolie. Intens, sticky en perfect als bijgerecht of topping.",
    time: "70 min",
    prep: 70,
    servings: 4,
    level: "Supersimpel",
    sfeer: ["spicy", "comfort"],
    dieet: ["vegan", "vegetarisch", "lactosevrij"],
    ingredientsFilter: ["courgette","habanero","look","olijfolie","zout"],
    image: "assets/images/courgette-habanero-look.PNG",
    ingredients: [
      { qty: 300, unit: "ml", label: "olijfolie" },
      { qty: 3, unit: "st", label: "teentjes look" },
      { qty: 2, unit: "st", label: "habanero’s" },

      { type: "divider" },

      { qty: 3, unit: "st", label: "courgettes" },
      { qty: 1, unit: "snuf", label: "grof zout" }
    ],
    steps: [
      "Maak de chili–knoflookolie. Maak de teentjes look schoon en snijd grof. Halveer de habanero’s en voeg samen met de look toe aan een kookpotje. Voeg de olijfolie toe en verwarm 20–25 minuten op een laag vuur. Laat niet frituren, enkel zacht trekken.",
      "Snijd de courgettes in plakken van ongeveer 3–5 mm dik.",
      "Vet een ovenschaal in met de chili–knoflookolie en strooi er een snuf grof zout over.",
      "Leg de courgetteplakken in de ovenschaal en bak in een voorverwarmde oven op 180 °C. Draai ze om na 15–20 minuten en bak nog ongeveer 45 minuten tot ze goudbruin en zacht zijn."
    ]
  },
  
  {
  slug: "pad-thai-kip",
  kicker: "Noedels",
  title: "Pad Thai",
  description: "Dit is zo’n gerecht waarvan je denkt: “ik doe dat snel even”, en dat dan toch wat uitloopt. Maar: sticky, zout-zuur-zoet, alles in één pan, en absoluut de moeite.",
  time: "45–60 min",
  prep: 60,
  servings: 3,
  level: "Makkelijk",
  sfeer: ["weeknight", "comfort"],
  dieet: [],
  ingredientsFilter: [
    "noedels",
    "kip",
    "tamarinde",
    "sojasaus",
    "vissaus",
    "rijstazijn",
    "look",
    "koriander",
    "lente-ui",
    "chili",
    "pinda"
  ],
  image: "assets/images/pad-thai.PNG",

  ingredients: [
    { qty: 1, unit: "el", label: "tamarinde" },
    { qty: 2, unit: "el", label: "donkerbruine suiker" },
    { qty: 5, unit: "cl", label: "sojasaus" },
    { qty: 3, unit: "cl", label: "vissaus" },
    { qty: 2, unit: "el", label: "rijstazijn" },
    { qty: 2, unit: "st", label: "teentjes look" },
    { qty: 1, unit: "handvol", label: "koriander" },
    { qty: 1, unit: "handvol", label: "lente-ui" },
    { qty: 1, unit: "naar smaak", label: "chili" },
    { qty: 5, unit: "cl", label: "water" },

    { type: "divider" },

    { qty: null, unit: "", label: "noedels" },
    { qty: null, unit: "", label: "kip" },
    { qty: null, unit: "", label: "groenten naar keuze (bv. sugarsnaps, ui, lente-ui)" }
  ],

  steps: [
    "Kook de noedels gaar. Giet af maar hou het kookwater bij (dit is belangrijk, echt).",
    "Bak de kip goudbruin in een hete pan en zet even apart.",
    "Meng tamarinde, suiker, sojasaus, vissaus, rijstazijn, look, koriander, lente-ui en chili. Leng aan met water.",
    "Bak de groenten in dezelfde pan tot ze beetgaar zijn.",
    "Voeg de kip opnieuw toe aan de pan.",
    "Voeg een deel van de saus toe, gevolgd door een deel van de noedels.",
    "Voeg de rest van de noedels en saus toe.",
    "Voeg een kletsje noedelwater toe en laat alles samen glanzen en binden.",
    "Werk af met gecrushte pinda’s, fried onions, lente-ui en koriander."
  ]
},

{
  slug: "peertjes-met-halloumi",
  kicker: "Oven",
  title: "Peertjes met halloumi",
  description: "Zachte, gekaramelliseerde peren met honing en kruiden, afgewerkt met zoutige halloumi. Comfortfood dat eruitziet alsof je moeite deed. Spoiler: valt mee.",
  time: "45–90 min",
  prep: 90,
  servings: 3,
  level: "Supersimpel",
  sfeer: ["comfort", "feest"],
  dieet: ["vegetarisch"],
  ingredientsFilter: [
    "peer",
    "halloumi",
    "rode ui",
    "look",
    "honing",
    "olijfolie",
    "chili",
    "paprikapoeder",
    "oregano"
  ],
  image: "assets/images/peer-halloumi.PNG",

  ingredients: [
    { qty: null, unit: "", label: "peren" },
    { qty: null, unit: "", label: "halloumi" },
    { qty: 1, unit: "st", label: "rode ui (per ± 500 g peren)" },
    { qty: 2, unit: "st", label: "teentjes look (per ± 500 g peren)" },
    { qty: null, unit: "", label: "olijfolie" },
    { qty: null, unit: "", label: "honing" },
    { qty: null, unit: "", label: "chili poeder" },
    { qty: null, unit: "", label: "paprikapoeder (klein beetje)" },
    { qty: null, unit: "", label: "oregano" },

    { type: "divider" },

    { qty: null, unit: "", label: "boter" },
    { qty: null, unit: "", label: "verse kruiden (optioneel)" }
  ],

  steps: [
    "Verwarm de oven voor op 165 °C (of 200 °C als je sneller wil). Strijk een ovenschaal in met olijfolie, zout, chili poeder, een klein beetje paprikapoeder en oregano. Drizzle er honing over.",
    "Snij de peren in vieren en leg ze in de ovenschaal met voldoende ruimte ertussen.",
    "Snij de rode ui in halve maantjes en verdeel tussen de peren. Plet de lookteentjes en leg ze er ook tussen.",
    "Meng 2/3 olijfolie met 1/3 honing en strijk het geheel nog eens royaal in.",
    "Bak 1,5 uur op 165 °C of ± 45 minuten op 200 °C tot de peren zacht en gekaramelliseerd zijn.",
    "Bak de halloumi in een hete pan met boter en kruiden tot goudbruin en krokant. Of: leg de halloumi de laatste 10 minuten gewoon bij de peren in de oven.",
    "Haal de peren uit de oven en dresseer de halloumi erover. Klaar."
  ]
},

  {
  slug: "focaccia",
  kicker: "Brood",
  title: "Focaccia",
  description: "Focaccia voor mensen die niet willen kneden maar wel willen scoren. Tijd doet het werk, olijfolie de rest.",
  time: "overnight + 20 min",
  prep: 720,
  servings: 6,
  level: "Geduldig",
  sfeer: ["comfort", "feest"],
  dieet: ["vegetarisch", "lactosevrij"],
  ingredientsFilter: [
    "broodmeel",
    "gist",
    "olijfolie",
    "zout"
  ],
  image: "assets/images/focaccia.PNG",

  ingredients: [
    { qty: 470, unit: "g", label: "warm water" },
    { qty: 2, unit: "tl", label: "zout" },
    { qty: 1, unit: "el", label: "extra vierge olijfolie (+ extra voor de schaal)" },
    { qty: 7, unit: "g", label: "droge gist" },
    { qty: 560, unit: "g", label: "broodmeel" },
    { qty: 10, unit: "g", label: "extra proteïne in de bloem (optioneel)" }
  ],

  steps: [
    "Meng water, gist, zout, olijfolie en bloem tot een nat, plakkerig deeg. Niet kneden.",
    "Vouw het deeg 4 keer, telkens met 30 minuten ertussen.",
    "Dek af en laat het deeg een nacht rusten.",
    "Vet een ovenschotel royaal in met olijfolie. Leg het deeg erin, maak kuiltjes en sprenkel olijfolie over het deeg. Laat nog 1 uur rusten.",
    "Dimpel het deeg opnieuw, voeg een laatste beetje olijfolie toe en bak op 200 °C gedurende ongeveer 20 minuten tot goudbruin."
  ]
},

  {
  slug: "wafels",
  kicker: "Zoet",
  title: "Wafels",
  description: "Luchtige, klassieke wafels die ruiken naar zondag en vakantie. Afwegen is geen detail, het ís het recept.",
  time: "± 45 min",
  prep: 45,
  servings: 12,
  level: "Klassieker",
  sfeer: ["feest", "comfort"],
  dieet: ["vegetarisch"],
  ingredientsFilter: [
    "eieren",
    "melk",
    "gist",
    "bloem",
    "boter",
    "vanille"
  ],
  image: "assets/images/wafels.PNG",

  ingredients: [
    { qty: 3, unit: "st", label: "eieren" },
    { qty: 375, unit: "g", label: "melk" },
    { qty: 20, unit: "g", label: "verse gist" },
    { qty: 375, unit: "g", label: "lauw water" },
    { qty: 450, unit: "g", label: "zelfrijzende bloem" },
    { qty: 150, unit: "g", label: "boter, gesmolten" },
    { qty: 1, unit: "snuf", label: "zout" },
    { qty: null, unit: "", label: "vanillesuiker (naar smaak)" }
  ],

  steps: [
    "Weeg alle ingrediënten zorgvuldig af.",
    "Scheid de eieren: dooiers in een grote kom, eiwitten apart.",
    "Klop de dooiers los met een klopper.",
    "Voeg melk en gist toe en klop tot de gist volledig is opgelost.",
    "Schenk het lauwe water erbij en meng rustig.",
    "Zeef de bloem in het beslag en roer tot een glad geheel zonder klonters.",
    "Smelt de boter en meng ze voorzichtig onder het beslag.",
    "Klop de eiwitten stijf in een vetvrije kom.",
    "Spatel de eiwitten voorzichtig onder het beslag om lucht te behouden.",
    "Voeg een snufje zout en wat vanillesuiker toe.",
    "Laat het beslag 20 minuten rusten op een warme, tochtvrije plek.",
    "Bak de wafels in een heet wafelijzer tot goudbruin."
  ]
},

{
  slug: "hawaiiaanse-zalmburger",
  kicker: "Burger",
  title: "Hawaïaanse zalmburger",
  description: "Zoet, zout, fris en een beetje messy. Sappige zalmburger, warme ananas, gesmolten cheddar en twee sauzen waar je te veel van maakt.",
  time: "35–45 min",
  prep: 45,
  servings: 4,
  level: "Makkelijk",
  sfeer: ["comfort", "feest"],
  dieet: ["lactosevrij"], // zonder cheddar = volledig lactosevrij
  ingredientsFilter: [
    "zalm",
    "ananas",
    "sojasaus",
    "sriracha",
    "limoen",
    "koriander",
    "avocado",
    "cheddar",
    "mayonaise"
  ],
  image: "assets/images/hawaiaanse-zalmburger.PNG",

  ingredients: [
    { qty: 500, unit: "g", label: "verse zalmfilet" },
    { qty: 2, unit: "el", label: "zoete sojasaus" },
    { qty: 1, unit: "tl", label: "zout" },
    { qty: 1, unit: "tl", label: "sriracha" },
    { qty: 1, unit: "el", label: "limoensap" },
    { qty: 0.25, unit: "kopje", label: "koriander, fijngehakt" },

    { type: "divider" },

    { qty: 4, unit: "plakjes", label: "ananas" },
    { qty: 1, unit: "el", label: "boter" },
    { qty: 4, unit: "st", label: "hamburgerbroodjes" },
    { qty: 4, unit: "plakjes", label: "cheddar" },
    { qty: 1, unit: "st", label: "avocado" },
    { qty: null, unit: "", label: "sla" },

    { type: "divider" },

    { qty: 0.5, unit: "kopje", label: "ananaspuree" },
    { qty: 1, unit: "el", label: "bieslook, fijngehakt" },
    { qty: 1, unit: "el", label: "koriander, fijngehakt" },
    { qty: 1, unit: "tl", label: "BBQ-kruiden" },
    { qty: 2, unit: "el", label: "olijfolie" },

    { type: "divider" },

    { qty: 0.5, unit: "kopje", label: "mayonaise" },
    { qty: 1, unit: "st", label: "teentje look, fijngehakt" },
    { qty: 1, unit: "el", label: "bieslook, fijngehakt" },
    { qty: 2, unit: "el", label: "olijfolie" }
  ],

  steps: [
    "Snijd de zalm in blokjes en meng met sojasaus, zout, sriracha, limoensap en koriander. Zet even apart.",
    "Maak beide sauzen door alle ingrediënten per saus te blenden tot een glad geheel.",
    "Bak de ananasplakjes in boter tot licht gekaramelliseerd en zet opzij.",
    "Vorm zalmburgers en bak ze in dezelfde pan met wat extra boter. Laat de binnenkant naar wens rosé.",
    "Verwarm de broodjes in de oven en laat de cheddar erop smelten.",
    "Bouw de burger: saus 1 onderaan, saus 2 bovenaan. Voeg sla, zalmburger, avocado en ananas toe.",
    "Serveer warm en geniet."
  ]
},
  {
  slug: "filo-soya-kokosmelk",
  kicker: "Weeknight",
  title: "Gevulde filopastries met kokosmelk & sojasaus",
  description: "Krokant filodeeg met een romige, zoute kokosvulling. Snel, crispy en gevaarlijk snackbaar.",
  time: "25–35 min",
  prep: 35,
  servings: 3,
  level: "Makkelijk",
  sfeer: ["weeknight", "comfort"],
  dieet: ["vegan", "lactosevrij"],
  ingredientsFilter: ["filo","kokosmelk","sojasaus","look","limoen","chili"],
  image: "assets/images/filo-soya-kokosmelk.PNG",

  ingredients: [
    { qty: null, unit: "", label: "filodeeg (vellen)" },
    { qty: 200, unit: "ml", label: "kokosmelk" },
    { qty: 2, unit: "el", label: "sojasaus" },
    { qty: 1, unit: "st", label: "teentje look" },
    { qty: 0.5, unit: "st", label: "limoen (sap)" },
    { qty: 1, unit: "snuf", label: "chilivlokken of verse chili" },
    { qty: null, unit: "", label: "olie om te bestrijken" }
  ],

  steps: [
    "Verwarm de oven voor op 200 °C.",
    "Meng kokosmelk met sojasaus, geperste look, limoensap en chili.",
    "Leg een vel filodeeg open, bestrijk licht met olie en leg er een tweede vel op (voor extra crunch).",
    "Schep een lepel vulling op het onderste deel en vouw op tot een rolletje of driehoek.",
    "Leg op een bakplaat en bestrijk de buitenkant licht met olie.",
    "Bak 15–20 min tot goudbruin en krokant. Hou het in de gaten: filodeeg gaat snel.",
    "Serveer warm, eventueel met extra limoensap of chili erbovenop."
  ]
},

  {
  slug: "scampis-kerstomaten-puntpaprikasaus",
  kicker: "Pasta / pan",
  title: "Scampi’s in kerstomaten–puntpaprikasaus",
  description: "Zoet van tomaat, rokerig van puntpaprika, veel look. Scampi’s erin en klaar: één pan, grote voldoening.",
  time: "25–35 min",
  prep: 35,
  servings: 2,
  level: "Supersimpel",
  sfeer: ["weeknight", "comfort"],
  dieet: ["lactosevrij", "glutenvrij"],
  ingredientsFilter: ["scampi","kerstomaten","puntpaprika","look","olijfolie","citroen"],
  image: "assets/images/scampis-kerstomaten-puntpaprikasaus.PNG",

  ingredients: [
    { qty: 300, unit: "g", label: "scampi’s (gepeld)" },
    { qty: 250, unit: "g", label: "kerstomaten" },
    { qty: 2, unit: "st", label: "puntpaprika" },
    { qty: 2, unit: "st", label: "teentjes look" },
    { qty: 2, unit: "el", label: "olijfolie" },
    { qty: 0.5, unit: "st", label: "citroen (sap)" },
    { qty: 1, unit: "snuf", label: "zout" },
    { qty: 1, unit: "snuf", label: "chilivlokken (optioneel)" }
  ],

  steps: [
    "Rooster of bak de puntpaprika’s tot ze zacht zijn (pan/oven). Snij in stukjes.",
    "Verhit olijfolie en bak de look kort (niet bruin laten worden).",
    "Voeg kerstomaten toe en laat ze openbarsten tot een sausachtige basis.",
    "Voeg de puntpaprika toe en laat 5 min meepruttelen.",
    "Doe de scampi’s erbij en laat 2–4 min garen tot ze net roze zijn.",
    "Kruid met zout, citroensap en eventueel chilivlokken.",
    "Serveer zo, of over pasta/rijst met extra citroen."
  ]
},

  {
  slug: "tomaat-perzik",
  kicker: "Salade",
  title: "Tomaat–perzik salade",
  description: "Zomer op een bord: sappige tomaat, zoete perzik, basilicum en veel olijfolie. Simpel = sexy.",
  time: "10–15 min",
  prep: 15,
  servings: 2,
  level: "Supersimpel",
  sfeer: ["fris", "brunch"],
  dieet: ["vegan", "lactosevrij", "glutenvrij"],
  ingredientsFilter: ["tomaat","perzik","basilicum","olijfolie","ui"],
  image: "assets/images/tomaat-perzik.PNG",

  ingredients: [
    { qty: 2, unit: "st", label: "rijpe tomaten" },
    { qty: 2, unit: "st", label: "perziken" },
    { qty: 0.5, unit: "st", label: "rode ui (optioneel)" },
    { qty: 1, unit: "handvol", label: "basilicum" },
    { qty: 2, unit: "el", label: "olijfolie" },
    { qty: 1, unit: "snuf", label: "zout" }
  ],

  steps: [
    "Snij tomaten en perzik in partjes.",
    "Snij rode ui in flinterdunne halve maantjes (optioneel).",
    "Meng alles met olijfolie en een goeie snuf zout.",
    "Werk af met basilicum en serveer meteen."
  ]
},

  {
  slug: "bladerdeeg-limoen-rode-vruchten",
  kicker: "Dessert",
  title: "Bladerdeegtaartje met limoencheesecake & rode vruchten",
  description: "Knapperig bladerdeeg, frisse limoencheesecake-achtige topping en sappige rode vruchten. Ziet eruit als moeite. Was het niet.",
  time: "25–35 min",
  prep: 35,
  servings: 4,
  level: "Makkelijk",
  sfeer: ["feest", "brunch"],
  dieet: ["vegetarisch"],
  ingredientsFilter: ["bladerdeeg","limoen","roomkaas","suiker","rode vruchten","vanille"],
  image: "assets/images/bladerdeeg-limoen-rode-vruchten.PNG",

  ingredients: [
    { qty: 1, unit: "rol", label: "bladerdeeg" },
    { qty: 200, unit: "g", label: "roomkaas" },
    { qty: 2, unit: "el", label: "suiker" },
    { qty: 1, unit: "st", label: "limoen (zest + sap)" },
    { qty: 1, unit: "tl", label: "vanille (suiker/extract)" },
    { qty: 200, unit: "g", label: "rode vruchten (vers of diepvries)" }
  ],

  steps: [
    "Verwarm de oven voor op 200 °C.",
    "Snij bladerdeeg in vierkantjes of rechthoeken en prik lichtjes in het midden (rand vrijhouden).",
    "Bak 12–15 min tot goudbruin en luchtig. Laat even afkoelen.",
    "Meng roomkaas met suiker, vanille en limoen(zest + sap) tot een frisse crème.",
    "Lepel de crème op het bladerdeeg en werk af met rode vruchten.",
    "Serveer meteen (dan blijft het bladerdeeg het krokantst)."
  ]
}






  
];

