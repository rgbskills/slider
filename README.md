# PPTX to SRT Converter

Convert PowerPoint presentations with bilingual subtitles to DaVinci Resolve SRT subtitle format.

## Features

- ✅ Extracts subtitles from PPTX slides based on text color
- ✅ Supports Romanian (white text) and English (yellow text) by default
- ✅ Reads slide timing from PPTX when available
- ✅ Configurable default duration for slides without timing
- ✅ Two output modes: separate SRT files or bilingual SRT
- ✅ Handles large presentations efficiently
- ✅ Debug mode for troubleshooting

## Installation

```bash
npm install
```

This installs:
- `jszip` - for reading PPTX files
- `fast-xml-parser` - for parsing PowerPoint XML

## Usage

### Basic Usage

```bash
node pptx-to-srt.mjs file.pptx
```

This creates:
- `subtitles.ro.srt` (white/Romanian text)
- `subtitles.en.srt` (yellow/English text)

### With Options

```bash
node pptx-to-srt.mjs file.pptx --out output --default-duration 5 --output separate
```

### Bilingual Mode

```bash
node pptx-to-srt.mjs file.pptx --output bilingual
```

Creates a single SRT file with both languages:
```
1
00:00:00,000 --> 00:00:04,000
English subtitle text
Romanian subtitle text
```

### Full Example

```bash
node pptx-to-srt.mjs presentation.pptx \
  --out subtitles \
  --default-duration 4 \
  --start-offset-ms 1000 \
  --min-duration-ms 500 \
  --lang1 ro \
  --lang2 en \
  --output separate \
  --debug
```

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--out, -o <name>` | Output base name | `subtitles` |
| `--default-duration <seconds>` | Default duration per slide | `4` |
| `--start-offset-ms <ms>` | Global start offset in milliseconds | `0` |
| `--min-duration-ms <ms>` | Minimum duration per slide | `500` |
| `--lang1 <code>` | Language code for white text | `ro` |
| `--lang2 <code>` | Language code for yellow text | `en` |
| `--output <mode>` | Output mode: `separate` or `bilingual` | `separate` |
| `--debug` | Print debug information | `false` |
| `--help, -h` | Show help message | - |

## How It Works

1. **Reads PPTX structure**: Opens the PPTX file as a ZIP archive
2. **Gets slide order**: Reads `presentation.xml` for correct slide sequence
3. **Parses each slide**: Extracts text runs and their colors from slide XML
4. **Color detection**: 
   - White text (`#FFFFFF`) → Language 1 (Romanian)
   - Yellow text (`#FFFF00`, `#FFC000`, etc.) → Language 2 (English)
5. **Timing**: Uses slide timing from PPTX or default duration
6. **Generates SRT**: Creates properly formatted subtitle files

## Color Detection

The tool reads color information from PPTX XML in this order:

1. `a:rPr/a:solidFill/a:srgbClr/@val` - Direct RGB color
2. `a:rPr/a:solidFill/a:schemeClr` - Theme colors (fallback)

Supported colors:
- **White**: `#FFFFFF` (Romanian)
- **Yellow**: `#FFFF00`, `#FFC000`, `#FFD700` (English)

## Requirements

- Node.js 14+ (uses ES modules)
- Valid PPTX file with colored text runs

## Working with .ppt Files

This tool requires the modern `.pptx` format (Office Open XML). If you have an older `.ppt` file:

### Option 1: Convert with PowerPoint (macOS)

Use the included conversion script:

```bash
./convert-ppt.sh file.ppt
```

This uses AppleScript to automate Microsoft PowerPoint on macOS.

### Option 2: Manual Conversion

1. Open the `.ppt` file in PowerPoint
2. File → Save As
3. Choose format: "PowerPoint Presentation (.pptx)"
4. Save

### Option 3: Use LibreOffice (Free)

```bash
# Install LibreOffice first: brew install libreoffice
soffice --headless --convert-to pptx file.ppt
```

## Output Format

Standard SRT format compatible with DaVinci Resolve:

```srt
1
00:00:00,000 --> 00:00:04,000
First subtitle text

2
00:00:04,000 --> 00:00:08,000
Second subtitle text
```

## Troubleshooting

### No text extracted

Use `--debug` flag to see what's being detected:

```bash
node pptx-to-srt.mjs file.pptx --debug
```

This shows:
- Slide numbers
- Extracted text for each language
- Colors detected
- Duration used

### Wrong language assignment

Check the actual text colors in PowerPoint:
1. Select the text
2. Check Font Color in the ribbon
3. Ensure white text is `#FFFFFF` and yellow is `#FFFF00` or `#FFC000`

### Missing slides

The tool processes slides in presentation order. If slides are missing:
- Check that the PPTX file isn't corrupted
- Verify slides contain text with the expected colors
- Run with `--debug` to see which slides are processed

## License

MIT
