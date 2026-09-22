# Overshare NYC

**You shared all year, now overshare.**

Overshare turns a year of Instagram posts into donations to the New York causes behind them, on the blocks where you actually spent it. Lots of dumplings in Chinatown? Here are the food charities working right there. Every Prospect Park picnic? Look after Brooklyn's backyard.

## How it works

1. **Share your insta.** Drop your Instagram export (`.zip` or `.json`) for your real year, or type a handle to see a preview built from a sample New York year.
2. **We scrub your grid.** Captions, hashtags and photo GPS are matched against 10 activities (eating out, bars, live music, coffee, galleries & theater, parks, workouts, fits, books, pets). They're also matched against 43 neighborhoods in all five boroughs, including local landmarks (Smorgasburg, the High Line, Arthur Ave, Riis Beach…).
3. **We match your hoods.** Each activity maps to a cause, and each cause to real NYC organizations. They're ranked **your neighborhood → your borough → citywide → national/global**, and each one says why it was picked ("14 of your meals out were in Williamsburg").
4. **You overshare.** Pick causes, choose a budget (including *a buck a post*), and split it evenly or weighted by how much you did each thing. Each donation link opens the charity's own page, and you get a share card for your story.

## Privacy

Everything runs in the browser. The export is unzipped locally, and only the files describing your own content are opened (posts, stories, reels). Messages, followers and everything else are skipped. Nothing is uploaded, and Overshare never handles money.

Instagram doesn't let third parties read someone's posts from just a handle, so the handle path is a clearly labelled **preview**. Real data comes from the export (Settings → Accounts Center → Your information and permissions → Download your information → JSON).

## Run it

No build step and no dependencies. Needs Node 18+.

```sh
npm start   # http://localhost:4173
npm test    # engine tests (node --test)
```

It's a static site, so any static host works.

## Layout

```
index.html, styles.css, src/app.js   UI
src/data/categories.js               activities → keywords, hashtags, cause, copy
src/data/places.js                   NYC boroughs & neighborhoods (aliases + coordinates)
src/data/charities.js                NYC charities by activity & scope (hood/borough/city/country/global)
src/engine/parse.js                  Instagram export → posts
src/engine/zip.js                    tiny in-browser zip reader
src/engine/classify.js               posts → what you did, where
src/engine/match.js                  → ranked charities, budget split
src/engine/demo.js                   seeded sample year for handle previews
```

## Adding a neighborhood or charity

- **Neighborhood:** add it to `HOODS` in `places.js` with its borough, aliases (nicknames and landmarks count) and approximate center coordinates. ALL-CAPS aliases (`LES`, `UWS`) only match in caps.
- **Charity:** add it to `charities.js`, linking the organization's official site. Use `scope: 'hood'` with `hoods: [...]` for groups rooted in specific neighborhoods, or `scope: 'borough'` with `boroughs: [...]`. `npm test` checks every entry points at a real category, neighborhood and borough, and that every activity (except coffee, which is grown elsewhere) has a New York option.

Only list organizations you've verified. Charity details change, so the app tells people to check before giving.
