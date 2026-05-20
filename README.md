# Abdullah Mohamed — Portfolio

Inspired by [victorfuruya.com](https://victorfuruya.com).  
Built with Next.js 14 · TypeScript · GSAP · Lenis.

---

## Quick Start

```bash
# 1. Install
npm install

# 2. Dev server
npm run dev

# 3. Open
http://localhost:3000
```

---

## Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| GSAP + ScrollTrigger | All animations |
| Lenis | Smooth scroll |
| Playfair Display | Display serif font |
| DM Sans | Body / nav font |

---

## Project Structure

```
app/
  layout.tsx       ← root layout (add SmoothScroll here)
  page.tsx         ← assembles all sections
  globals.css      ← all styles (design tokens, components)

components/
  Cursor.tsx       ← custom cursor
  MenuOverlay.tsx  ← full-screen menu
  Nav.tsx          ← fixed nav
  Hero.tsx         ← counter + title reveal
  Manifesto.tsx    ← philosophy + image grid
  Work.tsx         ← GSAP horizontal slider (4 projects)
  About.tsx        ← about teaser
  Footer.tsx       ← big number + bio
  SmoothScroll.tsx ← Lenis integration

public/
  images/          ← put your photos here
```

---

## Adding Smooth Scroll (Lenis)

In `app/layout.tsx`, add the `SmoothScroll` component:

```tsx
import SmoothScroll from '@/components/SmoothScroll'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />   {/* ← add this */}
        {children}
      </body>
    </html>
  )
}
```

> Note: SmoothScroll is a client component but renders null — safe inside a server layout.

---

## Adding Your Images

Replace the placeholder divs with real images. In each component you'll see commented-out `<Image>` tags:

```tsx
// Hero.tsx — hero portrait
<Image src="/images/hero.jpg" alt="Abdullah Mohamed" fill style={{objectFit:'cover'}} priority />

// Manifesto.tsx — 3 atmosphere shots
<Image src="/images/manifesto-1.jpg" alt="" fill style={{objectFit:'cover'}} />

// Work.tsx — project screenshots
// Add `bg: '/images/work-1.jpg'` to each project in the projects array

// About.tsx — about photo
<Image src="/images/about.jpg" alt="Abdullah Mohamed" fill style={{objectFit:'cover'}} />
```

**Recommended image sizes:**
- `hero.jpg` — 800×1100px (portrait, 3:4)
- `manifesto-1/2/3.jpg` — 600×800px each
- `work-1/2/3/4.jpg` — 1920×1080px (landscape)
- `about.jpg` — 800×1000px

---

## Customising Content

**Work projects** — edit the `projects` array in `components/Work.tsx`:

```ts
const projects = [
  {
    num: '01',
    title: ['Project', 'Name'],
    stack: 'Tech Stack',
    type: 'Category · Year',
    bg: '/images/work-1.jpg',
  },
  // ...
]
```

**Manifesto text** — edit `components/Manifesto.tsx`.

**Footer bio** — edit `components/Footer.tsx`.

**Contact links** — update `href` in `Nav.tsx`, `MenuOverlay.tsx`, `About.tsx`, `Footer.tsx`.

---

## Deploy to Vercel

```bash
# Push to GitHub, then:
vercel --prod

# Or connect your GitHub repo at vercel.com
```

---

## Design Tokens

All visual tokens live in `app/globals.css`:

```css
:root {
  --bg:    #0d0d0d;   /* near-black background */
  --fg:    #f2ede4;   /* warm white text */
  --muted: rgba(242,237,228,0.38);
  --line:  rgba(242,237,228,0.10);
  --serif: 'Playfair Display', Georgia, serif;
  --sans:  'DM Sans', system-ui, sans-serif;
}
```

---

## Claude Code Tips

Use Claude Code to:
- **Add images**: "Add my hero image at public/images/hero.jpg and wire it up in Hero.tsx"
- **Add a project**: "Add a 5th project called X to the Work slider"
- **Tweak animation**: "Make the hero counter slower and start from 1 instead of 0"
- **Add a page**: "Create a /work page that lists all projects with more detail"
- **Change font**: "Switch the display font from Playfair Display to EB Garamond"
