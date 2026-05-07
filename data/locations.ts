export type LocationCategory = 'city' | 'nature' | 'beach' | 'viewpoint' | 'village' | 'hidden_gem';
export type Difficulty = 'easy' | 'moderate' | 'hard';

export interface FoodRecommendation { name: string; description: string; type: string; }
export interface BarRecommendation  { name: string; description: string; type: string; }

export type TransportMode = 'car' | 'bus' | 'taxi' | 'boat' | 'cable_car' | 'walk';
export interface TransportOption { mode: TransportMode; info: string; }

export interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
  category: LocationCategory;
  description: string;
  pinColor: string;
  duration: string;
  difficulty?: Difficulty;
  attractions: string[];
  food: FoodRecommendation[];
  nightlife: BarRecommendation[];
  gettingThere: TransportOption[];
  tips?: string[];
}

export const MADEIRA_CENTER: [number, number] = [32.7607, -16.9595];
export const DEFAULT_ZOOM = 11;

export const CATEGORY_LABELS: Record<LocationCategory, string> = {
  city: 'City', nature: 'Nature', beach: 'Beach',
  viewpoint: 'Viewpoint', village: 'Village', hidden_gem: 'Hidden Gem',
};

export const TRANSPORT_ICONS: Record<TransportMode, string> = {
  car: '🚗', bus: '🚌', taxi: '🚕', boat: '⛵', cable_car: '🚠', walk: '🚶',
};

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; dots: number }> = {
  easy:     { label: 'Easy',     color: '#00b894', dots: 1 },
  moderate: { label: 'Moderate', color: '#fdcb6e', dots: 2 },
  hard:     { label: 'Hard',     color: '#e17055', dots: 3 },
};

