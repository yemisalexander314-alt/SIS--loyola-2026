---
name: SIS Loyola Institutional ERP
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#4e5f7a'
  primary: '#00040e'
  on-primary: '#ffffff'
  primary-container: '#0b1e36'
  on-primary-container: '#7586a3'
  inverse-primary: '#b6c7e7'
  secondary: '#1d4ed8'
  on-secondary: '#ffffff'
  secondary-container: '#4069f2'
  on-secondary-container: '#fffbff'
  tertiary: '#000502'
  on-tertiary: '#ffffff'
  tertiary-container: '#002315'
  on-tertiary-container: '#0c986b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#b6c7e7'
  on-primary-fixed: '#091c34'
  on-primary-fixed-variant: '#364762'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001551'
  on-secondary-fixed-variant: '#0039b5'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  code-num:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system serves the enterprise administration, academic governance, and institutional operations of the Instituto Técnico San Ignacio de Loyola F.M. in Honduras. Built for a technical and secondary educational institution founded in 1970, the system must balance academic heritage with rigorous modern software utility.

### Brand Personality & Core Principles
- **Authoritative & Reliable:** Reflects academic discipline, institutional trust, and stability for registrars, faculty, students, and financial administrators.
- **Systematic & Utilitarian:** Focuses entirely on administrative efficiency, data density, high-speed keyboard input, and rapid parsing of tabular metrics.
- **Disciplined Restraint:** Eliminates arbitrary visual noise, purely decorative gradients, or playful whimsy in favor of institutional gravitas and purpose-driven functional clarity.

### Design Movement: Modern Technical Enterprise
The aesthetic relies on **Modern Corporate Minimalism** optimized for high-density SaaS/ERP applications. Crisp hairline borders (`#E2E8F0`), elevated pure-white modules (`#FFFFFF`), neutral slate backgrounds (`#F8FAFC`), and precise deep navy framing establish an atmosphere of order, clarity, and computational rigor.

## Colors

The color architecture is built around an institutional hierarchy rooted in the institute's crest, prioritizing legible operational surfaces and strict semantic signaling.

### Functional Palette Structure
- **Primary Institutional Surface (`#0B1E36`):** Deep scholastic navy. Used for main application sidebars, enterprise mastheads, high-contrast modal headers, and foundational brand structural blocks.
- **Secondary Interactive Blue (`#1D4ED8`):** Academic royal blue. Applied to primary interactive controls, active navigation nodes, links, focused form inputs, and key action buttons.
- **Semantic Accents:**
  - **Success / Emerald (`#059669` / `#10B981`):** Approvals, active enrollments, passed grade statuses, and balanced financial balances.
  - **Warning / Amber (`#D97706` / `#F59E0B`):** Incomplete files, academic warnings, pending review tasks, and attendance alerts.
  - **Critical / Crimson (`#DC2626`):** Deficits, expulsions, failed course alerts, and irreversible administrative actions.
  - **Cobalt / Information (`#2563EB`):** System notifications, active term counters, and neutral data tags.
- **Neutrals & Canvas Layers:**
  - **Application Canvas (`#F8FAFC`):** Low-strain, cool tinted background for wide multi-column workspaces.
  - **Card / Surface Canvas (`#FFFFFF`):** High-clarity white surface for data tables, KPI widgets, and form panels.
  - **Structural Borders (`#E2E8F0` / `#CBD5E1`):** Thin, crisp separators between toolbars, table cells, and panel borders.
  - **Text Typography Neutrals:** `#0F172A` (Headings/Primary text), `#334155` (Body text), `#64748B` (Secondary metadata and labels).

## Typography

The design system standardizes on **Inter** across all display, body, and tabular contexts due to its tall x-height, neutral mechanical balance, and open counter shapes that remain legible in compact enterprise tables and dense grade sheets.

### Typographic Principles
- **Tabular Figures:** All numeric displays (academic grades, student IDs, currency in Honduran Lempiras, percentages) must employ OpenType tabular numbers (`tnum`) to maintain vertical columnar alignment across financial and evaluation sheets.
- **Scale Restraint:** Display sizes are reserved strictly for high-level executive summaries and authentication screens. Operating screens lean heavily on sizes between `11px` and `16px` to maximize screen real estate and data visibility.
- **Hierarchy via Weight:** Distinct contrast is produced using weights (`400` for standard records, `500` for numeric values, and `600`/`700` for table headers, section titles, and action triggers) rather than extreme size shifts.

## Layout & Spacing

The layout model is architected for expansive desktop displays (1440px and higher) typical of institutional offices, while gracefully collapsing for portable tablets and administrative mobile audits.

