# BetterEngineer — static site

This repository is **plain static assets**: HTML with **embedded CSS**, **vanilla JavaScript** (`home.js`, `react-page.js`), and local `icons/` / `images/`. There is **no** React app, Vite, TypeScript, or SPA bundler for these pages.

The **React staffing** URL is a marketing page (`react.html`); it is still static HTML/JS. It loads **HubSpot’s** embed script only for the intake form.

## Editing workflow

- **Source CSS**: `styles/brand.css`, `styles/react-landing.css`
- **Page fragments**: `main-home.html`, `main-react.html`, `footer-full.html`
- Regenerate root HTML with embedded styles:

  ```bash
  npm run build
  ```

  or `node build-pages.js`

## GitHub Pages

Deploy from the **`main` branch root**. This repo writes:

- `index.html` -> `/`
- `technologies/react/index.html` -> `/technologies/react`

It also writes:

- `CNAME` with `lp.betterengineer.com`
- `.nojekyll`

Use root-relative assets (`/icons/...`, `/images/...`) so nested routes work on GitHub Pages.

## Local preview

Any static file server from this folder works, for example:

```bash
npm start
```

Then open [http://localhost:5173/](http://localhost:5173/) (or use `npx serve .` and the port it prints).
