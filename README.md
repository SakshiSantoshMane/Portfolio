# Sakshi Mane · Portfolio

Live site: https://sakshisantoshmane.github.io/Portfolio/

React + Vite + Framer Motion. All content lives in `src/data.js`.

## Work on it locally
- `npm install`, then `npm run dev`
- `npm run build` creates the finished site in `dist/`

## Publishing
Every push to `main` builds the site and publishes it automatically
(see `.github/workflows/deploy.yml`). GitHub Pages serves the `gh-pages` branch.

## Settings in `src/data.js`
- **Message box:** set `formKey` to the Web3Forms access key from web3forms.com.
  Until then, the Send button opens the visitor's email app instead.
- **Resume button:** put the PDF in `public/resume.pdf` and set `RESUME_URL = 'resume.pdf'`.
- **Capgemini logo:** put the official logo in `public/` and set `logo` in the experience entry.
