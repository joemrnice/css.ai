# css.ai

A practical, deep-dive, open-source CSS reference. No build tools, no framework — plain HTML, CSS, and vanilla JavaScript, deployable straight to GitHub Pages.

**Live structure:**

```
css.ai/
├── index.html                     — homepage, learning path, live specificity calculator
├── assets/
│   ├── css/style.css               — the whole design system (one file, well-commented)
│   └── js/main.js                  — nav toggle, copy buttons, TOC scroll-spy, accordion, calculator
├── pages/                          — 14 deep-dive guides
│   ├── fundamentals.html
│   ├── selectors-specificity.html
│   ├── box-model.html
│   ├── flexbox.html
│   ├── grid.html
│   ├── positioning-stacking.html
│   ├── responsive-design.html
│   ├── typography-color.html
│   ├── custom-properties.html
│   ├── animations-transitions.html
│   ├── modern-css.html
│   ├── architecture-methodologies.html
│   ├── preprocessors.html
│   └── frameworks.html
├── interview/index.html            — 60+ interview Q&As, filterable by level/topic
├── projects/                       — 3 self-contained, build-along projects
│   ├── project-01-pricing-cards/
│   ├── project-02-dashboard-layout/
│   └── project-03-css-carousel/
└── reference/cheatsheet.html       — one dense, skimmable reference page
```

## Running locally

No build step. Either open `index.html` directly in a browser, or serve the folder so relative paths and any future `fetch()` calls behave normally:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploying to GitHub Pages

1. Push this folder's contents to the root of the `css.ai` repo (or a `docs/` folder, or a dedicated branch — whichever Pages source you configure).
2. In the repo settings, enable GitHub Pages pointing at that source.
3. No build command, no output directory — it serves as-is.

## Design system

Every color in `assets/css/style.css` maps to an actual CSS syntax-highlighting role (`--selector`, `--property`, `--value`, `--string`, `--comment`, `--at-rule`) — the site's visual language *is* CSS syntax. See the top of that file for the full token list.

## Roadmap / how to extend this repo

This ships with 14 core guides, 60+ interview questions, and 3 projects — enough for a genuinely useful v1, not an exhaustive encyclopedia of the spec. Natural next additions, following the existing page template in `pages/`:

- **More guides:** CSS pseudo-classes deep dive, forms & form styling, print stylesheets, CSS counters, `@font-face` deep dive, logical properties (`margin-inline`, `inset-block`), writing modes / internationalization, CSS houdini / paint worklets, view transitions API.
- **More projects:** a CSS-only accordion/FAQ, a modal built with the `<dialog>` element and `::backdrop`, a masonry layout with grid, a theming demo using `@property` + custom properties.
- **More interview questions:** add to the `questions` list pattern used to generate `interview/index.html` — each guide page also has a dedicated "Interview angle" callout that can be expanded into full Q&As here.
- **Search:** the site currently relies on the sidebar + Ctrl/Cmd+F; a lightweight client-side search (e.g. indexing headings client-side) would help as more guides are added.

## Contributing

Since this is your own open-source repo: keep new guide pages consistent with the existing template (`page-hero`, `.layout` two-column shell with `.side-toc`, `article.content` sections ending in an `.callout.interview` block) so navigation and styling stay uniform without a build step.

## Credits

Content is written and explained independently, with pointers to [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS) throughout for full specification text — MDN remains the canonical source for exact spec behavior and browser support tables.
