Personal blog and portfolio site.

## Site Architecture

Built with Astro, different sections have collections which are described below.  This template is not generic or intended for reuse but you are welcome to poke around.

### Content Collections

The `posts` collection is the unified source for blog, TIL, devlog, and bookmark entries — distinguished by the `type` frontmatter field. Legacy `til` and `devlog` collections still load for backwards compatibility.

- **`/posts`** - Unified content (blog / til / devlog / bookmark via `type` field)
- **`/til`** - Legacy TIL entries
- **`/devlog`** - Legacy devlog entries
- **`/links`** - Curated external links

### Pages
- **Homepage** - Recent writing + devlog / TIL / bookmarks columns
- **Posts** - Blog posts organized by year (no pagination)
- **TIL** - Grid of learning entries
- **Devlog** - Development log entries
- **Bookmark** - Saved external links with commentary
- **About** - Personal bio and background
- **Talks** - Conference presentations and videos

### Key Components
- **`ArticleCard.astro`** - Universal newspaper-style article component
- **`Author.astro`** - Author bio component
- **`Header.astro`** - Main navigation with logo and theme toggle

### Design Philosophy
- **Newspaper layout** - Washington Post style with title + excerpt + metadata
- **No rounded corners** - Clean, flat design throughout
- **Consistent links** - Global link styles with hover states
- **Year-based organization** - Posts grouped by year instead of pagination
- **Hero post system** - Configurable hero article via `SITE.heroPost`

### Navigation
- Removed Archives (redundant with Posts)
- Added Talks page for presentations
- Streamlined header with tighter spacing

### Technical Improvements
- DRY component architecture (eliminated WET card proliferation)
- TypeScript content collections with proper typing
- Image extraction from markdown content
- Excerpt generation with frontmatter precedence
- Theme system with dark/light modes
- SEO optimization and accessibility

## Development

Uses pnpm.

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm run dev

# Build for production (runs astro check, then builds and indexes search)
pnpm run build
```

## Testing

Unit tests (as little as possible) use [vitest](https://vitest.dev) and live next to the code they cover as `src/**/*.test.ts`. The config in `vitest.config.ts` resolves the `@/` alias to `src/` and nothing else, so tests can only import modules that do not depend on Astro runtime imports like `astro:content`.

```bash
# run the suite once
pnpm test

# watch mode
pnpm exec vitest
```

vitest is pinned to 3.x because Astro 5 ships vite 6, and newer vitest releases require vite 7.

## Content Creation

### Posts (Main Blog)

Long-form technical articles in `src/content/posts/`, organized by year on disk. The year folder is for organization only and never appears in the URL: `src/content/posts/2024/descriptive-title.md` is published at `/posts/descriptive-title/`.  The URL slug comes from the filename.

1. **Create file**: `src/content/posts/YYYY/descriptive-title.md`. Use hyphens, not underscores. The date comes from frontmatter, not the filename. `src/content/posts/yyy-template.md` is a draft starting point.
2. **Frontmatter**:
```yaml
---
title: "Article Title"
description: "Brief description for SEO"
date: 2024-01-01T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["tech", "programming"]
---
```
3. **Content**: Full articles with sections, code examples, detailed explanations

### TIL (Today I Learned)
Quick learning entries in `src/content/til/`:

1. **Copy template**: Duplicate `src/content/til/zzz-template.md`
2. **Rename**: Use format `YYYY-MM-DD-topic-name.md`
3. **Update frontmatter**: Change title, description, date, tags
4. **Set draft**: Change `draft: true` to `draft: false` when ready
5. **Content structure**: What/Context/Solution/Resources format

### DevLog (Development Log)
Project progress entries in `src/content/devlog/`:

1. **Copy template**: Duplicate `src/content/devlog/zzz-template.md`
2. **Rename**: Use format `YYYY-MM-DD-project-update.md`
3. **Update frontmatter**: Change title, description, date
4. **Set draft**: Change `draft: true` to `draft: false` when ready
5. **Content structure**: Status/Built/Challenges/Next Steps format

### Bookmarks
External links with commentary in `src/content/posts/bookmark/`:

1. **Create file**: Use format `YYYY-MM-DD-link-title.md`
2. **Frontmatter**:
```yaml
---
title: "Link Title"
date: 2024-01-01T00:00:00.000Z
type: "bookmark"
url: "https://example.com"
bookmarkDescription: "Why this is worth saving"
tags: ["bookmark"]
draft: false
---
```

### Projects
Published software, one folder per project in `src/content/projects/`:

1. **Copy the template**: duplicate `src/content/projects/_template/` to `src/content/projects/<slug>/`. The folder name is the URL, so `varibl/` is published at `/projects/varibl/`. Folders starting with `_` never load.
2. **Frontmatter** in `index.md`:
```yaml
---
title: "Project Name"
description: "One or two sentences, shown on the list and in the page meta."
date: 2026-01-01T00:00:00.000Z
repo: "https://github.com/squarism/project-name"  # optional
link: "https://project-name.example.com"           # optional live site
image: "./cover.png"                               # optional, lives in the same folder
order: 1                                           # optional, lower numbers list first
draft: true
---
```
3. **Body**: the write-up. The `/projects` list shows the description, year, repo and a 16:9 crop of the image. Projects with an `order` come first, ascending. The rest follow, newest first. The project page shows the image whole and renders the body in the post prose style.

A future `/features` section for demos can copy this shape: a folder-per-entry collection in `src/content.config.ts`, a list page and a `[slug].astro` page under `src/pages/`.

### Links Collection
Curated links and resources in `src/content/links/`:

1. **Create file**: Use format `YYYY-MM-DD-link-title.md`
2. **Frontmatter**:
```yaml
---
title: "Link Title"
url: "https://example.com"
date: 2024-01-01T00:00:00.000Z
description: "Why this link is valuable"
tags: ["resource", "tool"]
draft: false
---
```

### Hero Post Configuration
Homepage hero article set in `src/config.ts`:
```typescript
heroPost: "slug-name", // matches a post id/filename in /posts
```

## Configuration

Key settings in `src/config.ts`:
- `heroPost` - Hero article id for homepage
- Theme and site metadata

## License

MIT
