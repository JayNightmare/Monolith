---
name: Monolith Marketing
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdf'
  on-secondary-container: '#626262'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  stats-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.0'
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  grid-pattern: 32px
---

## Brand & Style
This design system embodies a "Minimalist Professional" aesthetic with "Brutalist Lite" undertones. It is designed for high-performance marketing environments where clarity and utility are paramount. The brand personality is authoritative, transparent, and precise.

The visual language relies on heavy structural lines, intentional whitespace, and a strict monochrome palette to eliminate cognitive load. By stripping away decorative gradients and soft shadows, the focus is redirected entirely toward user content and data insights. The emotional response should be one of control, efficiency, and industrial-grade reliability.

## Colors
The palette is strictly monochrome to reinforce the professional, high-contrast nature of the system. 

- **Primary (#000000):** Used for all primary actions, text, and structural borders.
- **Secondary (#666666):** Reserved for metadata, helper text, and inactive states.
- **Tertiary (#EEEEEE):** Utilized for the background grid pattern and subtle surface differentiation.
- **Neutral (#FFFFFF):** The base background color for all screens.

Interactive states (hover/active) are handled through inversion (e.g., black background with white text) rather than hue shifts.

## Typography
The system uses **Inter** for its systematic, utilitarian clarity. It provides a neutral voice that scales well from massive display headers to dense marketing insights. For labels, technical data, and small accents, **JetBrains Mono** is introduced to provide a "Brutalist Lite" feel, suggesting data precision and technical sophistication.

All headlines use tight letter spacing to appear more impactful and structural. Body text maintains a generous line height to ensure readability in long-form insight reports.

## Layout & Spacing
The layout uses a **Fixed Grid** system centered on the viewport. On desktop, the container is capped at 1280px to maintain line-length readability for text-heavy insights.

- **The Grid:** A subtle 32px x 32px background grid is present on main pages to reinforce the "work-in-progress" / "builder" aesthetic.
- **Upload Zone:** A central hero area using a dashed border, spanning 12 columns on mobile and 8 columns on desktop.
- **Results View:** A 50/50 split (two-column) layout for desktop, stacking to a single column on mobile.
- **Navigation:** A hidden sidebar triggered by a top-left hamburger menu. When active, it slides over the content with a hard-edge black border.

## Elevation & Depth
This design system rejects shadows and blurs. Depth is achieved exclusively through **Tonal Layers** and **Bold Borders**.

1.  **Level 0 (Base):** Pure white background with a subtle light gray grid pattern.
2.  **Level 1 (Panels):** Defined by 2px solid black borders. No rounded corners.
3.  **Level 2 (Modals/Overlays):** Defined by 4px solid black borders with a heavy "block shadow" (a solid black offset fill) if visual emphasis is required.

Interaction is communicated through high-contrast fills rather than simulated light sources.

## Shapes
The shape language is strictly **Sharp (0px)**. Every element—from buttons to input fields to the main video drop zone—must have 90-degree corners. This reinforces the professional, architectural feel of the marketing tool. 

The only exception to the "solid line" rule is the **Upload Drop Zone**, which utilizes a 2px dashed black stroke to signify an empty, interactive state.

## Components
- **Buttons:** Solid black background with white text for primary actions. 2px black border with white background for secondary. On hover, primary buttons invert to white background/black text.
- **Input Fields:** 2px solid black borders. Label text uses JetBrains Mono in all caps above the field.
- **Video Drop Zone:** Large dashed-border container. Centralized icon and "Headline LG" text. The entire area should highlight with a subtle gray fill on drag-over.
- **Cards (Persona/Insights):** Sharp-edged containers with a 2px black border. Use "Label Caps" for section headers inside the cards.
- **Chips/Tags:** Small rectangular boxes with 1px black borders. No background fill unless selected.
- **Lists:** Items separated by 1px solid black horizontal rules. No bullet points; use JetBrains Mono for numbering (e.g., 01., 02.) to maintain the technical aesthetic.