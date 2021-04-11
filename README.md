# Digital Garden

[![HTMLProofer](https://github.com/hyphacoop/digitalgarden/actions/workflows/main.yml/badge.svg)](https://github.com/hyphacoop/digitalgarden/actions/workflows/main.yml)
[![GitHub Pages Deploy](https://github.com/hyphacoop/digitalgarden/actions/workflows/deploy.yml/badge.svg)](https://github.com/hyphacoop/digitalgarden/actions/workflows/deploy.yml)

A public notebook / digital garden for The Bentway’s [Digital and/as Public Space Micro-Residency](https://www.thebentway.ca/stories/the-bentway-announces-eight-micro-residencies-as-part-of-the-digital-and-as-public-space-initiative/).

[Visit the garden](https://digitalgarden.hypha.coop)

## Adding and connecting notes
- [Notes](./_notes) in the Digital Garden are stored in the `./_notes` folder as markdown files (`*.md`) files.
- Connecting notes is done through a double-bracket notation: `[[text to link]]`. View the [The Statement of Intent](./_notes/statement-of-intent.md) note as an example.
- A link without a corresponding markdown file will be highlighted and left unlinked until a file is created.

## Technologies used
- [Jekyll](https://jekyllrb.com/), a static website generator written in Ruby
    + Initial template is based on the [Digital garden Jekyll template](https://github.com/maximevaillancourt/digital-garden-jekyll-template) by Maxime Vaillancourt
- [Tachyons](https://tachyons.io/), a functional CSS library that allows us to quickly grow the garden
- [D3.js](https://d3js.org/), a JavaScript library for visualizing data
    + Initial knowledge graph implementation from the [Digital garden Jekyll template](https://github.com/maximevaillancourt/digital-garden-jekyll-template)
- [GitHub Actions](https://github.com/hyphacoop/digitalgarden/actions) for testing, building, and deploying the site.
    + [GitHub Actions for GitHub Pages](https://github.com/peaceiris/actions-gh-pages) is used to deploy the site to the [`gh-pages`](https://github.com/hyphacoop/digitalgarden/tree/gh-pages) branch
- [Jekyll Feed plugin](https://github.com/hyphacoop/jekyll-feed), a plugin for Jekyll to generate an RSS feed

## Development
1. Clone repository: `git clone git@github.com:hyphacoop/digitalgarden.git`
2. Install Bundler gem: `gem install bundler`
3. Install dependencies: `bundle install`
4. Run locally: `bundle exec jekyll serve` or `rake watch`
5. Visit your `localhost` on port `4000`: http://localhost:4000 or http://127.0.0.1:4000

## License
<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Digital Garden</span> content is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.

All code at <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/hyphacoop/digitalgarden/" property="cc:attributionName" rel="cc:attributionURL">github.com/hyphacoop/digitalgarden/</a> is licensed under a <a rel="license" href="https://www.gnu.org/licenses/gpl.html">GNU General Public License v3.0</a>, the text of which is included in the repository [here](https://github.com/hyphacoop/digitalgarden/blob/main/LICENSE).
