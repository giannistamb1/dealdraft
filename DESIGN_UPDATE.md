# Design System Update

## Changes Applied

I've updated the DealDraft application to use the modern green design system from the Greek landing page instead of the original signature-ready theme.

### Design System Updates

**New Color Palette:**
- Primary Green: `#0E6B4F`
- Soft Green (backgrounds): `#EAF4F0`
- Text: `#0B0F0D`
- Muted Text: `#6B7280`
- Lines/Borders: `#ECECEF`
- Gray Background: `#F6F7F6`

**New Typography:**
- Display font: **Manrope** (800 weight, tight letter-spacing)
- Body font: **Inter** (400-600 weights)
- Removed: Libre Caslon Text (serif) and Spline Sans Mono

**New Components:**
- Rounded button style with pill shape (999px border-radius)
- Card component with subtle shadows
- Block components with 32px border radius
- Eyebrow badges (uppercase, green on soft-green background)

### Files Updated

1. **`app/globals.css`** - Complete design system rewrite
   - New CSS variables for green theme
   - Manrope + Inter fonts
   - Button styles (`.btn-primary`)
   - Card and block utilities

2. **`components/Logo.tsx`** - Simplified logo
   - Text-based logo: "Deal**Draft**" (Draft in green)
   - Uses Manrope font
   - Removed SVG version

3. **`app/page.tsx`** - Landing page rebuilt
   - Hero with large display type
   - Transcript → Proposal visual
   - Integration strip (Fireflies, Fathom, etc.)
   - Three-step process cards
   - Math comparison (3 hours vs 10 minutes)
   - Split layout (Your template section)
   - Green CTA buttons throughout

### Status

✅ **Completed:**
- Design system (CSS)
- Logo component
- Landing page
- Build verified (application compiles successfully)

⚠️ **Remaining Work:**

The following pages still use the old design system and need updating:

1. **`app/dashboard/page.tsx`** - Proposals list
   - Update table styling
   - Green theme for status pills
   - Card-based layout

2. **`app/new/page.tsx`** - New proposal form
   - Update form inputs with new border radius
   - Green button styling
   - Card layout for form sections

3. **`app/proposal/[id]/page.tsx` + `components/ProposalEditor.tsx`** - Editor
   - Green accent colors
   - Card-based section list
   - Updated button styles
   - Pricing table with new styling

4. **`app/p/[token]/page.tsx` + `components/PublicProposalView.tsx`** - Client view
   - Green letterhead styling
   - Accept button with green theme
   - Card-based proposal sections

5. **`app/settings/page.tsx`** - Settings form
   - Input styling updates
   - Green accent for active states
   - Card-based form sections

6. **`lib/pdf/generator.tsx`** - PDF export
   - Update colors to green theme
   - Manrope font references (if supported by PDF renderer)

## How to Complete the Update

To finish applying the design system to all pages, update each file using these patterns:

### Button Pattern
```tsx
<button className="btn-primary">
  Button Text
</button>
```

### Card Pattern
```tsx
<div className="card p-7">
  Card content
</div>
```

### Block Pattern
```tsx
<div className="block">
  {/* Gray background, rounded */}
</div>

<div className="block block-white">
  {/* White background, rounded, bordered */}
</div>
```

### Color Usage
- Primary action: `#0E6B4F` (green)
- Text: `#0B0F0D`
- Muted text: `#6B7280`
- Borders: `#ECECEF`
- Soft backgrounds: `#EAF4F0` or `#F6F7F6`

### Typography
- Headings: `className="display"` (Manrope, 800 weight)
- Body: Default (Inter)
- No mono font for pricing (use Manrope instead)

## Design Philosophy

The new design system moves away from the "signature-ready" contract aesthetic toward a modern SaaS feel:

- **Old theme:** Ink/bond/brass, serif fonts, letterhead rules, signature lines
- **New theme:** Green/white/gray, sans-serif, rounded cards, pill buttons

The green theme is more energetic and modern while maintaining professionalism.

## Next Steps

1. If you like this direction, continue updating the remaining pages using the patterns above
2. If you prefer the original design, revert by restoring the old `globals.css` and page files
3. Test the full flow (create proposal → edit → share → accept) with the new design

## Build Status

✅ Application builds successfully
✅ No TypeScript errors
✅ Landing page fully redesigned
