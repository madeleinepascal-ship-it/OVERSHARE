// Social activities we look for in a year of posts, and the cause each one maps to.
//
// `keywords` match whole words or phrases in captions. `tags` match the start
// or end of a hashtag (so #nycfoodie and #brunchtime both count). Tags of three
// letters or fewer must be the whole hashtag, so #party isn't art and
// #staycation isn't a cat.

export const CATEGORIES = [
  {
    id: 'food',
    label: 'Eating out',
    emoji: '🍜',
    noun: 'meals out',
    cause: 'Hunger relief & food rescue',
    pitch: 'You ate your way through the year. Help put food on someone else’s table.',
    keywords: [
      'brunch', 'dinner', 'lunch', 'restaurant', 'pizza', 'ramen', 'tacos', 'taco', 'sushi',
      'omakase', 'pasta', 'burger', 'dumplings', 'bagel', 'croissant', 'tasting menu', 'chef',
      'bistro', 'trattoria', 'noodles', 'brasserie', 'dim sum', 'bbq', 'oysters', 'eats',
      'supper', 'pho', 'curry', 'bakery', 'deli', 'food', 'slice', 'dollar slice', 'bodega',
      'egg and cheese', 'chopped cheese', 'lox', 'halal cart', 'smorgasburg',
    ],
    tags: ['food', 'eats', 'brunch', 'foodie', 'dinner', 'pizza', 'ramen', 'sushi', 'tacos', 'yum', 'nomnom'],
  },
  {
    id: 'drinks',
    label: 'Bars & nights out',
    emoji: '🍸',
    noun: 'rounds',
    cause: 'Hospitality workers',
    pitch: 'Every great night out had someone behind the bar. Look after them.',
    keywords: [
      'cocktail', 'cocktails', 'bar', 'martini', 'negroni', 'wine', 'natty wine', 'beer', 'brewery',
      'pint', 'pints', 'happy hour', 'spritz', 'mezcal', 'tequila', 'margarita', 'pub', 'drinks',
      'nightcap', 'speakeasy', 'aperol', 'cheers', 'rooftop bar', 'dive bar',
    ],
    tags: ['cocktail', 'drinks', 'wine', 'beer', 'barlife', 'happyhour', 'spritz', 'negroni', 'martini', 'pub'],
  },
  {
    id: 'music',
    label: 'Live music',
    emoji: '🎸',
    noun: 'gigs',
    cause: 'Musicians & independent venues',
    pitch: 'You were in the room. Keep the rooms open and the artists playing.',
    keywords: [
      'concert', 'gig', 'gigs', 'live music', 'festival', 'dj', 'dj set', 'on tour', 'band', 'rave',
      'setlist', 'encore', 'vinyl', 'record store', 'jazz', 'opera', 'orchestra', 'soundcheck',
      'mosh', 'headliner', 'front row', 'summerstage', 'bowery ballroom', 'brooklyn steel',
      'terminal 5', 'baby’s all right', 'the apollo', 'blue note', 'village vanguard',
    ],
    tags: ['livemusic', 'concert', 'gig', 'festival', 'jazz', 'vinyl', 'techno', 'rave', 'music'],
  },
  {
    id: 'coffee',
    label: 'Coffee runs',
    emoji: '☕',
    noun: 'coffees',
    cause: 'Coffee-growing communities',
    pitch: 'That flat white came from somewhere. Give back to the people who grow it.',
    keywords: [
      'coffee', 'latte', 'espresso', 'cafe', 'café', 'matcha', 'flat white', 'cortado',
      'cappuccino', 'cold brew', 'pour over', 'roastery',
    ],
    tags: ['coffee', 'latte', 'espresso', 'matcha', 'cafe', 'flatwhite', 'butfirstcoffee'],
  },
  {
    id: 'art',
    label: 'Galleries & museums',
    emoji: '🖼️',
    noun: 'exhibitions',
    cause: 'Arts access & artists',
    pitch: 'You soaked up a lot of culture. Help make more of it — for everyone.',
    keywords: [
      'museum', 'gallery', 'exhibit', 'exhibition', 'art', 'moma', 'tate', 'the met', 'mural',
      'installation', 'sculpture', 'biennale', 'retrospective', 'lacma', 'sfmoma', 'the broad',
      'painting', 'theatre', 'theater', 'broadway', 'off-broadway', 'whitney', 'guggenheim',
      'ps1', 'frick', 'shakespeare in the park',
    ],
    tags: ['art', 'museum', 'gallery', 'exhibition', 'streetart', 'artlover', 'theatre', 'theater'],
  },
  {
    id: 'outdoors',
    label: 'Parks & outdoors',
    emoji: '🌳',
    noun: 'days outside',
    cause: 'Parks & green space',
    pitch: 'All those golden-hour park shots. Keep the green spaces green.',
    keywords: [
      'park', 'hike', 'hiking', 'trail', 'beach', 'picnic', 'garden', 'sunset', 'sunrise', 'lake',
      'botanical', 'nature', 'waterfront', 'high line', 'rooftop garden', 'ferry',
      'little island', 'the ramble', 'sheep meadow', 'governors island',
    ],
    tags: ['park', 'hike', 'nature', 'outdoors', 'sunset', 'beach', 'picnic', 'goldenhour'],
  },
  {
    id: 'movement',
    label: 'Run clubs & workouts',
    emoji: '🏃',
    noun: 'workouts',
    cause: 'Sport for young people',
    pitch: 'You put in the miles. Help a kid get their first pair of sneakers.',
    keywords: [
      'run club', 'running', 'marathon', 'half marathon', '10k', '5k', 'gym', 'pilates',
      'yoga', 'cycling', 'spin class', 'climbing', 'bouldering', 'workout', 'swim', 'tennis',
      'pickleball', 'citi bike', 'nyc marathon', 'bike ride',
    ],
    tags: ['runclub', 'running', 'marathon', 'fitness', 'yoga', 'pilates', 'gym', 'strava', 'workout'],
  },
  {
    id: 'style',
    label: 'Fits & vintage hauls',
    emoji: '🧥',
    noun: 'fits',
    cause: 'Clothing, reuse & getting back to work',
    pitch: 'The fits were immaculate. Pass the confidence on.',
    keywords: [
      'ootd', 'outfit', 'fit check', 'vintage', 'thrift', 'thrifted', 'thrifting', 'haul',
      'secondhand', 'fashion week', 'fits', 'styled', 'wardrobe',
    ],
    tags: ['ootd', 'fitcheck', 'vintage', 'thrift', 'fashion', 'style', 'outfit', 'secondhand'],
  },
  {
    id: 'books',
    label: 'Books & bookstores',
    emoji: '📚',
    noun: 'reads',
    cause: 'Literacy & young writers',
    pitch: 'Your stack was stacked. Put books in hands that need them.',
    keywords: [
      'book', 'books', 'bookstore', 'bookshop', 'reading', 'library', 'book club', 'novel',
      'currently reading', 'author', 'poetry', 'zine', 'the strand', 'mcnally jackson',
    ],
    tags: ['bookstagram', 'books', 'reading', 'bookclub', 'booklover', 'bookshop', 'library'],
  },
  {
    id: 'pets',
    label: 'Dogs (and cats) of your year',
    emoji: '🐕',
    noun: 'pet cameos',
    cause: 'Animal rescue',
    pitch: 'Your pet was the real main character. Help another one find a home.',
    keywords: [
      'dog', 'dogs', 'puppy', 'pup', 'cat', 'kitten', 'dog park', 'good boy', 'good girl', 'rescue dog',
      'rescue cat', 'adopted', 'doggo', 'pupper', 'dog run',
    ],
    tags: ['dog', 'puppy', 'cat', 'catsofinstagram', 'dogsofinstagram', 'adoptdontshop', 'rescue'],
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
