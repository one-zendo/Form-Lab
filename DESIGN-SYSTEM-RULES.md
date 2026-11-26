# FORM — Mandatory design system rules

Applies to every new or modified page, component, dialog, sheet, and interaction.

1. FORM's global semantic design and measurement tokens are the source of truth. Use shared tokens for colors, typography, spacing, padding, radii, dimensions, icons, elevation, touch targets and motion. Do not duplicate hardcoded values in components; define or extend semantic tokens centrally when necessary.
2. Requests to copy or reference One mean adapt its visual composition, hierarchy, layout and interaction patterns to FORM's own tokens and independent implementation. Never import One's styling or measurements wholesale.
3. Components must adapt to available content space, folded/unfolded screens and orientations. Prefer content-driven sizing, shared responsive tokens and flexible layouts.
4. Preserve the approved Build 78 Duo navigation geometry and current viewport, gesture and update behavior. Do not modify these protected foundations as a side effect of page work. Existing dock geometry is a documented exception to generic measurement rules.
5. Before committing, inspect new/modified styles for hardcoded design values, check token references, validate JavaScript syntax, and verify that protected shell behavior is unchanged. Report any exceptions and any device tests not performed.
6. Treat literal zero, percentages, intrinsic sizing keywords, structural grid fractions, and necessary device-specific geometry as layout mechanics rather than arbitrary design values. Document intentional exceptions.

Baseline: Build 83 adaptive measurement system. Read the current source before implementing changes.
