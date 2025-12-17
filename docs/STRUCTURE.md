# Expected PowerPoint Structure

## Slide Requirements

Each slide should contain text with specific colors:

### Color Mapping
- **White Text** (`#FFFFFF`) = Romanian language
- **Yellow Text** (`#FFFF00`, `#FFC000`, `#FFD700`) = English language

## Example Slide Setup

### Slide 1 (0:00 - 0:04)
```
┌─────────────────────────────────┐
│                                 │
│  Hello and welcome!             │  ← Yellow text (#FFFF00)
│                                 │
│  Bună ziua și bine ați venit!   │  ← White text (#FFFFFF)
│                                 │
└─────────────────────────────────┘
```

### Slide 2 (0:04 - 0:08)
```
┌─────────────────────────────────┐
│                                 │
│  This is the second slide       │  ← Yellow text
│                                 │
│  Acesta este al doilea slide    │  ← White text
│                                 │
└─────────────────────────────────┘
```

## Output Result

### subtitles.en.srt
```srt
1
00:00:00,000 --> 00:00:04,000
Hello and welcome!

2
00:00:04,000 --> 00:00:08,000
This is the second slide
```

### subtitles.ro.srt
```srt
1
00:00:00,000 --> 00:00:04,000
Bună ziua și bine ați venit!

2
00:00:04,000 --> 00:00:08,000
Acesta este al doilea slide
```

## How to Set Text Color in PowerPoint

1. Select the text
2. Home tab → Font Color dropdown
3. Choose:
   - **White** for Romanian
   - **Yellow** for English

## Important Notes

- ✅ Position doesn't matter (top/bottom/left/right)
- ✅ Text box size doesn't matter
- ✅ Multiple text boxes per slide are OK
- ✅ Mix of colors in same text box is supported
- ✅ Empty slides (no text) are skipped
- ⚠️ Only **white** and **yellow** colors are extracted
- ⚠️ Slide order = subtitle order (don't reorder slides after creating)

## Slide Timing

### Option 1: Automatic Timing (Recommended)
1. Transitions tab
2. Set "Advance Slide: After" duration (e.g., 4 seconds)
3. Apply to all slides

### Option 2: Use Default Duration
- Don't set slide timing in PowerPoint
- Use `--default-duration 4` when running the tool

## Advanced: Multiple Text Runs

You can have multiple paragraphs or text runs in the same color:

```
Yellow text line 1        ← All grouped together
Yellow text line 2        ← in the same subtitle
Yellow text line 3

White text line 1         ← All grouped together
White text line 2         ← in the same subtitle
```

Result in SRT:
```srt
1
00:00:00,000 --> 00:00:04,000
Yellow text line 1 Yellow text line 2 Yellow text line 3

---

1
00:00:00,000 --> 00:00:04,000
White text line 1 White text line 2
```

## Troubleshooting Color Detection

If text isn't being detected, check:

1. **Exact Color Value**
   - Right-click text → Font → Color
   - "More Colors" → Custom tab
   - Check RGB values:
     - White: R=255, G=255, B=255
     - Yellow: R=255, G=255, B=0 or R=255, G=192, B=0

2. **Not Using Theme Colors**
   - Avoid "Theme Colors" if possible
   - Use "Standard Colors" or "More Colors"

3. **Run in Debug Mode**
   ```bash
   node pptx-to-srt.mjs file.pptx --debug
   ```
   Shows extracted colors for troubleshooting
