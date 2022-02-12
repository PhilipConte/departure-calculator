# departure-calculator
Simple, fully client-side, PWA to query the WMATA API and calculate when you should leave to catch the train without waiting.

Think of it like checking [next arrivals](https://www.wmata.com/schedules/next-arrival/), with some extra smarts from some client-side requests.

## Disclaimer
This is in no way affiliated, sponsored, or endorsed by WMATA.

[WMATA API License](https://developer.wmata.com/license)

## Development
```
nix develop nixpkgs#nodejs
npm i
npm start
# to deploy to GH pages: npm run deploy
# to test a production build: npm run serve
```