### Structure & Layout Grids
- **Master Shell:** Composed of a fixed-width collapsible institutional navigation sidebar (64px collapsed, 260px expanded), an application masthead (56px fixed height), and a fluid primary content canvas.
- **Primary Grid:** 12-column fluid grid system bounded by `1.5rem` (24px) canvas margins and standard `1rem` (16px) gutters.
- **Compact ERP Density:** Spacing utilizes an 8pt base unit with specialized 4pt subdivisions (`space-xs: 4px`, `space-sm: 8px`, `space-md: 12px`, `space-lg: 20px`, `space-xl: 32px`). Form fields, table cells, and filter toolbars default to compact vertical padding to enable scanning 15–25 records above the fold.

## Elevation & Depth

Visual hierarchy within this design system is driven primarily through clean structural surfaces and low-contrast borders rather than deep dramatic drops, preventing cognitive fatigue over prolonged usage.

### Elevation Hierarchy
- **Level 0 (Flat Canvas - `#F8FAFC`):** Application base background.
- **Level 1 (Card & Module Surface - `#FFFFFF`):** Base container for KPI modules, lists, and tables. Styled with a razor-thin border `1px solid #E2E8F0` and an imperceptible micro-shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hovered Records & Action Drawers):** Used when hovering interactive rows or opening slide-over student dossiers. Styled with `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)` and `1px solid #CBD5E1`.
- **Level 3 (Modals & Overlays):** Standard system dialogs, academic record confirmation prompts, and contextual popovers. Defined by `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)` combined with a deep navy translucent backdrop (`rgba(11, 30, 54, 0.60)`).

## Shapes

The shape system adopts a **Soft (`1`)** geometry (base radius of `4px` / `0.25rem`, with medium panels at `6px` and larger cards at `8px` / `0.5rem`).

### Geometric Guidelines
- **Input Fields, Table Cells, and Action Buttons:** Utilize `4px` border radius, delivering crisp alignment with standard data columns.
- **Cards, Modals, and Dashboard Tiles:** Utilize `6px` to `8px` border radius.
- **Badges and Status Pills:** Use full rounded pill caps (`9999px`) to create an immediate morphological distinction between actionable square buttons and passive status pills.

## Components

### Buttons & Interactive Controls
- **Primary Action:** Solid `#1D4ED8` background, `#FFFFFF` text, `4px` radius, medium weight (`font-weight: 600`). On hover: `#1E40AF`.
- **Secondary Institutional:** Solid `#0B1E36` navy with white text for global system triggers (e.g., "Generar Matrícula", "Cerrar Período").
- **Secondary Outline:** White surface with `1px solid #CBD5E1`, text `#334155`. On hover: `#F1F5F9`.
- **Destructive:** Soft red `#FEE2E2` background with `#B91C1C` text; solid `#DC2626` for definitive irreversible actions.

### Tables & Data Grids
- **Header Row:** Crisp `#F8FAFC` background, uppercase `11px` typography, `font-weight: 600`, letter-spaced, with `#64748B` color and a subtle `1px solid #E2E8F0` bottom boundary.
- **Row Styling:** Alternating or clean white rows with `1px solid #F1F5F9` row dividers. Row height set to a compact `40px` to `48px`. Hovered rows highlight softly in `#F8FAFC`.
- **Numeric Alignment:** Student counts, averages, and fees are strictly right-aligned with tabular numerals.

### Status Badges & Academic Indicators
- **Enrolled / Approved:** `#ECFDF5` background, `#047857` text, `1px solid #A7F3D0`.
- **Pending / In Review:** `#FFFBEB` background, `#B45309` text, `1px solid #FDE68A`.
- **Failing / Suspended:** `#FEF2F2` background, `#B91C1C` text, `1px solid #FECACA`.
- **General / Inactive:** `#F1F5F9` background, `#475569` text, `1px solid #E2E8F0`.

### Form Fields & Inputs
- **Base Style:** Standard `36px` height, `#FFFFFF` background, `1px solid #CBD5E1`, padded `8px 12px`, text `14px`.
- **Focus State:** Crisp 2px halo ring in `#1D4ED8` with border transition to `#1D4ED8`.
- **Labels:** `12px` medium `#334155` placed strictly top-aligned above inputs for rapid visual parsing.

### Metric Cards (KPI Tiles)
- Surface is `#FFFFFF` with `1px solid #E2E8F0` and `8px` corner radius.
- Includes a top micro-badge or icon container (tinted deep navy or cobalt), a bold `28px` metric display, and a compact `12px` subtext indicator detailing comparison against previous academic quarters.