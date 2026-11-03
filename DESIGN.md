---
version: "alpha"
name: ReservaYa
description: Visual identity and interface tokens for the ReservaYa Spanish-language booking prototype.
colors:
  primary: "#2563EB"
  primary-hover: "#1D4ED8"
  secondary: "#4F46E5"
  accent: "#F59E0B"
  success: "#059669"
  background: "#F8FAFC"
  surface: "#FFFFFF"
  text: "#0F172A"
  text-secondary: "#475569"
  border: "#E2E8F0"
  on-primary: "#FFFFFF"
typography:
  display:
    fontFamily: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 3rem
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: -0.025em
  heading:
    fontFamily: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 0.75rem
    fontWeight: 700
    letterSpacing: 0.05em
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 24px
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 12px
---

## Overview

ReservaYa uses a friendly, trustworthy travel-and-hospitality visual language. A saturated blue anchors navigation and primary actions; white cards and cool slate neutrals keep dense listing information readable. Indigo supports the broader brand identity, while amber and emerald communicate category accents and positive status. The current implementation is Tailwind-based; these tokens describe its observed visual direction and should guide consistent changes rather than imply a full redesign.

## Colors

Blue is the primary action color. Use the deeper primary-hover value for hover states, not as a second unrelated action color. White surfaces sit on a very light cool-gray background. Use slate text for hierarchy and keep borders subtle. Amber is most appropriate for ratings and restaurant-related highlights; emerald indicates successful or wellness-related states. Do not use color alone to communicate selection, status, or errors.

## Typography

Use the system sans-serif stack already established in the global stylesheet. Display text is bold and tightly tracked for the discovery hero; headings are strong and compact; body copy should remain comfortably readable. Small uppercase labels are for form metadata, not paragraphs. Keep Spanish text and accents intact.

## Layout

Prioritize a mobile-first responsive layout. Use a centered content area with a maximum width near 80rem, consistent horizontal gutters, and generous section spacing. On wide screens, listing results may sit beside a sticky reservation summary; on narrow screens, stack these regions and preserve access to primary navigation. Search controls should stack on mobile and form a row where space permits.

## Elevation & Depth

Prefer thin slate borders and soft, restrained shadows to distinguish cards from the page. Reserve stronger shadows for floating navigation, prominent search surfaces, and primary actions. Avoid layering multiple heavy shadows or using elevation as the only focus indicator.

## Shapes

Use rounded corners consistently: medium for controls, large for cards, and extra-large for hero or prominent grouped surfaces. Pills are appropriate for category/status chips. Do not mix sharp-edged controls with highly rounded cards without a clear hierarchy.

## Components

- **Primary buttons:** blue fill, white bold text, medium radius, visible hover and keyboard-focus states. Keep action labels explicit.
- **Cards:** white surface, subtle slate border, large radius, and consistent internal spacing. Listing cards need a clear selected state in addition to color (for example, border/ring and an accessible selected semantic).
- **Inputs:** light neutral fill, slate border, medium radius, persistent visible labels, and a high-contrast focus ring.
- **Category controls:** use a consistent selected treatment across home search tabs and booking category switches. Icons supplement, rather than replace, text labels.
- **Ratings and status:** pair icons/colors with text or numeric values so meaning is not color-dependent.

## Do's and Don'ts

- Do preserve a clear distinction between real functionality and the current simulated booking flow.
- Do use the shared tokens for new UI and keep contrast accessible, especially for small text and controls.
- Do maintain keyboard access, visible focus, semantic labels, and responsive behavior.
- Do not promise offline access, notifications, installation, or real-time availability unless implemented and verified.
- Do not introduce new accent colors or one-off radii without a documented need.
- Do not use placeholder links or visually actionable controls that silently do nothing.
