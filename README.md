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

Deploy the **repository root** (same layout as here): `index.html`, `react.html`, `*.js`, `styles/` if you keep it for rebuilds, `icons/`, `images/`.

## Local preview

Any static file server from this folder works, for example:

```bash
npm start
```

Then open [http://localhost:5173/](http://localhost:5173/) (or use `npx serve .` and the port it prints).
