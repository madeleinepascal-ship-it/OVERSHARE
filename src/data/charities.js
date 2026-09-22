// Real, established New York organizations, grouped by the activity they
// relate to, plus a few national/global fallbacks.
//
// scope: 'hood'    — rooted in specific neighborhoods (`hoods`)
//        'borough' — serving particular boroughs (`boroughs`)
//        'city'    — serving all five boroughs
//        'country' — national (US)
//        'global'  — works anywhere
//
// Links go to each organization's own site; Overshare never handles money.
// Keep this list honest: only add organizations you've verified, and link
// their official homepage.

export const CHARITIES = [
  // ── Eating out → hunger relief & food rescue ──────────────────────────────
  { id: 'glwd', name: 'God’s Love We Deliver', category: 'food', scope: 'hood', hoods: ['soho', 'tribeca', 'west-village'], url: 'https://www.glwd.org', blurb: 'Cooks and delivers medically tailored meals from its kitchen in SoHo.' },
  { id: 'welcome-to-chinatown', name: 'Welcome to Chinatown', category: 'food', scope: 'hood', hoods: ['chinatown', 'les'], url: 'https://www.welcometochinatown.com', blurb: 'Keeps Manhattan Chinatown’s small restaurants and businesses thriving.' },
  { id: 'holy-apostles', name: 'Holy Apostles Soup Kitchen', category: 'food', scope: 'hood', hoods: ['chelsea', 'flatiron', 'hells-kitchen'], url: 'https://www.holyapostlessoupkitchen.org', blurb: 'One of the city’s largest soup kitchens, serving hot meals in Chelsea.' },
  { id: 'bread-and-life', name: 'St. John’s Bread & Life', category: 'food', scope: 'hood', hoods: ['bed-stuy', 'crown-heights', 'bushwick'], url: 'https://www.breadandlife.org', blurb: 'Hot meals, a digital food pantry and support services in Bed-Stuy.' },
  { id: 'masbia', name: 'Masbia', category: 'food', scope: 'hood', hoods: ['flatbush', 'sunset-park', 'williamsburg'], url: 'https://www.masbia.org', blurb: 'Soup kitchens and pantries serving anyone in need, in Brooklyn and Queens.' },
  { id: 'pots', name: 'Part of the Solution (POTS)', category: 'food', scope: 'borough', boroughs: ['bronx'], url: 'https://www.potsbronx.org', blurb: 'A Bronx community dining room, pantry and more, since 1982.' },
  { id: 'city-harvest', name: 'City Harvest', category: 'food', scope: 'city', url: 'https://www.cityharvest.org', blurb: 'Rescues surplus food from NYC restaurants and gets it to neighbors who need it.' },
  { id: 'food-bank-nyc', name: 'Food Bank For New York City', category: 'food', scope: 'city', url: 'https://www.foodbanknyc.org', blurb: 'The city’s largest hunger-relief organization, working across all five boroughs.' },
  { id: 'citymeals', name: 'Citymeals on Wheels', category: 'food', scope: 'city', url: 'https://www.citymeals.org', blurb: 'Weekend and holiday meals for homebound older New Yorkers.' },
  { id: 'rethink-food', name: 'Rethink Food', category: 'food', scope: 'city', url: 'https://www.rethinkfood.org', blurb: 'Partners with NYC restaurants to turn surplus into free, chef-made meals.' },

  // ── Bars & nights out → hospitality workers ───────────────────────────────
  { id: 'emmas-torch', name: 'Emma’s Torch', category: 'drinks', scope: 'hood', hoods: ['carroll-gardens', 'red-hook', 'gowanus'], url: 'https://emmastorch.org', blurb: 'Paid culinary training for refugees and survivors, with a restaurant in Brooklyn.' },
  { id: 'drive-change', name: 'Drive Change', category: 'drinks', scope: 'city', url: 'https://www.drivechange.org', blurb: 'Hospitality jobs and training for young New Yorkers coming home from jail.' },
  { id: 'hot-bread-kitchen', name: 'Hot Bread Kitchen', category: 'drinks', scope: 'city', url: 'https://hotbreadkitchen.org', blurb: 'Culinary and career training that gets New Yorkers into good food-industry jobs.' },
  { id: 'rwcf', name: 'Restaurant Workers’ Community Foundation', category: 'drinks', scope: 'country', url: 'https://www.restaurantworkerscf.org', blurb: 'Advocacy and direct support for the people who work in restaurants and bars.' },
  { id: 'southern-smoke', name: 'Southern Smoke Foundation', category: 'drinks', scope: 'country', url: 'https://southernsmoke.org', blurb: 'Emergency relief and mental-health care for food and beverage workers.' },

  // ── Live music → musicians & venues ───────────────────────────────────────
  { id: 'jazzmobile', name: 'Jazzmobile', category: 'music', scope: 'hood', hoods: ['harlem', 'washington-heights', 'uws'], url: 'https://jazzmobile.org', blurb: 'Free outdoor jazz and jazz education, rooted in Harlem since 1964.' },
  { id: 'bric', name: 'BRIC', category: 'music', scope: 'hood', hoods: ['fort-greene', 'prospect-heights', 'park-slope'], url: 'https://www.bricartsmedia.org', blurb: 'Home of the free BRIC Celebrate Brooklyn! festival in Prospect Park.' },
  { id: 'brooklyn-youth-chorus', name: 'Brooklyn Youth Chorus', category: 'music', scope: 'borough', boroughs: ['brooklyn'], url: 'https://brooklynyouthchorus.org', blurb: 'Music training for young singers from across Brooklyn and beyond.' },
  { id: 'jazz-foundation', name: 'Jazz Foundation of America', category: 'music', scope: 'city', url: 'https://jazzfoundation.org', blurb: 'NYC-based lifeline for jazz and blues musicians in need.' },
  { id: 'city-parks-foundation', name: 'City Parks Foundation', category: 'music', scope: 'city', url: 'https://cityparksfoundation.org', blurb: 'Runs SummerStage — free concerts in parks across all five boroughs.' },
  { id: 'harmony-program', name: 'The Harmony Program', category: 'music', scope: 'city', url: 'https://www.harmonyprogram.org', blurb: 'Free, intensive music education for NYC kids.' },
  { id: 'musicares', name: 'MusiCares', category: 'music', scope: 'country', url: 'https://www.musicares.org', blurb: 'Health, financial and addiction-recovery support for music people.' },

  // ── Coffee runs → coffee-growing communities ──────────────────────────────
  // Coffee comes from somewhere else, so these are global by nature.
  { id: 'grounds-for-health', name: 'Grounds for Health', category: 'coffee', scope: 'global', url: 'https://www.groundsforhealth.org', blurb: 'Cervical cancer prevention in coffee-growing communities.' },
  { id: 'food-4-farmers', name: 'Food 4 Farmers', category: 'coffee', scope: 'global', url: 'https://food4farmers.org', blurb: 'Helps coffee-farming families end seasonal hunger.' },

  // ── Galleries, museums & theater → arts access ────────────────────────────
  { id: 'studio-museum', name: 'The Studio Museum in Harlem', category: 'art', scope: 'hood', hoods: ['harlem'], url: 'https://studiomuseum.org', blurb: 'Champions artists of African descent, from its home on 125th St.' },
  { id: 'el-museo', name: 'El Museo del Barrio', category: 'art', scope: 'hood', hoods: ['harlem', 'ues'], url: 'https://www.elmuseo.org', blurb: 'Latinx and Latin American art on Museum Mile in East Harlem.' },
  { id: 'tenement-museum', name: 'Tenement Museum', category: 'art', scope: 'hood', hoods: ['les', 'east-village', 'chinatown'], url: 'https://www.tenement.org', blurb: 'Tells the story of immigrant New York on the Lower East Side.' },
  { id: 'brooklyn-museum', name: 'Brooklyn Museum', category: 'art', scope: 'hood', hoods: ['prospect-heights', 'crown-heights', 'park-slope'], url: 'https://www.brooklynmuseum.org', blurb: 'Brooklyn’s great encyclopedic museum, next to Prospect Park.' },
  { id: 'queens-museum', name: 'Queens Museum', category: 'art', scope: 'hood', hoods: ['flushing', 'jackson-heights'], url: 'https://queensmuseum.org', blurb: 'Home of the Panorama of the City of New York, in Flushing Meadows.' },
  { id: 'socrates', name: 'Socrates Sculpture Park', category: 'art', scope: 'hood', hoods: ['astoria', 'lic'], url: 'https://socratessculpturepark.org', blurb: 'A free waterfront park where artists build big, in Astoria.' },
  { id: 'bronx-museum', name: 'The Bronx Museum of the Arts', category: 'art', scope: 'borough', boroughs: ['bronx'], url: 'https://www.bronxmuseum.org', blurb: 'Contemporary art in the Bronx, always free.' },
  { id: 'tdf', name: 'TDF', category: 'art', scope: 'hood', hoods: ['midtown', 'hells-kitchen'], url: 'https://www.tdf.org', blurb: 'The people behind the TKTS booth, making theater affordable for New Yorkers.' },
  { id: 'public-theater', name: 'The Public Theater', category: 'art', scope: 'city', url: 'https://publictheater.org', blurb: 'Free Shakespeare in the Park and new work on Lafayette St.' },
  { id: 'studio-in-a-school', name: 'Studio in a School', category: 'art', scope: 'city', url: 'https://www.studioinaschool.org', blurb: 'Brings professional artists into NYC classrooms.' },
  { id: 'groundswell', name: 'Groundswell', category: 'art', scope: 'city', url: 'https://www.groundswellmural.org', blurb: 'Young New Yorkers and artists painting murals that change blocks.' },
  { id: 'creative-time', name: 'Creative Time', category: 'art', scope: 'city', url: 'https://creativetime.org', blurb: 'Commissions free public art across New York.' },

  // ── Parks & outdoors → green space ────────────────────────────────────────
  { id: 'central-park-conservancy', name: 'Central Park Conservancy', category: 'outdoors', scope: 'hood', hoods: ['central-park', 'uws', 'ues', 'harlem', 'midtown'], url: 'https://www.centralparknyc.org', blurb: 'Keeps Central Park green, clean and open to everyone.' },
  { id: 'prospect-park-alliance', name: 'Prospect Park Alliance', category: 'outdoors', scope: 'hood', hoods: ['park-slope', 'prospect-heights', 'crown-heights', 'flatbush'], url: 'https://www.prospectpark.org', blurb: 'Cares for Brooklyn’s backyard.' },
  { id: 'friends-high-line', name: 'Friends of the High Line', category: 'outdoors', scope: 'hood', hoods: ['chelsea'], url: 'https://www.thehighline.org', blurb: 'Maintains and programs the High Line.' },
  { id: 'north-brooklyn-parks', name: 'North Brooklyn Parks Alliance', category: 'outdoors', scope: 'hood', hoods: ['williamsburg', 'greenpoint', 'bushwick'], url: 'https://northbrooklynparks.org', blurb: 'Looks after McCarren, Transmitter and the parks of North Brooklyn.' },
  { id: 'washington-square-conservancy', name: 'Washington Square Park Conservancy', category: 'outdoors', scope: 'hood', hoods: ['west-village', 'soho', 'east-village'], url: 'https://www.washingtonsquareparkconservancy.org', blurb: 'Keeps the arch, the fountain and the chess tables in good shape.' },
  { id: 'madison-square-park', name: 'Madison Square Park Conservancy', category: 'outdoors', scope: 'hood', hoods: ['flatiron'], url: 'https://madisonsquarepark.org', blurb: 'Gardens and free public art in the park by the Flatiron.' },
  { id: 'riverside-park', name: 'Riverside Park Conservancy', category: 'outdoors', scope: 'hood', hoods: ['uws', 'harlem', 'washington-heights'], url: 'https://riversideparknyc.org', blurb: 'Cares for four miles of Hudson waterfront park.' },
  { id: 'the-battery', name: 'The Battery Conservancy', category: 'outdoors', scope: 'hood', hoods: ['fidi', 'tribeca'], url: 'https://www.thebattery.org', blurb: 'Gardens and green space at the tip of Manhattan.' },
  { id: 'green-wood', name: 'The Green-Wood Historic Fund', category: 'outdoors', scope: 'hood', hoods: ['sunset-park', 'park-slope'], url: 'https://www.green-wood.com', blurb: 'Preserves 478 acres of hills, trees and history in Brooklyn.' },
  { id: 'brooklyn-botanic', name: 'Brooklyn Botanic Garden', category: 'outdoors', scope: 'hood', hoods: ['prospect-heights', 'crown-heights'], url: 'https://www.bbg.org', blurb: 'Cherry blossoms, community greening and garden science.' },
  { id: 'queens-botanical', name: 'Queens Botanical Garden', category: 'outdoors', scope: 'hood', hoods: ['flushing'], url: 'https://queensbotanical.org', blurb: 'A green oasis celebrating the people and plants of Queens.' },
  { id: 'rockaway-waterfront', name: 'Rockaway Waterfront Alliance', category: 'outdoors', scope: 'hood', hoods: ['rockaway'], url: 'https://www.rwalliance.org', blurb: 'Environmental and outdoor programs on the Rockaway peninsula.' },
  { id: 'nybg', name: 'New York Botanical Garden', category: 'outdoors', scope: 'borough', boroughs: ['bronx'], url: 'https://www.nybg.org', blurb: '250 acres of garden and old-growth forest in the Bronx.' },
  { id: 'van-cortlandt', name: 'Van Cortlandt Park Alliance', category: 'outdoors', scope: 'hood', hoods: ['riverdale'], url: 'https://vcpark.org', blurb: 'Cares for the Bronx’s third-largest park.' },
  { id: 'nyrp', name: 'New York Restoration Project', category: 'outdoors', scope: 'city', url: 'https://www.nyrp.org', blurb: 'Plants trees and builds gardens in under-resourced NYC neighborhoods.' },
  { id: 'billion-oyster', name: 'Billion Oyster Project', category: 'outdoors', scope: 'city', url: 'https://www.billionoysterproject.org', blurb: 'Restoring oyster reefs — and a cleaner harbor — with NYC students.' },
  { id: 'grownyc', name: 'GrowNYC', category: 'outdoors', scope: 'city', url: 'https://www.grownyc.org', blurb: 'Greenmarkets, community gardens and recycling across the city.' },

  // ── Run clubs & workouts → sport for young people ─────────────────────────
  { id: 'figure-skating-harlem', name: 'Figure Skating in Harlem', category: 'movement', scope: 'hood', hoods: ['harlem', 'central-park'], url: 'https://figureskatinginharlem.org', blurb: 'Skating, academics and confidence for girls of color.' },
  { id: 'dream', name: 'DREAM', category: 'movement', scope: 'hood', hoods: ['harlem', 'mott-haven'], url: 'https://www.wearedream.org', blurb: 'Baseball, softball and schools in East Harlem and the South Bronx.' },
  { id: 'asphalt-green', name: 'Asphalt Green', category: 'movement', scope: 'hood', hoods: ['ues', 'fidi'], url: 'https://www.asphaltgreen.org', blurb: 'Swim and sports programs for NYC kids, from the Upper East Side.' },
  { id: 'row-new-york', name: 'Row New York', category: 'movement', scope: 'city', url: 'https://rownewyork.org', blurb: 'Rowing and academic support for young people from under-resourced communities.' },
  { id: 'nyrr', name: 'New York Road Runners', category: 'movement', scope: 'city', url: 'https://www.nyrr.org', blurb: 'Free youth running programs in schools across all five boroughs.' },
  { id: 'good-sports', name: 'Good Sports', category: 'movement', scope: 'country', url: 'https://www.goodsports.org', blurb: 'Gets equipment and apparel to kids in underserved communities.' },

  // ── Fits & vintage → clothing, reuse & work ───────────────────────────────
  { id: 'housing-works', name: 'Housing Works', category: 'style', scope: 'city', url: 'https://www.housingworks.org', blurb: 'NYC’s favorite thrift shops, funding the fight against homelessness and HIV/AIDS.' },
  { id: 'fabscrap', name: 'FABSCRAP', category: 'style', scope: 'city', url: 'https://fabscrap.org', blurb: 'Keeps the fashion industry’s offcuts out of landfill — from the Brooklyn Navy Yard.' },
  { id: 'career-gear', name: 'Career Gear', category: 'style', scope: 'city', url: 'https://www.careergear.org', blurb: 'Interview suits and job coaching for men getting back to work.' },
  { id: 'dress-for-success', name: 'Dress for Success', category: 'style', scope: 'global', url: 'https://dressforsuccess.org', blurb: 'Work-ready clothing and career support for women — founded in NYC.' },

  // ── Books → literacy & young writers ──────────────────────────────────────
  { id: '826nyc', name: '826NYC', category: 'books', scope: 'hood', hoods: ['park-slope', 'gowanus', 'prospect-heights'], url: 'https://826nyc.org', blurb: 'Free writing programs for kids, behind a superhero supply store in Park Slope.' },
  { id: 'brooklyn-public-library', name: 'Brooklyn Public Library', category: 'books', scope: 'borough', boroughs: ['brooklyn'], url: 'https://www.bklynlibrary.org', blurb: 'Sixty branches and counting, free to every Brooklynite.' },
  { id: 'queens-public-library', name: 'Queens Public Library', category: 'books', scope: 'borough', boroughs: ['queens'], url: 'https://www.queenslibrary.org', blurb: 'Serving one of the most diverse places on earth, in 60+ languages.' },
  { id: 'nypl', name: 'The New York Public Library', category: 'books', scope: 'borough', boroughs: ['manhattan', 'bronx', 'staten-island'], url: 'https://www.nypl.org', blurb: 'The lions, plus 90+ free branches across Manhattan, the Bronx and Staten Island.' },
  { id: 'girls-write-now', name: 'Girls Write Now', category: 'books', scope: 'city', url: 'https://www.girlswritenow.org', blurb: 'Pairs NYC teen writers with professional mentors.' },
  { id: 'books-through-bars', name: 'NYC Books Through Bars', category: 'books', scope: 'city', url: 'https://booksthroughbarsnyc.org', blurb: 'Volunteers sending free books to people in prison.' },

  // ── Pets → animal rescue ─────────────────────────────────────────────────
  { id: 'barc', name: 'BARC Shelter', category: 'pets', scope: 'hood', hoods: ['williamsburg', 'greenpoint', 'bushwick'], url: 'https://www.barcshelter.org', blurb: 'No-kill dog and cat rescue in Williamsburg since 1987.' },
  { id: 'sean-casey', name: 'Sean Casey Animal Rescue', category: 'pets', scope: 'hood', hoods: ['park-slope', 'flatbush', 'prospect-heights'], url: 'https://www.nyanimalrescue.org', blurb: 'Brooklyn rescue for dogs, cats and the occasional snake, in Windsor Terrace.' },
  { id: 'social-tees', name: 'Social Tees Animal Rescue', category: 'pets', scope: 'hood', hoods: ['east-village', 'les'], url: 'https://www.socialtees.org', blurb: 'Tiny East Village rescue that finds homes for thousands of animals.' },
  { id: 'animal-haven', name: 'Animal Haven', category: 'pets', scope: 'hood', hoods: ['soho', 'chinatown', 'tribeca'], url: 'https://animalhaven.org', blurb: 'No-kill shelter in lower Manhattan, rehabilitating cats and dogs.' },
  { id: 'bideawee', name: 'Bideawee', category: 'pets', scope: 'hood', hoods: ['midtown', 'flatiron'], url: 'https://www.bideawee.org', blurb: 'Adoption, vet care and pet therapy in Manhattan since 1903.' },
  { id: 'nyc-acc', name: 'Animal Care Centers of NYC', category: 'pets', scope: 'city', url: 'https://www.nycacc.org', blurb: 'NYC’s open-admissions shelter, taking in every animal that needs help.' },
  { id: 'muddy-paws', name: 'Muddy Paws Rescue', category: 'pets', scope: 'city', url: 'https://www.muddypawsrescue.org', blurb: 'Foster-based dog rescue placing pups across the city.' },
];
