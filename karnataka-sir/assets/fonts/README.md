# Bundled font provenance

These font files are bundled so the office preview does not silently resolve to an unrelated local fallback.

Downloaded: 2026-08-10

## Special Elite

- File: `SpecialElite-Regular.ttf`
- Use: English printed form and desktop counter-plaque label
- Weight: 400
- Source: `https://raw.githubusercontent.com/google/fonts/main/apache/specialelite/SpecialElite-Regular.ttf`
- Project: `https://fonts.google.com/specimen/Special+Elite`
- License: Apache License 2.0
- SHA-256: `a776fcb4ceb8bdf03e2967688ebdad42680de5b91a7e62c17e718ae212d14bc4`

## Kalam Light

- File: `Kalam-Light.ttf`
- Use: desktop wall disclaimer
- Weight: 300
- Source used: `https://fonts.gstatic.com/s/kalam/v18/YA9Qr0Wd4kDdMtD6GgLL.ttf`
- Project: `https://fonts.google.com/specimen/Kalam`
- License: SIL Open Font License 1.1
- SHA-256: `a3dc711f9e9f58897f9471ae5dc82374cf3740ade7f60a29fd42bd8333f5eb04`

## Kalam Regular

- File: `Kalam-Regular.ttf`
- Use: English speech card
- Weight: 400
- Source used: `https://fonts.gstatic.com/s/kalam/v18/YA9dr0Wd4kDdMuhW.ttf`
- Project: `https://fonts.google.com/specimen/Kalam`
- License: SIL Open Font License 1.1
- SHA-256: `57cecb63d4608019371954274ae1d8c397764debd5b19d4a33c1efa4dc923c0b`

## Verification

`scripts/qa_office_preview.mjs` waits for `document.fonts.ready`, checks the requested family/weight pairs, reports the loaded `FontFace` entries, and records the computed stacks used by the speech card, form, and wall copy.

Do not replace or remove a font file without updating:

1. The `@font-face` declaration in `styles.css`.
2. This provenance file and its checksum.
3. The font checks in `scripts/qa_office_preview.mjs`.
4. The visual QA captures at desktop and compact sizes.

