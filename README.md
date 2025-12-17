# PPTX to SRT Converter

Convert PowerPoint presentations with bilingual subtitles (Romanian/English) to DaVinci Resolve SRT subtitle format.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Files

Place your PowerPoint files in the `input/` folder:

```
slider/
├── input/              ← Put your .pptx or .ppt files here
│   ├── fasz.pptx
│   ├── movie.ppt
│   └── presentation.pptx
└── converted/          ← Converted SRT files appear here
```

### 3. Convert

```bash
npm run convert              # Default: 3 seconds per subtitle
npm run convert -- 5         # Custom: 5 seconds per subtitle
npm run convert:fast         # Fast: 2 seconds per subtitle
npm run convert:slow         # Slow: 5 seconds per subtitle
```

### 4. Get Your Subtitles

Files are saved in `converted/` with the original filename:

```
converted/
├── fasz.en.srt         ← English subtitles (yellow text)
├── fasz.ro.srt         ← Romanian subtitles (white text)
├── movie.en.srt
└── movie.ro.srt
```

## How It Works

- **White text** (#FFFFFF) → Romanian subtitles (`.ro.srt`)
- **Yellow text** (#FFFF00) → English subtitles (`.en.srt`)
- **Default duration**: 3 seconds per slide
- **Auto-conversion**: `.ppt` files are automatically converted to `.pptx`

## Single File Conversion

```bash
node program/pptx-to-srt.mjs input/fasz.pptx           # Default: 3 seconds
node program/pptx-to-srt.mjs input/fasz.pptx -d 5      # Custom: 5 seconds
```

## Advanced Options

```bash
# Custom duration (5 seconds per slide)
node program/pptx-to-srt.mjs input/fasz.pptx -d 5
node program/pptx-to-srt.mjs input/fasz.pptx --interval 5

# With start offset (2 seconds)
node program/pptx-to-srt.mjs input/fasz.pptx -d 3 --start-offset-ms 2000

# Debug mode (see extraction details)
node program/pptx-to-srt.mjs input/fasz.pptx --debug

# Bilingual mode (both languages in one file)
node program/pptx-to-srt.mjs input/fasz.pptx --output bilingual

# Custom output directory
node program/pptx-to-srt.mjs input/fasz.pptx --out mysubtitles
```

### All Options

| Option | Description | Default |
|--------|-------------|---------|
| `--out, -o <name>` | Output base name | `subtitles` |
| `--default-duration <seconds>` | Duration per slide | `3` |
| `--start-offset-ms <ms>` | Global start offset | `0` |
| `--min-duration-ms <ms>` | Minimum slide duration | `500` |
| `--lang1 <code>` | Language for white text | `ro` |
| `--lang2 <code>` | Language for yellow text | `en` |
| `--output <mode>` | `separate` or `bilingual` | `separate` |
| `--debug` | Show extraction details | `false` |

## Requirements

- Node.js 14+
- PPTX files with colored text (white for Romanian, yellow for English)

## PowerPoint Setup

Your slides should have:
- **White text** (#FFFFFF) for Romanian
- **Yellow text** (#FFFF00, #FFC000) for English
- Text can be in any position on the slide
- Multiple text boxes per slide are supported

## Import to DaVinci Resolve

1. Open DaVinci Resolve
2. Right-click timeline → **Subtitles** → **Import Subtitle**
3. Select your `.srt` file
4. Adjust styling in Inspector panel

## Troubleshooting

### No text extracted
- Run with `--debug`: `node program/pptx-to-srt.mjs input/file.pptx --debug`
- Check text colors in PowerPoint (select text → Font Color)
- Ensure colors are exactly #FFFFFF (white) and #FFFF00 (yellow)

### Wrong file format
- If you have a `.ppt` file, it will be auto-converted to `.pptx`
- Manual conversion: Open in PowerPoint → Save As → PowerPoint Presentation (.pptx)

### Old subtitles in root folder
- The tool now saves to `converted/` folder
- Old files in root can be deleted

## Documentation

- [Usage Guide](docs/USAGE.md) - Detailed usage instructions
- [PowerPoint Structure](docs/STRUCTURE.md) - Slide setup requirements
- [Examples](docs/EXAMPLES.md) - SRT output examples
- [Full Documentation](docs/INDEX.md) - Complete documentation index

## Features

✅ Color-based text extraction (white/yellow)  
✅ Automatic .ppt to .pptx conversion  
✅ Batch processing of multiple files  
✅ Configurable timing and duration  
✅ Bilingual or separate subtitle modes  
✅ Debug mode for troubleshooting  
✅ Memory efficient for large presentations  

## License

MIT
