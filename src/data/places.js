// New York, borough by borough and block by block. We recognize these from
// caption text or photo GPS. Coordinates are approximate neighborhood centers.
//
// Aliases written in ALL CAPS (e.g. "LES", "UWS") only match in that exact
// case, so "les" in a French caption doesn't send you to the Lower East Side.

export const NYC = {
  name: 'New York',
  lat: 40.7128,
  lng: -74.006,
  aliases: ['new york', 'new york city', 'NYC', 'nyc'],
  tags: ['nyc', 'newyork'],
};

export const BOROUGHS = [
  { id: 'manhattan', name: 'Manhattan', aliases: ['manhattan'], tags: ['manhattan'] },
  { id: 'brooklyn', name: 'Brooklyn', aliases: ['brooklyn', 'BK'], tags: ['brooklyn'] },
  { id: 'queens', name: 'Queens', aliases: ['queens ny', 'queens, ny', 'in queens', 'out in queens'], tags: ['queensny', 'queensnyc'] },
  { id: 'bronx', name: 'the Bronx', aliases: ['the bronx', 'bronx'], tags: ['bronx'] },
  { id: 'staten-island', name: 'Staten Island', aliases: ['staten island'], tags: ['statenisland'] },
];

export const HOODS = [
  // Brooklyn
  { id: 'williamsburg', borough: 'brooklyn', name: 'Williamsburg', lat: 40.7081, lng: -73.9571, aliases: ['williamsburg', 'billyburg', 'wburg', 'domino park', 'smorgasburg'] },
  { id: 'greenpoint', borough: 'brooklyn', name: 'Greenpoint', lat: 40.7304, lng: -73.9515, aliases: ['greenpoint', 'mccarren park', 'mccarren'] },
  { id: 'bushwick', borough: 'brooklyn', name: 'Bushwick', lat: 40.6944, lng: -73.9213, aliases: ['bushwick', 'east williamsburg'] },
  { id: 'bed-stuy', borough: 'brooklyn', name: 'Bed-Stuy', lat: 40.6872, lng: -73.9418, aliases: ['bed-stuy', 'bed stuy', 'bedstuy', 'bedford-stuyvesant'] },
  { id: 'fort-greene', borough: 'brooklyn', name: 'Fort Greene', lat: 40.6893, lng: -73.9743, aliases: ['fort greene', 'clinton hill'] },
  { id: 'dumbo', borough: 'brooklyn', name: 'DUMBO', lat: 40.7033, lng: -73.9881, aliases: ['dumbo', 'brooklyn bridge park', 'brooklyn heights'] },
  { id: 'carroll-gardens', borough: 'brooklyn', name: 'Carroll Gardens', lat: 40.6795, lng: -73.9992, aliases: ['carroll gardens', 'cobble hill', 'boerum hill'] },
  { id: 'red-hook', borough: 'brooklyn', name: 'Red Hook', lat: 40.6755, lng: -74.011, aliases: ['red hook'] },
  { id: 'gowanus', borough: 'brooklyn', name: 'Gowanus', lat: 40.6733, lng: -73.9903, aliases: ['gowanus'] },
  { id: 'park-slope', borough: 'brooklyn', name: 'Park Slope', lat: 40.671, lng: -73.9814, aliases: ['park slope', 'windsor terrace'] },
  { id: 'prospect-heights', borough: 'brooklyn', name: 'Prospect Heights', lat: 40.6775, lng: -73.9692, aliases: ['prospect heights', 'prospect park', 'grand army plaza'] },
  { id: 'crown-heights', borough: 'brooklyn', name: 'Crown Heights', lat: 40.6694, lng: -73.9422, aliases: ['crown heights'] },
  { id: 'flatbush', borough: 'brooklyn', name: 'Flatbush', lat: 40.6409, lng: -73.9624, aliases: ['flatbush', 'ditmas park', 'prospect lefferts'] },
  { id: 'sunset-park', borough: 'brooklyn', name: 'Sunset Park', lat: 40.6455, lng: -74.0124, aliases: ['sunset park', 'industry city', 'green-wood', 'greenwood cemetery'] },
  { id: 'coney-island', borough: 'brooklyn', name: 'Coney Island', lat: 40.5755, lng: -73.9707, aliases: ['coney island', 'brighton beach'] },

  // Manhattan
  { id: 'les', borough: 'manhattan', name: 'Lower East Side', lat: 40.715, lng: -73.9843, aliases: ['lower east side', 'LES', 'orchard st', 'the bowery', 'bowery'] },
  { id: 'east-village', borough: 'manhattan', name: 'East Village', lat: 40.7265, lng: -73.9815, aliases: ['east village', 'alphabet city', 'tompkins square', 'st marks'] },
  { id: 'west-village', borough: 'manhattan', name: 'West Village', lat: 40.7358, lng: -74.0036, aliases: ['west village', 'greenwich village', 'washington square'] },
  { id: 'soho', borough: 'manhattan', name: 'SoHo', lat: 40.7233, lng: -74.003, aliases: ['soho', 'nolita', 'noho'] },
  { id: 'chinatown', borough: 'manhattan', name: 'Chinatown', lat: 40.7158, lng: -73.997, aliases: ['chinatown', 'little italy'] },
  { id: 'tribeca', borough: 'manhattan', name: 'Tribeca', lat: 40.7163, lng: -74.0086, aliases: ['tribeca'] },
  { id: 'fidi', borough: 'manhattan', name: 'FiDi', lat: 40.7075, lng: -74.0113, aliases: ['financial district', 'fidi', 'the battery', 'battery park', 'seaport'] },
  { id: 'chelsea', borough: 'manhattan', name: 'Chelsea', lat: 40.7465, lng: -74.0014, aliases: ['chelsea', 'meatpacking', 'high line', 'hudson yards', 'little island'] },
  { id: 'flatiron', borough: 'manhattan', name: 'Flatiron', lat: 40.7411, lng: -73.9897, aliases: ['flatiron', 'union square', 'nomad', 'gramercy', 'madison square park'] },
  { id: 'midtown', borough: 'manhattan', name: 'Midtown', lat: 40.7549, lng: -73.984, aliases: ['midtown', 'times square', 'bryant park', 'rockefeller center', 'broadway'] },
  { id: 'hells-kitchen', borough: 'manhattan', name: 'Hell’s Kitchen', lat: 40.7638, lng: -73.9918, aliases: ['hell’s kitchen', "hell's kitchen", 'hells kitchen'] },
  { id: 'central-park', borough: 'manhattan', name: 'Central Park', lat: 40.7829, lng: -73.9654, aliases: ['central park', 'sheep meadow', 'the ramble'] },
  { id: 'uws', borough: 'manhattan', name: 'Upper West Side', lat: 40.787, lng: -73.9754, aliases: ['upper west side', 'UWS', 'riverside park', 'lincoln center'] },
  { id: 'ues', borough: 'manhattan', name: 'Upper East Side', lat: 40.7736, lng: -73.9566, aliases: ['upper east side', 'UES', 'museum mile', 'the met'] },
  { id: 'harlem', borough: 'manhattan', name: 'Harlem', lat: 40.8116, lng: -73.9465, aliases: ['harlem', 'east harlem', 'el barrio', 'spanish harlem', 'the apollo'] },
  { id: 'washington-heights', borough: 'manhattan', name: 'Washington Heights', lat: 40.8417, lng: -73.9394, aliases: ['washington heights', 'inwood', 'fort tryon', 'the cloisters'] },

  // Queens
  { id: 'astoria', borough: 'queens', name: 'Astoria', lat: 40.7644, lng: -73.9235, aliases: ['astoria', 'ditmars'] },
  { id: 'lic', borough: 'queens', name: 'Long Island City', lat: 40.7447, lng: -73.9485, aliases: ['long island city', 'LIC', 'gantry plaza'] },
  { id: 'sunnyside', borough: 'queens', name: 'Sunnyside', lat: 40.7433, lng: -73.9196, aliases: ['sunnyside', 'woodside'] },
  { id: 'jackson-heights', borough: 'queens', name: 'Jackson Heights', lat: 40.7557, lng: -73.8831, aliases: ['jackson heights', 'elmhurst'] },
  { id: 'flushing', borough: 'queens', name: 'Flushing', lat: 40.7675, lng: -73.8331, aliases: ['flushing', 'flushing meadows'] },
  { id: 'ridgewood', borough: 'queens', name: 'Ridgewood', lat: 40.7043, lng: -73.9018, aliases: ['ridgewood'] },
  { id: 'rockaway', borough: 'queens', name: 'Rockaway', lat: 40.586, lng: -73.811, aliases: ['rockaway', 'rockaways', 'rockaway beach', 'jacob riis', 'riis beach'] },

  // The Bronx
  { id: 'mott-haven', borough: 'bronx', name: 'Mott Haven', lat: 40.8091, lng: -73.9229, aliases: ['mott haven', 'south bronx'] },
  { id: 'belmont', borough: 'bronx', name: 'Arthur Avenue', lat: 40.8554, lng: -73.8885, aliases: ['arthur avenue', 'arthur ave', 'bronx zoo', 'nybg'] },
  { id: 'riverdale', borough: 'bronx', name: 'Riverdale', lat: 40.9006, lng: -73.9066, aliases: ['riverdale', 'van cortlandt'] },

  // Staten Island
  { id: 'st-george', borough: 'staten-island', name: 'St. George', lat: 40.6437, lng: -74.0764, aliases: ['st. george', 'st george', 'staten island ferry', 'snug harbor'] },
];

export const BOROUGH_BY_ID = Object.fromEntries(BOROUGHS.map((b) => [b.id, b]));
export const HOOD_BY_ID = Object.fromEntries(HOODS.map((h) => [h.id, h]));
