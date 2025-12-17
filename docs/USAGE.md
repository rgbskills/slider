# Quick Usage Guide

## How to Convert Your PowerPoint Files

### 1. Add Your Files

Put your PowerPoint files (`.pptx` or `.ppt`) in the **`input`** folder:

```
slider/
├── input/              ← Put your files here
│   ├── fasz.pptx
│   ├── movie1.ppt
│   └── presentation.pptx
└── converted/          ← Converted files appear here
```

### 2. Run the Converter

```bash
node convert-all.mjs
```

This will automatically:
- Convert any `.ppt` files to `.pptx` format
- Extract white text → Romanian subtitles
- Extract yellow text → English subtitles  
- Save files to the `converted` folder with the original filename

### 3. Get Your Subtitles

Output files will be in the `converted` folder:

```
converted/
├── fasz.ro.srt         ← Romanian subtitles
├── fasz.en.srt         ← English subtitles
├── movie1.ro.srt
├── movie1.en.srt
├── presentation.ro.srt
└── presentation.en.srt
```

## Settings

- **Default duration**: 3 seconds per slide
- **White text** = Romanian (`.ro.srt`)
- **Yellow text** = English (`.en.srt`)

## Single File Conversion

To convert just one file:

```bash
node pptx-to-srt.mjs input/fasz.pptx
```

Output: `converted/fasz.ro.srt` and `converted/fasz.en.srt`

## Advanced Options

```bash
# Custom duration (5 seconds per slide)
node pptx-to-srt.mjs input/fasz.pptx --default-duration 5

# With start offset (2 seconds)
node pptx-to-srt.mjs input/fasz.pptx --start-offset-ms 2000

# Debug mode (see what's extracted)
node pptx-to-srt.mjs input/fasz.pptx --debug

# Bilingual mode (both languages in one file)
node pptx-to-srt.mjs input/fasz.pptx --output bilingual
```

## Workflow Summary

1. **Place files** → `input/` folder
2. **Run** → `node convert-all.mjs`
3. **Get subtitles** → `converted/` folder
4. **Import to DaVinci Resolve**

Done! 🎉
