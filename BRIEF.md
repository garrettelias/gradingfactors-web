# Grading Factors Docs Site — Project Brief

This document is the authoritative reference for building the `gradingfactors.ca` documentation site. It contains all decisions, constraints, design specifications, content structure, and build instructions needed to execute the project. Do not deviate from decisions documented here without explicit instruction.

---

## What We Are Building

A public-facing documentation and landing site for the **Grading Factors API** — a reference data API serving machine-readable Canadian grain grading standards sourced from the Canadian Grain Commission's Official Grain Grading Guide.

This site serves two purposes:
1. **Primary:** API documentation for developers integrating with `api.gradingfactors.ca`
2. **Secondary:** A portfolio piece demonstrating product and technical capability in Canadian agtech

The site lives at `gradingfactors.ca`. The API itself lives at `api.gradingfactors.ca` and is managed in a separate project.

---

## Audience

**Primary audience — developers actively building:** They have a key and need endpoint references, schema definitions, and accurate example responses. Optimize for this audience.

**Secondary audience — developers evaluating:** They need to understand what the API is, why it exists, and whether it's trustworthy. The landing page and Overview serve this audience.

---

## Tech Stack

| Component | Choice |
|---|---|
| Framework | Starlight (Astro documentation framework) |
| Hosting | Netlify (connect GitHub repo; auto-deploy on push) |
| Domain | `gradingfactors.ca` (already purchased) |

### Key constraints

- Starlight's sidebar and layout structure are fixed. Visual customization is applied via CSS custom properties — do not attempt to rebuild the layout from scratch.
- The landing page (index) is built as a custom Astro component to allow visual control beyond Starlight's default index page. It must transition cleanly into the Starlight docs shell.
- All other pages are standard Starlight `.md` or `.mdx` files.
- Netlify account does not yet exist — create one during Phase 2 setup.

---

## Visual Identity

### Palette

| Role | Value |
|---|---|
| Background | `#0d1320` (deep navy) |
| Accent | `#00e5b0` (teal) |
| Prose text | White / near-white |
| Code block background | Darker than page background; exact value TBD during build |
| Panel / sidebar background | `#0f2035` |
| Subtle highlight / callout background | `#142640` |

### Typography

| Role | Font |
|---|---|
| Prose / UI | Inter or Geist (confirm availability in Starlight; use whichever integrates most cleanly) |
| Code / monospace | JetBrains Mono or equivalent |

### Design principles

- Dark background throughout; no light mode required for v1
- Single accent colour (teal); used for links, active states, CTA buttons, and inline code highlights
- No agriculture imagery, no stock photography
- No gradient blobs, no decorative animations
- Restrained — confidence through simplicity

### Component reference

Design reference screenshots are stored in `/docs/design-reference/`

- **Sidebar** (`Sidebar.png`): Text labels only, no icons. Section headers in spaced caps, subdued weight. Page links in lighter weight below each header. Active page highlighted with solid teal-tinted background block. Settings and API Status appear below the main nav as secondary items in a dimmer treatment.
- **Response panel** (`Response_Body.png`): Dark panel background (`#0f2035`), labelled "RESPONSE BODY" in small spaced caps. JSON syntax highlighting: string keys in teal, string values in lighter teal/white, numeric values in teal. Bottom bar with "COPY RESPONSE" and "SCHEMA" actions. Traffic light dots (decorative) in top right corner.
- **CTA button** (`CTA_Button.png`): Solid teal fill, dark text, all-caps or title case label. Label: "Get API Key."
- **Field definition list** (`Field_Definitions.png`): Two-column layout. Left column: monospace field name in teal. Right column: prose description in white, TYPE and RANGE annotations in subdued spaced caps below. Rows separated by subtle horizontal dividers. Background steps up slightly from page background (`#142640`) on alternating rows or on hover — confirm during build.

### Tagline

> Canadian grain grading data, *machine-readable* at last.

"machine-readable" is italicised.

---

## Site Structure

