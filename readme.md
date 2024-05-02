See [this twitter thread](https://twitter.com/_phzn/status/1785694875901436017) and protect yourself from shady practices employed be Restack.

Download proof of each AI generated page. Also be sure to manually take screenshots of their new modal.

Usage:

1. Clone repo
2. Rename `.env.example` to `.env` and provide a [Urlbox](https://urlbox.com) API key. Due to the volume of AI-generated garbage Restack publish, you will need a paid account.
3. Also add the number of index pages in `.env` and the `BASE_URL` for your project.
4. `npm install`
5. `node download-knowlegebase.js`
6. Wait and see images added to the `images` directory.
