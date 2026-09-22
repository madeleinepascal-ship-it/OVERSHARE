// Real, established charities, grouped by the activity they relate to.
//
// scope: 'hood'    — tied to specific neighbourhoods (`hoods`) in `city`
//        'city'    — based in and serving `city`
//        'country' — national, serving `country`
//        'global'  — works anywhere
//
// Links go to each organisation's own site; Overshare never handles money.
// Keep this list honest: only add organisations you've verified, and link
// their official homepage.

export const CHARITIES = [
  // ── Eating out → hunger relief & food rescue ──────────────────────────────
  { id: 'city-harvest-nyc', name: 'City Harvest', category: 'food', scope: 'city', city: 'nyc', url: 'https://www.cityharvest.org', blurb: 'Rescues surplus food from NYC restaurants and gets it to neighbours who need it.' },
  { id: 'food-bank-nyc', name: 'Food Bank For New York City', category: 'food', scope: 'city', city: 'nyc', url: 'https://www.foodbanknyc.org', blurb: 'The city’s largest hunger-relief organisation, working across all five boroughs.' },
  { id: 'glwd', name: 'God’s Love We Deliver', category: 'food', scope: 'hood', city: 'nyc', hoods: ['soho-nyc', 'tribeca', 'west-village'], url: 'https://www.glwd.org', blurb: 'Cooks and delivers medically tailored meals from its kitchen in SoHo.' },
  { id: 'welcome-to-chinatown', name: 'Welcome to Chinatown', category: 'food', scope: 'hood', city: 'nyc', hoods: ['chinatown-nyc', 'les'], url: 'https://www.welcometochinatown.com', blurb: 'Keeps Manhattan Chinatown’s small restaurants and businesses thriving.' },
  { id: 'felix-project', name: 'The Felix Project', category: 'food', scope: 'city', city: 'london', url: 'https://thefelixproject.org', blurb: 'Collects surplus food across London and redistributes it to charities and schools.' },
  { id: 'city-harvest-london', name: 'City Harvest London', category: 'food', scope: 'city', city: 'london', url: 'https://www.cityharvest.org.uk', blurb: 'Rescues surplus food and delivers it free to London community organisations.' },
  { id: 'fareshare', name: 'FareShare', category: 'food', scope: 'country', country: 'UK', url: 'https://fareshare.org.uk', blurb: 'The UK’s national network fighting hunger by tackling food waste.' },
  { id: 'la-food-bank', name: 'Los Angeles Regional Food Bank', category: 'food', scope: 'city', city: 'la', url: 'https://www.lafoodbank.org', blurb: 'Mobilises food and funds to fight hunger across LA County.' },
  { id: 'food-forward', name: 'Food Forward', category: 'food', scope: 'city', city: 'la', url: 'https://foodforward.org', blurb: 'Rescues fresh produce from farmers’ markets and orchards across Southern California.' },
  { id: 'sf-marin-food-bank', name: 'SF-Marin Food Bank', category: 'food', scope: 'city', city: 'sf', url: 'https://www.sfmfoodbank.org', blurb: 'Gets groceries to neighbours across San Francisco and Marin.' },
  { id: 'glide', name: 'GLIDE', category: 'food', scope: 'hood', city: 'sf', hoods: ['tenderloin', 'soma'], url: 'https://www.glide.org', blurb: 'Serves free meals every day from its home in the Tenderloin.' },
  { id: 'chicago-food-depository', name: 'Greater Chicago Food Depository', category: 'food', scope: 'city', city: 'chicago', url: 'https://www.chicagosfoodbank.org', blurb: 'Chicago’s food bank, working with hundreds of partner pantries across Cook County.' },
  { id: 'feeding-america', name: 'Feeding America', category: 'food', scope: 'country', country: 'US', url: 'https://www.feedingamerica.org', blurb: 'A nationwide network of food banks and meal programmes.' },
  { id: 'wck', name: 'World Central Kitchen', category: 'food', scope: 'global', url: 'https://wck.org', blurb: 'Chefs who show up with hot meals wherever disaster strikes.' },

  // ── Bars & nights out → hospitality workers ───────────────────────────────
  { id: 'southern-smoke', name: 'Southern Smoke Foundation', category: 'drinks', scope: 'country', country: 'US', url: 'https://southernsmoke.org', blurb: 'Emergency relief and mental-health care for food and beverage workers.' },
  { id: 'rwcf', name: 'Restaurant Workers’ Community Foundation', category: 'drinks', scope: 'country', country: 'US', url: 'https://www.restaurantworkerscf.org', blurb: 'Advocacy and direct support for the people who work in restaurants and bars.' },
  { id: 'drinks-trust', name: 'The Drinks Trust', category: 'drinks', scope: 'country', country: 'UK', url: 'https://drinkstrust.org.uk', blurb: 'The UK drinks industry’s charity — grants, wellbeing and career support.' },
  { id: 'hospitality-action', name: 'Hospitality Action', category: 'drinks', scope: 'country', country: 'UK', url: 'https://www.hospitalityaction.org.uk', blurb: 'Help for hospitality workers facing hard times, from crisis grants to counselling.' },

  // ── Live music → musicians & independent venues ───────────────────────────
  { id: 'jazz-foundation', name: 'Jazz Foundation of America', category: 'music', scope: 'city', city: 'nyc', url: 'https://jazzfoundation.org', blurb: 'NYC-based lifeline for jazz and blues musicians in need.' },
  { id: 'musicares', name: 'MusiCares', category: 'music', scope: 'country', country: 'US', url: 'https://www.musicares.org', blurb: 'Health, financial and addiction-recovery support for music people.' },
  { id: 'sweet-relief', name: 'Sweet Relief Musicians Fund', category: 'music', scope: 'country', country: 'US', url: 'https://www.sweetrelief.org', blurb: 'Financial help for career musicians facing illness or hardship.' },
  { id: 'music-will', name: 'Music Will', category: 'music', scope: 'country', country: 'US', url: 'https://musicwill.org', blurb: 'Puts instruments and music programmes into public schools.' },
  { id: 'sfjazz', name: 'SFJAZZ', category: 'music', scope: 'hood', city: 'sf', hoods: ['hayes-valley'], url: 'https://www.sfjazz.org', blurb: 'Nonprofit jazz centre in Hayes Valley with year-round education programmes.' },
  { id: 'old-town-school', name: 'Old Town School of Folk Music', category: 'music', scope: 'city', city: 'chicago', url: 'https://www.oldtownschool.org', blurb: 'Chicago institution teaching and presenting music since 1957.' },
  { id: 'music-venue-trust', name: 'Music Venue Trust', category: 'music', scope: 'country', country: 'UK', url: 'https://www.musicvenuetrust.com', blurb: 'Protects the UK’s grassroots music venues — the rooms where it all starts.' },
  { id: 'help-musicians', name: 'Help Musicians', category: 'music', scope: 'country', country: 'UK', url: 'https://www.helpmusicians.org.uk', blurb: 'Health, welfare and career support for UK musicians.' },

  // ── Coffee runs → coffee-growing communities ──────────────────────────────
  { id: 'grounds-for-health', name: 'Grounds for Health', category: 'coffee', scope: 'global', url: 'https://www.groundsforhealth.org', blurb: 'Cervical cancer prevention in coffee-growing communities.' },
  { id: 'food-4-farmers', name: 'Food 4 Farmers', category: 'coffee', scope: 'global', url: 'https://food4farmers.org', blurb: 'Helps coffee-farming families end seasonal hunger.' },

  // ── Galleries & museums → arts access & artists ──────────────────────────
  { id: 'studio-in-a-school', name: 'Studio in a School', category: 'art', scope: 'city', city: 'nyc', url: 'https://www.studioinaschool.org', blurb: 'Brings professional artists into NYC classrooms.' },
  { id: 'creative-time', name: 'Creative Time', category: 'art', scope: 'city', city: 'nyc', url: 'https://creativetime.org', blurb: 'Commissions free public art across New York.' },
  { id: 'art-fund', name: 'Art Fund', category: 'art', scope: 'country', country: 'UK', url: 'https://www.artfund.org', blurb: 'The UK’s national charity for art, supporting museums and galleries.' },
  { id: 'inner-city-arts', name: 'Inner-City Arts', category: 'art', scope: 'city', city: 'la', url: 'https://www.inner-cityarts.org', blurb: 'Free arts education for LA’s young people, from its campus downtown.' },
  { id: 'creativity-explored', name: 'Creativity Explored', category: 'art', scope: 'hood', city: 'sf', hoods: ['mission'], url: 'https://creativityexplored.org', blurb: 'Studio and gallery in the Mission for artists with developmental disabilities.' },
  { id: 'marwen', name: 'Marwen', category: 'art', scope: 'city', city: 'chicago', url: 'https://www.marwen.org', blurb: 'Free visual arts programmes for Chicago youth.' },
  { id: 'creative-capital', name: 'Creative Capital', category: 'art', scope: 'country', country: 'US', url: 'https://creative-capital.org', blurb: 'Funds and supports adventurous artists across the US.' },

  // ── Parks & outdoors → green space ────────────────────────────────────────
  { id: 'central-park-conservancy', name: 'Central Park Conservancy', category: 'outdoors', scope: 'hood', city: 'nyc', hoods: ['uws', 'ues', 'midtown', 'harlem'], url: 'https://www.centralparknyc.org', blurb: 'Keeps Central Park green, clean and open to everyone.' },
  { id: 'prospect-park-alliance', name: 'Prospect Park Alliance', category: 'outdoors', scope: 'hood', city: 'nyc', hoods: ['park-slope', 'prospect-heights', 'crown-heights'], url: 'https://www.prospectpark.org', blurb: 'Cares for Brooklyn’s backyard.' },
  { id: 'friends-high-line', name: 'Friends of the High Line', category: 'outdoors', scope: 'hood', city: 'nyc', hoods: ['chelsea', 'west-village'], url: 'https://www.thehighline.org', blurb: 'Maintains and programmes the High Line.' },
  { id: 'nyrp', name: 'New York Restoration Project', category: 'outdoors', scope: 'city', city: 'nyc', url: 'https://www.nyrp.org', blurb: 'Plants trees and builds gardens in under-resourced NYC neighbourhoods.' },
  { id: 'trees-for-cities', name: 'Trees for Cities', category: 'outdoors', scope: 'city', city: 'london', url: 'https://www.treesforcities.org', blurb: 'Plants urban trees and greens school grounds, starting in London.' },
  { id: 'national-trust', name: 'National Trust', category: 'outdoors', scope: 'country', country: 'UK', url: 'https://www.nationaltrust.org.uk', blurb: 'Looks after coast, countryside and green spaces across the UK.' },
  { id: 'treepeople', name: 'TreePeople', category: 'outdoors', scope: 'city', city: 'la', url: 'https://www.treepeople.org', blurb: 'Grows LA’s urban forest, one neighbourhood at a time.' },
  { id: 'sf-parks-alliance', name: 'San Francisco Parks Alliance', category: 'outdoors', scope: 'city', city: 'sf', url: 'https://www.sfparksalliance.org', blurb: 'Champions and activates parks across San Francisco.' },
  { id: 'friends-of-the-parks', name: 'Friends of the Parks', category: 'outdoors', scope: 'city', city: 'chicago', url: 'https://fotp.org', blurb: 'Advocates for Chicago’s parks and lakefront.' },
  { id: 'tpl', name: 'Trust for Public Land', category: 'outdoors', scope: 'country', country: 'US', url: 'https://www.tpl.org', blurb: 'Creates parks so everyone lives within a 10-minute walk of one.' },

  // ── Run clubs & workouts → sport for young people ─────────────────────────
  { id: 'good-sports', name: 'Good Sports', category: 'movement', scope: 'country', country: 'US', url: 'https://www.goodsports.org', blurb: 'Gets equipment and apparel to kids in underserved communities.' },
  { id: 'girls-on-the-run', name: 'Girls on the Run', category: 'movement', scope: 'country', country: 'US', url: 'https://www.girlsontherun.org', blurb: 'Running programmes that build confidence in girls.' },
  { id: 'streetgames', name: 'StreetGames', category: 'movement', scope: 'country', country: 'UK', url: 'https://www.streetgames.org', blurb: 'Brings sport to young people in low-income UK communities.' },
  { id: 'laureus', name: 'Laureus Sport for Good', category: 'movement', scope: 'global', url: 'https://www.laureus.com', blurb: 'Uses sport to change young lives around the world.' },

  // ── Fits & vintage → clothing, reuse & work ───────────────────────────────
  { id: 'housing-works', name: 'Housing Works', category: 'style', scope: 'city', city: 'nyc', url: 'https://www.housingworks.org', blurb: 'NYC thrift shops funding the fight against homelessness and HIV/AIDS.' },
  { id: 'smart-works', name: 'Smart Works', category: 'style', scope: 'country', country: 'UK', url: 'https://smartworks.org.uk', blurb: 'Interview clothing and coaching for unemployed women across the UK.' },
  { id: 'downtown-womens-center', name: 'Downtown Women’s Center', category: 'style', scope: 'city', city: 'la', url: 'https://downtownwomenscenter.org', blurb: 'Housing and support for women in Skid Row, with a resale boutique.' },
  { id: 'dress-for-success', name: 'Dress for Success', category: 'style', scope: 'global', url: 'https://dressforsuccess.org', blurb: 'Work-ready clothing and career support for women worldwide.' },

  // ── Books → literacy & young writers ──────────────────────────────────────
  { id: '826nyc', name: '826NYC', category: 'books', scope: 'hood', city: 'nyc', hoods: ['park-slope'], url: 'https://826nyc.org', blurb: 'Free writing programmes for kids, behind a superhero supply store in Park Slope.' },
  { id: '826la', name: '826LA', category: 'books', scope: 'hood', city: 'la', hoods: ['echo-park', 'venice'], url: 'https://826la.org', blurb: 'Free writing tutoring for LA students, with centres in Echo Park and Mar Vista.' },
  { id: '826valencia', name: '826 Valencia', category: 'books', scope: 'hood', city: 'sf', hoods: ['mission', 'tenderloin'], url: 'https://826valencia.org', blurb: 'The original 826 — free writing programmes behind a pirate store on Valencia St.' },
  { id: '826chi', name: '826CHI', category: 'books', scope: 'hood', city: 'chicago', hoods: ['wicker-park'], url: 'https://826chi.org', blurb: 'Free writing programmes for Chicago students, based in Wicker Park.' },
  { id: 'national-literacy-trust', name: 'National Literacy Trust', category: 'books', scope: 'country', country: 'UK', url: 'https://literacytrust.org.uk', blurb: 'Helps UK children and families build reading and writing skills.' },
  { id: 'first-book', name: 'First Book', category: 'books', scope: 'country', country: 'US', url: 'https://firstbook.org', blurb: 'Gets new books into the hands of kids who need them.' },
  { id: 'rif', name: 'Reading Is Fundamental', category: 'books', scope: 'country', country: 'US', url: 'https://www.rif.org', blurb: 'The US’s largest children’s literacy nonprofit.' },

  // ── Pets → animal rescue ─────────────────────────────────────────────────
  { id: 'nyc-acc', name: 'Animal Care Centers of NYC', category: 'pets', scope: 'city', city: 'nyc', url: 'https://www.nycacc.org', blurb: 'NYC’s open-admissions shelter, taking in every animal that needs help.' },
  { id: 'battersea', name: 'Battersea', category: 'pets', scope: 'city', city: 'london', url: 'https://www.battersea.org.uk', blurb: 'London’s legendary dogs and cats home, since 1860.' },
  { id: 'sf-spca', name: 'San Francisco SPCA', category: 'pets', scope: 'city', city: 'sf', url: 'https://www.sfspca.org', blurb: 'Rescue, adoption and vet care for San Francisco’s animals.' },
  { id: 'paws-chicago', name: 'PAWS Chicago', category: 'pets', scope: 'city', city: 'chicago', url: 'https://www.pawschicago.org', blurb: 'Chicago’s no-kill rescue and adoption network.' },
  { id: 'best-friends', name: 'Best Friends Animal Society', category: 'pets', scope: 'country', country: 'US', url: 'https://bestfriends.org', blurb: 'Working to make every US shelter no-kill, with a big LA adoption centre.' },
  { id: 'aspca', name: 'ASPCA', category: 'pets', scope: 'country', country: 'US', url: 'https://www.aspca.org', blurb: 'Rescue, protection and adoption for animals across the US.' },
];
