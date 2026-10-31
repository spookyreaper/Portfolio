# Brandon's portfolio

A responsive, buildless portfolio with a project gallery, category filters, project detail dialogs, an about section, and GitHub/contact links. Built with HTML, CSS, and vanilla JavaScript.

The site uses a charcoal theme with warm orange accents. `dist/theme.css` contains its palette and component colors; `dist/styles.css` contains the layout and responsive rules.

## Preview

Run `npm run dev` from this directory and open http://127.0.0.1:3000. Python 3 is the only server prerequisite. No dependency installation or build step is needed.

## Featured work

Content was verified against the public repositories on October 31, 2026:

- [LostPaw Network frontend](https://github.com/spookyreaper/LostPawNetwork-frontend): React app for lost/found pet reports and maps. Its repository supplies the homepage screenshot and Netlify deployment link.
- [Pet Paradise Keepers](https://github.com/spookyreaper/Pet-Paradise-Keepers): Express/EJS/MongoDB pet care marketplace. Its repository supplies the homepage screenshot. No public live URL was documented.
- [Connection Game](https://github.com/spookyreaper/Connections-Game-): HTML/CSS/JavaScript word puzzle, with a repository screenshot and GitHub Pages link.
- [LostPaw API](https://github.com/spookyreaper/LostPawNetwork-backend): Sails/Waterline/MongoDB backend, represented by a clearly labeled API illustration.

Years use the repositories' 2024 creation dates; descriptions note their 2026 updates. Public GitHub is linked in the contact section; no email address or LinkedIn profile was supplied.

## Make it yours

- Edit `dist/data.js` to update your profile and projects for **all visitors**. Add your real email and LinkedIn URL to enable those links. Project live/source buttons appear when you supply their URLs.
- Use **Customize** in the footer to preview profile edits and add, edit, or delete projects. These edits are stored **only in that browser** using localStorage; they do not alter published source.
- Use **Export backup** to download your changes. To publish them, replace the object assigned to `window.PORTFOLIO_DATA` in `dist/data.js` with the exported JSON object, then redeploy. **Import backup** restores a browser preview.
- Put cover images in `dist/assets`, or supply an HTTPS image URL. Local SVG, PNG, JPG, WebP, AVIF, and GIF files directly in `assets/` are supported. A project without an image gets a styled fallback.

Each project has `id`, `title`, `subtitle`, `category` (`Web apps`, `Games`, or `APIs`), `year` (a string), `image`, `color`, `tags` (an array), `description`, `live`, `source`, and `demo`. Use `demo: false` for real projects. IDs must be unique. Start with one existing object as a reference.

## Checks and hosting

`npm run check` checks JavaScript syntax. The deployable site is the complete `dist/` directory. Fonts are loaded from Google Fonts with system-font fallbacks; all project screenshots and the API illustration are bundled locally.