export const locations: Location[] = [
  {
    id: 'funchal', name: 'Funchal',
    coordinates: [32.6669, -16.9241], category: 'city',
    duration: 'Full day', pinColor: '#FF6B6B',
    description: 'The vibrant capital of Madeira, nestled between the Atlantic Ocean and dramatic mountains. A blend of colonial heritage, botanical wonders, and contemporary culture that captivates every visitor.',
    attractions: ['Old Town (Zona Velha) — painted door street art','Funchal Cathedral (Sé) — 15th-century Gothic','Monte Palace Tropical Garden','CR7 Museum — Cristiano Ronaldo exhibit','Mercado dos Lavradores — covered market',"Blandy's Wine Lodge — Madeira wine tasting"],
    food: [
      { name: 'Taberna Ruel', description: 'Traditional Madeiran cuisine in a rustic Old Town setting', type: 'Traditional' },
      { name: 'Restaurante Donna', description: 'Modern Portuguese gastronomy with mountain views', type: 'Fine Dining' },
      { name: 'O Celeiro', description: 'Renowned for espada fish and local Madeira wines', type: 'Seafood' },
      { name: 'Mercado dos Lavradores', description: 'Fresh produce, poncha shots, and pastéis de nata', type: 'Market' },
    ],
    nightlife: [
      { name: 'Venda Velha', description: 'Historic Old Town bar with live folk music nightly', type: 'Live Music Bar' },
      { name: 'Prince Albert', description: 'British-style pub, beloved by expats and locals alike', type: 'Pub' },
      { name: 'Casino da Madeira', description: 'Elegant casino with fine dining and live entertainment', type: 'Casino' },
    ],
    gettingThere: [
      { mode: 'car', info: 'Rental car from Madeira Airport — 25 min via VR1 expressway' },
      { mode: 'taxi', info: 'Uber and licensed taxis operate throughout the city' },
      { mode: 'bus', info: 'SAM and Rodoeste buses connect Funchal to the whole island' },
    ],
    tips: ['Take the cable car from the Old Town up to Monte for sweeping views over the bay','Try the famous Monte toboggan ride — a unique wicker sledge experience','Visit the Old Town at night when the painted doors are dramatically lit'],
  },
  {
    id: 'cabo-girao', name: 'Cabo Girão',
    coordinates: [32.648, -17.0419], category: 'viewpoint',
    duration: '1–2 hours', difficulty: 'easy', pinColor: '#4ECDC4',
    description: "One of Europe's highest sea cliffs at 580 meters, with a glass-floored skywalk that juts over sheer volcanic rock plunging straight into the Atlantic. An unmissable spectacle.",
    attractions: ['Glass-floor skywalk platform','Terraced vineyards visible far below','Fajã dos Padres accessible by cable car','Sunset panoramic viewpoint'],
    food: [
      { name: 'Skywalk Café', description: 'Light meals and coffee with the cliff view behind you', type: 'Café' },
      { name: 'Fajã dos Padres', description: 'Boat or cable car-only access, excellent fresh seafood', type: 'Seafood' },
    ],
    nightlife: [{ name: 'Câmara de Lobos Bars', description: "Vibrant fishing village 4km east — Churchill's favourite painting spot", type: 'Village Bars' }],
    gettingThere: [
      { mode: 'car', info: '20 min from Funchal via the Via Rápida highway (ER229)' },
      { mode: 'bus', info: 'Bus 154 from Funchal to Câmara de Lobos, then short taxi ride' },
    ],
    tips: ['Arrive early morning before tourist coaches — golden light and empty platform','Take the cable car down to Fajã dos Padres for a secluded lunch by the sea','Câmara de Lobos village nearby has excellent local restaurants and a lively square'],
  },
  {
    id: 'pico-arieiro', name: 'Pico do Arieiro',
    coordinates: [32.7352, -16.928], category: 'nature',
    duration: 'Half day', difficulty: 'moderate', pinColor: '#A29BFE',
    description: "Madeira's third-highest peak at 1,818 meters, frequently rising above a billowing sea of clouds. A surreal lunar landscape of jagged basalt ridges and ancient volcanic rock formations.",
    attractions: ['Above-the-clouds hiking at sunrise','PR1 Trail to Pico Ruivo (highest peak)','Dramatic volcanic rock formations','Stargazing above cloud cover at night'],
    food: [{ name: 'Restaurante do Arieiro', description: 'Warming soups, caldo verde, and regional dishes at altitude', type: 'Mountain Restaurant' }],
    nightlife: [{ name: 'Stargazing Experience', description: 'No bars — but stargazing above the clouds is utterly magical', type: 'Nature' }],
    gettingThere: [
      { mode: 'car', info: 'Car essential — 45 min from Funchal via ER202. Road can ice in winter' },
      { mode: 'taxi', info: 'Private transfer from Funchal approx €35–45 one-way' },
    ],
    tips: ['Bring warm layers even in summer — temperatures can drop to near zero at the peak','Clouds roll in by midday — visit as early as possible for clear skies','The PR1 trail to Pico Ruivo is 11km and one of the best hikes in all of Portugal'],
  },
  {
    id: 'porto-moniz', name: 'Porto Moniz',
    coordinates: [32.8637, -17.1664], category: 'beach',
    duration: '2–3 hours', difficulty: 'easy', pinColor: '#00B4D8',
    description: 'Volcanic rock pools on the rugged northwest coast, naturally sculpted by centuries of Atlantic waves into crystalline swimming pools. Surrounded by dramatic lava formations and crashing surf.',
    attractions: ['Natural volcanic rock swimming pools','Aquarium of Madeira','Rugged coastal hiking trails','Lava tube sea caves'],
    food: [
      { name: 'Orca Restaurant', description: 'Local seafood dishes with views directly over the volcanic pools', type: 'Seafood' },
      { name: 'Cachalote Restaurant', description: 'Traditional Madeiran cooking in a dramatic cliff-side setting', type: 'Traditional' },
    ],
    nightlife: [{ name: 'Bar Calhau', description: 'Relaxed local bar right by the natural pools — ice-cold local beers', type: 'Bar' }],
    gettingThere: [
      { mode: 'car', info: '1.5 hours from Funchal via the scenic north coast road (ER101)' },
      { mode: 'bus', info: 'Rodoeste line 80 from Funchal — daily service, approx 2.5 hours' },
    ],
    tips: ['Visit early morning before the crowds arrive for a serene swim','Wear water shoes — the volcanic rocks are razor-sharp underfoot','Best swimming is June through September when the Atlantic is calmest'],
  },
  {
    id: 'santana', name: 'Santana',
    coordinates: [32.8023, -16.8862], category: 'village',
    duration: '2–3 hours', difficulty: 'easy', pinColor: '#FD9644',
    description: 'A fairy-tale village famed for its iconic A-frame thatched houses called "palheiros", set against lush valleys and plunging cliffs in northern Madeira.',
    attractions: ['Traditional A-frame palheiro houses','Parque Temático da Madeira','Queimadas Forest Park — mist-shrouded fairy-tale forest','Caldeirão Verde levada trail'],
    food: [
      { name: 'Quinta do Furão', description: 'Wine estate restaurant with breathtaking cliff-top ocean views', type: 'Wine & Dining' },
      { name: 'O Colmo', description: 'Rustic lunch inside a traditional thatched palheiro house', type: 'Traditional' },
    ],
    nightlife: [{ name: 'Quinta do Furão Hotel Bar', description: 'Sunset cocktails on the terrace with dramatic coastal panoramas', type: 'Hotel Bar' }],
    gettingThere: [
      { mode: 'car', info: '45 min from Funchal via the north coast tunnel (VR1 then ER101)' },
      { mode: 'bus', info: 'SAM bus 103 from Funchal to Santana — approx 1.5 hours' },
    ],
    tips: ['The Caldeirão Verde levada walk passes through 4 tunnels — bring a headlamp','Visit Quinta do Furão for a wine tasting with some of the best views on the island','The palheiro houses are most photogenic at golden hour'],
  },
  {
    id: 'calheta', name: 'Calheta',
    coordinates: [32.717, -17.1696], category: 'beach',
    duration: '3–4 hours', difficulty: 'easy', pinColor: '#F7B731',
    description: "Home to Madeira's finest golden sandy beach — imported from Morocco — alongside a modern marina, a world-class art museum, and a historic sugar cane distillery producing authentic poncha.",
    attractions: ['Calheta Beach — imported golden sand','Marina de Calheta','MUDAS Contemporary Art Museum','Engenho da Calheta sugar cane distillery'],
    food: [
      { name: 'Calheta Beach Restaurant', description: 'Grilled fresh fish and local dishes with sand between your toes', type: 'Beach Restaurant' },
      { name: 'Engenho da Calheta', description: 'Artisanal poncha and traditional Madeiran snacks at the distillery', type: 'Distillery' },
    ],
    nightlife: [
      { name: 'Marina Bar', description: 'Cocktails on the waterfront as the Atlantic sun sets dramatically', type: 'Marina Bar' },
      { name: 'Royal Savoy Beach Club', description: 'Upscale beach club with DJ nights and premium cocktails', type: 'Beach Club' },
    ],
    gettingThere: [
      { mode: 'car', info: '45 min from Funchal via ER101 or Via Rápida west' },
      { mode: 'bus', info: 'Rodoeste lines 80 and 142 run from Funchal to Calheta' },
    ],
    tips: ["Calheta has Madeira's only real sandy beach — perfect for families with children",'Book a distillery tour at Engenho da Calheta to try genuinely local poncha','Sunset from the marina breakwater is one of the most photographed views on the island'],
  },
  {
    id: 'ponta-sao-lourenco', name: 'Ponta de São Lourenço',
    coordinates: [32.7512, -16.7004], category: 'nature',
    duration: '3–4 hours', difficulty: 'moderate', pinColor: '#E55039',
    description: "A dramatic limestone peninsula thrusting into the Atlantic at Madeira's eastern tip. Rust-red and ochre cliffs plunge sheer into deep blue sea in a landscape unlike anywhere else on the island.",
    attractions: ['PR8 peninsula hiking trail (7.6km)','Baía de Abra starting viewpoint','Endemic flora and migratory birds','Double-sided sea views from the spine'],
    food: [{ name: 'Restaurante Machico', description: 'Fresh seafood and regional dishes in the nearby historic town', type: 'Seafood' }],
    nightlife: [{ name: 'Machico Town Bars', description: 'Quiet authentic local bars in the oldest settlement on Madeira', type: 'Local Bars' }],
    gettingThere: [
      { mode: 'car', info: '40 min from Funchal via eastern expressway (VR1) to Caniçal' },
      { mode: 'bus', info: 'Bus to Caniçal town, then 20 min walk to Baía de Abra trailhead' },
    ],
    tips: ['The PR8 trail is moderate difficulty — carry at least 1.5L of water per person','Photograph at golden hour when the red cliffs glow orange against the blue Atlantic','Can be extremely windy — secure bags and loose items before the trail'],
  },
  {
    id: 'ribeira-brava', name: 'Ribeira Brava',
    coordinates: [32.6757, -17.064], category: 'village',
    duration: '1–2 hours', pinColor: '#26de81',
    description: "A picturesque coastal town where a dramatic gorge meets the sea at a pebble beach. Known for colorful fishing boats, the ornate Church of São Bento, and as the gateway to the island's breathtaking mountain interior.",
    attractions: ['Church of São Bento — Manueline architecture','Ethnographic Museum of Madeira','Colorful fishing boat harbor','Boca da Encumeada mountain pass — 20 min drive'],
    food: [
      { name: 'Restaurante Casa dos Cristais', description: 'Excellent espada fish and regional dishes in a relaxed atmosphere', type: 'Seafood' },
      { name: 'Taberna da Praia', description: 'Daily fresh catch and house wine right by the pebble beach', type: 'Traditional' },
    ],
    nightlife: [{ name: 'Local Tasca Bars', description: 'Authentic Portuguese tascas with home-brewed poncha and live accordion', type: 'Tasca' }],
    gettingThere: [
      { mode: 'car', info: '30 min from Funchal via Via Rápida (VR1) west' },
      { mode: 'bus', info: 'Frequent SAM/Rodoeste buses from Funchal — approx 45 min' },
    ],
    tips: ['Try the espada (black scabbardfish with banana) — a true Madeiran delicacy','Drive up to Boca da Encumeada mountain pass for an astonishing dual-ocean viewpoint','The Sunday market has excellent local cheeses, honey, and handmade crafts'],
  },

  // ── Hidden Gems ──────────────────────────────────────────
  {
    id: 'fanal', name: 'Fanal Forest',
    coordinates: [32.8456, -17.1102], category: 'hidden_gem',
    duration: '1–2 hours', difficulty: 'easy', pinColor: '#FDCB6E',
    description: 'A hauntingly beautiful ancient laurisilva forest in the Paul da Serra plateau, where thousand-year-old til and laurel trees emerge from dense Atlantic fog. One of the most magical places in all of Madeira — and almost unknown to tourists.',
    attractions: ['Ancient laurisilva forest (UNESCO World Heritage)','Fog-shrouded thousand-year-old til trees','PR13 Levada dos Cedros trail','Endemic Madeiran chaffinch and laurel pigeons'],
    food: [{ name: 'Estalagem da Encumeada', description: 'Mountain lodge restaurant nearby with hearty regional food', type: 'Mountain Lodge' }],
    nightlife: [],
    gettingThere: [{ mode: 'car', info: 'Car essential — 1 hour from Funchal via Paul da Serra plateau (ER110). Road often foggy' }],
    tips: ['Best in early morning when fog is thickest — creates an ethereal fairy-tale atmosphere','Wear waterproof layers — it is almost always cold, damp, and misty here','Visit on a quiet weekday morning for a truly solitary, otherworldly experience'],
  },
  {
    id: 'ponta-do-pargo', name: 'Ponta do Pargo',
    coordinates: [32.8161, -17.2623], category: 'hidden_gem',
    duration: '1–2 hours', difficulty: 'easy', pinColor: '#FDCB6E',
    description: "Madeira's remote westernmost point, marked by a lonely 1922 lighthouse perched above sheer Atlantic cliffs. Almost completely off the tourist trail, with wild flowers, dramatic sea views, and a profound peacefulness found nowhere else on the island.",
    attractions: ['Ponta do Pargo lighthouse (built 1922)','Sheer 300m coastal cliffs','PR18 cliff-top walking trail','Endemic coastal wildflowers and sea birds'],
    food: [{ name: 'Village Café', description: 'Tiny local cafe with homemade pastries and strong coffee', type: 'Village Café' }],
    nightlife: [],
    gettingThere: [{ mode: 'car', info: 'Car essential — 1.5 hours from Funchal. The most remote accessible point on the island' }],
    tips: ['Sunset from the lighthouse cliff is among the finest on the entire island — plan around it','Fill up with fuel before heading this far west — petrol stations are scarce','Combine with Calheta and Fanal for an epic full west-coast day trip'],
  },
  {
    id: 'boca-do-risco', name: 'Boca do Risco',
    coordinates: [32.7382, -16.7183], category: 'hidden_gem',
    duration: '3–4 hours', difficulty: 'hard', pinColor: '#FDCB6E',
    description: "A dramatic and largely unknown coastal trail east of Machico, rewarding hikers with jaw-dropping views of sheer sea cliffs, hidden coves, and wild Atlantic. Practically invisible on tourist maps — a genuine local secret.",
    attractions: ['Sheer cliffside trail with unbroken Atlantic panoramas','Hidden sea caves and coves far below','Wild goats grazing on cliff edges','Connection to Ponta de São Lourenço (PR8)'],
    food: [{ name: 'Restaurants in Machico', description: 'Refuel in Machico after the hike — excellent fresh fish restaurants', type: 'Seafood' }],
    nightlife: [],
    gettingThere: [
      { mode: 'car', info: 'Drive to Porto da Cruz or Machico, park in the village, hike to trailhead' },
      { mode: 'walk', info: '45 min walk from Porto da Cruz along the old coastal path to the trailhead' },
    ],
    tips: ['Do NOT attempt in wet or windy weather — cliff paths become dangerously slippery','Carry 2L+ of water — there are absolutely no facilities along the entire route','Connects to Ponta de São Lourenço for a legendary full-day coastal epic'],
  },
];
