# Motion
Purposeful, interruptible, reversible shared motion. Latest recorded runtime reference: standard 320ms, selection/color 260ms, easing cubic-bezier(.2,.8,.2,1), spring cubic-bezier(.2,.8,.2,1.15), hinge 320ms, unfold 460ms, retarget window 500ms. Natural rotation without extra animation. Keep fixed chrome stationary, preserve scroll, drafts, selection, workout state and timer deadlines. Reduced motion removes nonessential transforms/pulses; reduced transparency uses opaque surfaces. Historical named timing vocabulary in design-system-reference.md is a proposal for new interactions, not verified runtime. Validate before adopting additional durations.

Build 4 defines shared CSS timing/easing tokens and reduced-motion overrides; no new animations introduced. Rotation remains natural.

Build 10: approved 150ms immediate feedback token for frequent actions; existing 260ms selection and 320ms standard motion retained. Reduced motion sets feedback duration to zero. No rotation or hinge animation changes.
