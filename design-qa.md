# Portfolio layout correction QA

Source visual truth:

- `/var/folders/_t/_97h72zs5_7br2flxl13gfp40000gn/T/TemporaryItems/NSIRD_screencaptureui_BeGvjZ/Снимок экрана 2026-10-01 в 02.30.43.png` — sidebar overlap bug, 630 × 604 px.
- `/var/folders/_t/_97h72zs5_7br2flxl13gfp40000gn/T/TemporaryItems/NSIRD_screencaptureui_rVttVa/Снимок экрана 2026-10-01 в 02.33.50.png` — project grid and order, 1148 × 720 px.
- `/var/folders/_t/_97h72zs5_7br2flxl13gfp40000gn/T/TemporaryItems/NSIRD_screencaptureui_rGUuYR/Снимок экрана 2026-10-01 в 02.36.13.png` — moodboard composition, 1758 × 1158 px.

Implementation routes: `http://localhost:3000/`, `http://localhost:3000/about`, and `http://localhost:3000/projects/penta-q`.

Implementation screenshot evidence: Codex in-app Browser desktop captures at a 1148 × 720 CSS viewport, 1× density. The browser API returned the captures inline and does not expose a filesystem save path.

State: English, desktop. Home was checked after scrolling to the project grid, About at the moodboard, and PENTA-Q with both videos loaded.

## Findings

No actionable P0, P1, or P2 issues remain.

## Comparison evidence

- Sidebar: the complete header column is sticky while its internal navigation is static. A scrolled home-page capture shows navigation, portfolio label, language switch, and sound toggle moving as one group with no overlap.
- Project grid: the desktop capture matches the supplied three-column, two-row arrangement. Order is YOUNG KINK → YARKO → PENTA-Q → Biological Museum → @KORESHKI → WeAre.
- Moodboard: item sizes now scale with the board. The desktop capture matches the supplied composition: large dog at upper left, circular video at top center, cats at upper right, overlapping kitchen and photo-strip elements through the middle, and the remaining circular/photo/cutout elements along the lower edge.
- PENTA-Q video quality: browser media inspection reports 960 × 540 and 960 × 640 source dimensions with `readyState: 4`; both files replaced the earlier 480 px versions.

## Required fidelity surfaces

- Fonts and typography: unchanged from the existing portfolio system; no new wrapping or hierarchy drift.
- Spacing and layout rhythm: project grid and sidebar align with the desktop reference. Moodboard fills its bordered canvas proportionally.
- Colors and visual tokens: existing neutral palette and borders preserved.
- Image quality and asset fidelity: supplied assets are used directly. Higher-resolution PENTA-Q encodes are restored.
- Copy and content: project metadata and moodboard content are unchanged; only order and placement changed.

## Comparison history

- P1: separate sticky positioning caused the navigation to overlap the portfolio label and controls. Fixed by making the full header sticky and the inner navigation static; verified in the scrolled home capture.
- P2: fixed-pixel moodboard items were too small and shifted. Fixed with proportional widths, a responsive canvas ratio, and positions measured from the reference; verified in the About capture.
- P1: PENTA-Q videos were visibly overcompressed at 480 px. Replaced with 960 px versions and verified via browser media dimensions.

## Runtime checks

- Production build completed successfully.
- Home, About, and PENTA-Q render locally.
- Browser console error log is empty.
- Desktop viewport override was reset after QA.

## Follow-up polish

None required for this request.

## Copy, assets, and project-transition follow-up

- Removed the first-year mentoring paragraph from the home page in both languages.
- Confirmed both Email links use `mailto:ruslanmelkumian80@yandex.ru`.
- Confirmed all six project media lists point to existing files.
- Confirmed no PNG, JPG, JPEG, or GIF files remain under `public/`; public raster artwork is WebP.
- Confirmed the home page loads all raster images without broken sources.
- Replaced the intermediate image overlay with a native cross-document View Transition. The card and first gallery figure share a unique transition name, so the browser interpolates their actual positions and sizes.
- Verified the opening animation visually on the production PENTA-Q page and the return navigation to `/#projects`.
- Confirmed `prefers-reduced-motion` keeps immediate navigation.
- Re-ran `npm run build` successfully after these changes.

## Vercel production verification — 2026-10-01

- Published to https://ruslan-melkumyan.vercel.app using Vercel Build Output API.
- `npm run build:vercel` passed and generated Home, About, all six project pages, and a 404 page.
- All eight public page URLs returned HTTP 200 without Vercel authentication.
- `/archive` and `/api/archive` returned HTTP 404.
- The live browser hydrated successfully: RU/EN switching works and the selected language persists across project navigation.
- No browser console errors on the inspected Home and PENTA-Q pages; no broken loaded images.
- PENTA-Q videos retain 960 × 540 and 960 × 640 dimensions on the live deployment.
- Unsupported View Transition browsers use ordinary links. Reduced-motion users do not receive the animation.

## Latest revision: transitions removed at user request

- Removed the cross-document View Transition opt-in, transition keyframes, and shared image names from cards and gallery figures.
- Project navigation now uses ordinary links without the opening or closing animation. Earlier animation checks above describe the previous version.
- `npm run build:vercel` passed with all six project pages generated.

final result: passed