```
gradingfactors.ca/
│
├── Landing (index — custom Astro component)
│   Tagline, one-paragraph description, Get API Key CTA
│   Optional: single curl example showing a real API call
│
├── Getting Started (sidebar section header)
│   ├── Overview
│   ├── Authentication
│   └── Quickstart
│
├── API Reference (sidebar section header)
│   ├── GET /grains
│   ├── GET /grains/{grain_id}
│   └── GET /changelog
│
├── Data Model (sidebar section header)
│   ├── Field Reference
│   └── Update Model
│
└── About (sidebar section header)
    └── About this project
```

**Total pages: 10** (1 custom landing + 9 Starlight content pages)

---

## Content Plan

### Authorship by page

| Page | Approach |
|---|---|
| Field Reference | AI-written (adapted from `docs/field-reference.md`), human edited |
| GET /grains | AI-written, human edited |
| GET /grains/{grain_id} | AI-written, human edited |
| GET /changelog | AI-written, human edited |
| Authentication | AI-written, human edited |
| Overview | Human-written, AI edited |
| Update Model | Human-written, AI edited |
| Quickstart | Human-written, AI edited |
| About this project | Human-written, AI edited |
| Landing / Hero | Human-written, AI edited |

### Writing order

Write in this order — earlier pages inform later ones:

1. Field Reference
2. Overview
3. Update Model
4. Authentication
5. Quickstart *(requires live API at `api.gradingfactors.ca`)*
6. API Reference pages *(requires live API)*
7. About this project
8. Landing / Hero

### Content dependencies

The Quickstart and all three API Reference pages require the API to be live with real responses. Write these last if the API build is still in progress. Use clearly marked placeholders (`[EXAMPLE RESPONSE — FILL FROM LIVE API]`) and complete them once the API is deployed.

### Tone

- Direct and technical, but readable by non-engineers
- No marketing inflation — this is a public service, not a SaaS product
- First person where appropriate (especially on the About page)
- The "why this exists" story (CGC publishes grading data as PDFs only; no machine-readable version existed) is a genuine differentiator — surface it in the Overview and About pages

---

## Contact

**Support email:** `contact@gradingfactors.ca`

Referenced on: Authentication page (for key issues), About page.

Setup note: email forwarding from `contact@gradingfactors.ca` to a personal inbox must be configured during execution — not yet set up.

---

## DNS Configuration

| Domain | Destination |
|---|---|
| `gradingfactors.ca` | Netlify (docs site) |
| `api.gradingfactors.ca` | Fly.io (API — managed in API project) |

DNS changes should be made early in Phase 2 to allow propagation time before launch.

---

## Relationship to API Project

The API project (`api.gradingfactors.ca`) is managed in a separate build chat with its own brief. The docs site depends on the API being live before content is finalized. Cross-references:

| API project output | Usage here |
|---|---|
| `docs/field-reference.md` | Source material for Field Reference page |
| FastAPI `/docs` endpoint | Linked from docs site as supplemental OpenAPI reference |
| Live endpoint responses | Required for Quickstart and API Reference examples |

The API project's Phase 8 (Documentation) produces: route docstrings, a slimmed-down `README.md` that defers to this site, and `CHANGELOG.md`. Those are managed in the API project, not here.

---

## Execution Phases

See `EXECUTION-PLAN.md` for full phase details and progress tracking. Summary:

| Phase | Description | Status |
|---|---|---|
| 1 | Foundation & Decisions | **Complete** |
| 2 | Starlight Scaffold & Theme | Not started |
| 3 | Content | Not started |
| 4 | Polish & Launch | Not started |

---

## Key Decisions — Do Not Revisit Without Instruction

- **Starlight is the framework.** Do not swap for Docusaurus, Mintlify, or a hand-built site.
- **Netlify is the host.** GitHub Pages is not used for this project.
- **Custom landing page.** The index page is a custom Astro component, not Starlight's default index. All other pages use Starlight's standard content model.
- **Teal on deep navy.** Palette is locked. Do not introduce additional accent colours.
- **Italic tagline treatment.** "machine-readable" is italicised in the tagline. No colour split.
- **No icons in sidebar.** Text labels only.
- **No dark/light mode toggle for v1.** Dark only.
- **No agriculture imagery.** The aesthetic is data infrastructure, not farm.
- **Contact via email.** `contact@gradingfactors.ca` is the only listed support channel.
- **Option C documentation model.** `gradingfactors.ca` is the primary documentation surface. FastAPI's `/docs` is a supplemental technical reference, not the public face of the API.
