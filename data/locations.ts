export type LocationCategory = 'city' | 'nature' | 'beach' | 'viewpoint' | 'village' | 'hidden_gem' | 'party';
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
  party: 'Party',
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
    coordinates: [32.66091536155122, -17.004160582951187], category: 'viewpoint',
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
    coordinates: [32.73714217192437, -16.929575958741236], category: 'nature',
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
    coordinates: [32.86887619067881, -17.170573398447896], category: 'beach',
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
    coordinates: [32.80586011754176, -16.892195228507294], category: 'village',
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
    coordinates: [32.72078202320715, -17.178442674235033], category: 'beach',
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
    coordinates: [32.74844117972095, -16.696136958398384], category: 'nature',
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

  // ── Hidden Gems ──────────────────────────────────────────
  {
    id: 'fanal', name: 'Fanal Forest',
    coordinates: [32.808898905791885, -17.14405909179506], category: 'hidden_gem',
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
    coordinates: [32.814956420525384, -17.262980066198985], category: 'hidden_gem',
    duration: '1–2 hours', difficulty: 'easy', pinColor: '#FDCB6E',
    description: "Madeira's remote westernmost point, marked by a lonely 1922 lighthouse perched above sheer Atlantic cliffs. Almost completely off the tourist trail, with wild flowers, dramatic sea views, and a profound peacefulness found nowhere else on the island.",
    attractions: ['Ponta do Pargo lighthouse (built 1922)','Sheer 300m coastal cliffs','PR18 cliff-top walking trail','Endemic coastal wildflowers and sea birds'],
    food: [{ name: 'Village Café', description: 'Tiny local cafe with homemade pastries and strong coffee', type: 'Village Café' }],
    nightlife: [],
    gettingThere: [{ mode: 'car', info: 'Car essential — 1.5 hours from Funchal. The most remote accessible point on the island' }],
    tips: ['Sunset from the lighthouse cliff is among the finest on the entire island — plan around it','Fill up with fuel before heading this far west — petrol stations are scarce','Combine with Calheta and Fanal for an epic full west-coast day trip'],
  },

  // ── New pins ─────────────────────────────────────────────
  {
    id: 'botanical-garden', name: 'Botanical Garden',
    coordinates: [32.675634621088406, -16.90051151904686], category: 'nature',
    duration: '2–3 hours', difficulty: 'easy', pinColor: '#00b894',
    description: 'The Jardim Botânico da Madeira sits on the hillside above Funchal, showcasing over 2,500 exotic and endemic plant species across terraced gardens with sweeping views over the capital and the bay.',
    attractions: ['2,500+ exotic and endemic plant species','Natural History Museum on site','Parrot enclosure and tropical bird aviaries','Panoramic views over Funchal bay'],
    food: [
      { name: 'Garden Café', description: 'Light lunches and coffee with views over the terraced gardens', type: 'Café' },
    ],
    nightlife: [],
    gettingThere: [
      { mode: 'cable_car', info: 'Cable car from the Old Town (Zona Velha) goes directly to the garden entrance' },
      { mode: 'taxi', info: '10 min taxi from central Funchal' },
      { mode: 'bus', info: 'Bus 29 or 31 from central Funchal stops near the garden' },
    ],
    tips: ['Combine with the Monte cable car for a perfect half-day loop from Funchal','Arrive early — it gets busy by mid-morning during peak season','The garden is built on a steep hillside — wear comfortable shoes'],
  },
  {
    id: 'seixal-beach', name: 'Seixal Black Sand Beach',
    coordinates: [32.822464694261264, -17.10310120487722], category: 'beach',
    duration: '2–3 hours', difficulty: 'easy', pinColor: '#636e72',
    description: 'A dramatic black volcanic sand beach on the wild north coast, framed by towering basalt cliffs and a natural freshwater waterfall that tumbles directly onto the shore. One of the most visually striking beaches in all of Portugal.',
    attractions: ['Black volcanic sand unique to the north coast','Natural freshwater waterfall onto the beach','Crystal-clear Atlantic swimming','Dramatic basalt cliff backdrop'],
    food: [
      { name: 'Restaurante Beira Mar', description: 'Fresh seafood and local dishes steps from the black sand', type: 'Seafood' },
    ],
    nightlife: [],
    gettingThere: [
      { mode: 'car', info: '1.5 hours from Funchal via the north coast road (ER101)' },
      { mode: 'bus', info: 'Rodoeste line 6 runs along the north coast through Seixal' },
    ],
    tips: ['The waterfall at the end of the beach is a natural fresh-water shower — use it','Waves on the north coast can be powerful — check conditions before swimming','Combine with Porto Moniz volcanic pools just 8km further west'],
  },
  {
    id: 'cascata-anjos', name: 'Cascata dos Anjos',
    coordinates: [32.69338486632813, -17.115121394054427], category: 'hidden_gem',
    duration: '30–60 min', difficulty: 'easy', pinColor: '#74b9ff',
    description: "A beautiful roadside waterfall on the north coast near Seixal, where water cascades directly over the coastal road — drivers pass through a curtain of water. A uniquely Madeiran spectacle that surprises every visitor who discovers it.",
    attractions: ['Waterfall that flows directly over the coastal road','Natural pool at the base for cooling off','Scenic north coast backdrop','Photo opportunity unlike anywhere else in Europe'],
    food: [
      { name: 'Local Snack Bars in Seixal', description: 'Small local cafes and snack bars a short drive away in Seixal village', type: 'Local Café' },
    ],
    nightlife: [],
    gettingThere: [
      { mode: 'car', info: 'On the ER101 north coast road between Seixal and Ribeira da Janela — roadside stop' },
      { mode: 'bus', info: 'Any north coast bus on the Rodoeste line 6 passes directly through it' },
    ],
    tips: ['Roll down your windows as you drive through — or stop and walk under it','Most impressive after heavy rain when the flow is strongest','Combine with Seixal black sand beach just 1km east'],
  },
  {
    id: 'adrenaline-porto-moniz', name: 'Adrenaline Adventures',
    coordinates: [32.85681524501812, -17.157321228836484], category: 'hidden_gem',
    duration: 'Half day', difficulty: 'hard', pinColor: '#fd79a8',
    description: "Madeira's premier adventure sports base in Porto Moniz, offering coasteering, cliff jumping, canyoning, and sea kayaking in the dramatic volcanic coastline. The wildest way to experience the island's raw geology up close.",
    attractions: ['Coasteering along volcanic sea cliffs','Cliff jumping into Atlantic coves','Canyoning through lava rock gorges','Sea kayaking around lava arches'],
    food: [
      { name: 'Porto Moniz Restaurants', description: 'Post-adventure refuel at the seafood restaurants by the volcanic pools', type: 'Seafood' },
    ],
    nightlife: [],
    gettingThere: [
      { mode: 'car', info: '1.5 hours from Funchal via ER101 north coast road to Porto Moniz' },
    ],
    tips: ['Book in advance — group sizes are limited for safety reasons','All equipment is provided — just bring swimwear and a sense of adventure','Not suitable for non-swimmers or those with heart conditions'],
  },
  {
    id: 'pr17-pinaculo', name: 'PR17 Pináculo',
    coordinates: [32.76096517883961, -17.02032387314783], category: 'nature',
    duration: '3–4 hours', difficulty: 'moderate', pinColor: '#a29bfe',
    description: "A spectacular circular hiking trail in the Serra de Água valley that climbs to the Pináculo — a dramatic volcanic pinnacle with panoramic views over Madeira's central mountain ridge, deep ravines, and the distant Atlantic on both north and south coasts.",
    attractions: ['Pináculo volcanic pinnacle viewpoint','Panoramic dual-coast mountain views','Ancient levada irrigation channels','Endemic laurisilva forest sections'],
    food: [
      { name: 'Restaurante O Virgílio', description: 'Traditional Madeiran food in Serra de Água village at the trailhead', type: 'Traditional' },
    ],
    nightlife: [],
    gettingThere: [
      { mode: 'car', info: 'Start from Serra de Água village — 40 min from Funchal via ER228 through the mountains' },
      { mode: 'bus', info: 'SAM bus service to Serra de Água from Funchal, then walk to trailhead' },
    ],
    tips: ['The summit section is exposed and can be windy — check the forecast before setting out','Trail markers are red and yellow — follow carefully at the ridge junctions','Go early to have the panoramic viewpoint to yourself before day-trippers arrive'],
  },
  {
    id: 'veu-da-noiva', name: 'Véu da Noiva',
    coordinates: [32.81629257346102, -17.09526263556644], category: 'nature',
    duration: '30–60 min', difficulty: 'easy', pinColor: '#74b9ff',
    description: 'The "Bridal Veil" — a spectacular waterfall on the north coast that cascades hundreds of meters down sheer basalt cliffs directly onto the ER101 coastal road. One of the most dramatic and photogenic natural sights in Madeira.',
    attractions: ['Waterfall plunging onto the coastal road','Natural rock pool and mist at the base','Dramatic basalt cliff backdrop','Viewpoint platform on the road'],
    food: [
      { name: 'Cafés in Seixal', description: 'Small local cafes a short drive east in Seixal village', type: 'Local Café' },
    ],
    nightlife: [],
    gettingThere: [
      { mode: 'car', info: 'On the ER101 north coast road, between Seixal and Ribeira da Janela — roadside stop' },
      { mode: 'bus', info: 'Rodoeste line 6 north coast bus stops here on request' },
    ],
    tips: ['Stop the car and walk right under the waterfall — it is completely safe and magical','Most powerful after heavy rain — the flow multiplies dramatically','Combine with Seixal black sand beach just 2km east for a perfect half-day'],
  },
  {
    id: 'praia-machico', name: 'Praia de Machico',
    coordinates: [32.71920807621364, -16.762078101650143], category: 'beach',
    duration: '2–3 hours', difficulty: 'easy', pinColor: '#00B4D8',
    description: "Machico's sheltered sandy beach nestled in a natural bay, backed by the historic town where Portuguese explorers first landed in Madeira. One of the island's most accessible and charming beach spots.",
    attractions: ['Sandy beach in a sheltered bay','Historic Machico town centre nearby','Chapel of Senhor dos Milagres','Water sports and boat hire'],
    food: [
      { name: 'Restaurants in Machico', description: 'Fresh seafood and local dishes throughout the historic town', type: 'Seafood' },
    ],
    nightlife: [{ name: 'Machico Town Bars', description: 'Quiet authentic local bars in the oldest settlement on Madeira', type: 'Local Bars' }],
    gettingThere: [
      { mode: 'car', info: '25 min from Funchal via the eastern expressway (VR1)' },
      { mode: 'bus', info: 'SAM bus services run regularly between Funchal and Machico' },
    ],
    tips: ['One of the few natural sand beaches on the island — ideal for families','Explore the historic town centre after the beach','The bay is sheltered from the prevailing winds — good for swimming most of the year'],
  },
  {
    id: 'praia-maiata', name: 'Praia de Maiata',
    coordinates: [32.771104903765945, -16.82361490730201], category: 'hidden_gem',
    duration: '2–3 hours', difficulty: 'moderate', pinColor: '#FDCB6E',
    description: 'A secluded and largely unknown black pebble beach below steep coastal cliffs, reachable only by a short hike. One of the most peaceful and unspoilt spots on the island, rewarding those who seek it out.',
    attractions: ['Secluded black pebble beach','Crystal-clear Atlantic swimming','Dramatic coastal cliff scenery','Almost always deserted'],
    food: [
      { name: 'Bring your own picnic', description: 'No facilities on the beach — pack food and drinks for a perfect picnic', type: 'Picnic' },
    ],
    nightlife: [],
    gettingThere: [
      { mode: 'car', info: 'Park near the trailhead on the north coast road and hike down to the beach' },
      { mode: 'walk', info: 'Short steep walk down from the road — sturdy footwear recommended' },
    ],
    tips: ['Bring everything you need — there are no facilities at the beach','The steep path down requires care — take your time','Best visited on calm days when the Atlantic is at its most inviting'],
  },
  {
    id: 'levada-cedros', name: 'Levada dos Cedros',
    coordinates: [32.80100320934365, -17.144428782999867], category: 'nature',
    duration: '3–4 hours', difficulty: 'moderate', pinColor: '#00b894',
    description: 'A beautiful levada walk through the ancient laurisilva forest near Fanal, following an old irrigation channel through mist-wrapped cedar and laurel woodland. One of the most atmospheric trails in the UNESCO World Heritage forest.',
    attractions: ['Ancient laurisilva forest (UNESCO World Heritage)','Historic levada irrigation channel','Endemic Madeiran flora and birdlife','Fog and mist atmosphere in the tree canopy'],
    food: [
      { name: 'Estalagem da Encumeada', description: 'Mountain lodge restaurant nearby with hearty regional food', type: 'Mountain Lodge' },
    ],
    nightlife: [],
    gettingThere: [
      { mode: 'car', info: 'Car essential — 1 hour from Funchal via Paul da Serra plateau (ER110). Road often foggy' },
    ],
    tips: ['Wear waterproof layers — it is almost always cold, damp, and misty here','Best in early morning when the fog is thickest and the forest is most magical','Combine with Fanal Forest nearby for a full half-day in the ancient woodland'],
  },

  // ── Party ────────────────────────────────────────────────
  {
    id: 'pukiki-tiki-bar', name: 'Pukiki Tiki Bar',
    coordinates: [32.734695, -17.189771], category: 'party',
    duration: 'Evening', pinColor: '#e84393',
    description: 'A laid-back tiki bar in Calheta serving tropical cocktails and poncha with an island party vibe — perfect for sunset drinks on the west coast.',
    attractions: ['Tropical tiki cocktails','Poncha and local spirits','Relaxed island party atmosphere','Sunset drinks by the coast'],
    food: [],
    nightlife: [
      { name: 'Pukiki Tiki Bar', description: 'Tropical cocktails and poncha with a fun tiki party vibe', type: 'Tiki Bar' },
    ],
    gettingThere: [
      { mode: 'car', info: '45 min from Funchal via ER101 or Via Rápida west to Calheta' },
    ],
  },
  {
    id: 'three-house-bar', name: 'Three House Bar',
    coordinates: [32.64967, -16.90393], category: 'party',
    duration: 'Evening', pinColor: '#e84393',
    description: 'A popular bar near Funchal with a lively crowd, great cocktails, and a buzzing night-out atmosphere.',
    attractions: ['Lively cocktail bar','Buzzing night-out crowd','Great drinks selection'],
    food: [],
    nightlife: [
      { name: 'Three House Bar', description: 'Lively cocktail bar with a great party crowd', type: 'Cocktail Bar' },
    ],
    gettingThere: [
      { mode: 'car', info: 'Short drive from central Funchal' },
      { mode: 'taxi', info: 'Uber and licensed taxis available throughout Funchal' },
    ],
  },
  {
    id: 'purple-fridays', name: 'The Purple Fridays',
    coordinates: [32.67990398315592, -17.10365602022954], category: 'party',
    duration: 'Evening', pinColor: '#e84393',
    description: 'A vibrant Friday-night party spot bringing music, drinks, and a great crowd together for one of the best nights out on the island.',
    attractions: ['Friday-night parties','Live DJ and music','Great crowd and atmosphere'],
    food: [],
    nightlife: [
      { name: 'The Purple Fridays', description: 'Vibrant Friday-night party with music and a great crowd', type: 'Party Night' },
    ],
    gettingThere: [
      { mode: 'car', info: 'West of Funchal — reachable by car or taxi' },
      { mode: 'taxi', info: 'Taxi or Uber from central Funchal' },
    ],
  },
  {
    id: '64-by-loft', name: '64 by Loft',
    coordinates: [32.647833645671085, -16.913156462559026], category: 'party',
    duration: 'Evening', pinColor: '#e84393',
    description: 'A stylish bar and club in Funchal with a modern loft vibe, cocktails, and music that keeps the party going late.',
    attractions: ['Stylish loft-vibe bar','Cocktails and music','Late-night party atmosphere'],
    food: [],
    nightlife: [
      { name: '64 by Loft', description: 'Stylish loft-vibe bar and club with cocktails and late-night music', type: 'Bar & Club' },
    ],
    gettingThere: [
      { mode: 'car', info: 'In Funchal — short drive from the city centre' },
      { mode: 'taxi', info: 'Uber and licensed taxis available throughout Funchal' },
    ],
  },

  // ── Mirador ──────────────────────────────────────────────
  {
    id: 'mirador-sao-cristovao', name: 'Mirador São Cristóvão',
    coordinates: [32.82696106705081, -16.972907156990765], category: 'nature',
    duration: '30–60 min', difficulty: 'easy', pinColor: '#00b894',
    description: 'A peaceful viewpoint in the north of Madeira offering sweeping panoramas over the surrounding valleys and mountains — a lovely quiet stop to take in the island scenery.',
    attractions: ['Panoramic mountain and valley views','Quiet, uncrowded viewpoint','Great photo spot'],
    food: [],
    nightlife: [],
    gettingThere: [
      { mode: 'car', info: 'Car recommended — reachable via the northern roads of the island' },
    ],
    tips: ['Visit on a clear day for the best panoramic views','A quiet spot — perfect for a peaceful scenic break'],
  },
];
