# PPTX to SRT Converter - Quick Start

## Summary

✅ **Tool Created**: `pptx-to-srt.mjs`  
✅ **Dependencies Installed**: jszip, fast-xml-parser  
✅ **Documentation**: README.md with full instructions

## Your File Issue

Your `file.ppt` is in the **older binary format**. The tool needs `.pptx` (Office Open XML).

### Convert Your File

**Easiest Option - Google Slides (No software needed):**
1. Go to https://slides.google.com
2. Upload `file.ppt`  
3. File → Download → Microsoft PowerPoint (.pptx)
4. Save as `file.pptx`

**Alternative - LibreOffice (Free software):**
```bash
# Install LibreOffice
brew install --cask libreoffice

# Convert
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pptx file.ppt
```

## How to Use (After Conversion)

### Basic Usage
```bash
node pptx-to-srt.mjs file.pptx
```
Creates: `subtitles.ro.srt` and `subtitles.en.srt`

### With Custom Settings
```bash
node pptx-to-srt.mjs file.pptx \
  --out output \
  --default-duration 5 \
  --output separate \
  --debug
```

### Bilingual Mode
```bash
node pptx-to-srt.mjs file.pptx --output bilingual
```
Creates one file with both languages per subtitle

## Options

- `--out <name>` - Output filename base (default: subtitles)
- `--default-duration <sec>` - Duration per slide in seconds (default: 4)
- `--start-offset-ms <ms>` - Start delay in milliseconds (default: 0)
- `--output separate|bilingual` - Output mode (default: separate)
- `--debug` - Show what's being extracted from each slide
- `--help` - Show all options

## What The Tool Does

1. ✅ Reads your PPTX file
2. ✅ Extracts text based on color:
   - **White text** (#FFFFFF) → Romanian (ro)
   - **Yellow text** (#FFFF00, #FFC000) → English (en)
3. ✅ Uses slide timing from PPTX if available
4. ✅ Falls back to default duration (4 seconds)
5. ✅ Generates SRT files for DaVinci Resolve

## File Structure Created

```
slider/
├── pptx-to-srt.mjs      # Main converter script
├── package.json          # Dependencies
├── README.md             # Full documentation
├── CONVERSION.md         # .ppt → .pptx conversion help
├── QUICKSTART.md         # This file
├── convert-ppt.sh        # macOS PowerPoint converter script
├── .gitignore
└── file.ppt             # Your original file (needs conversion)
```

## Testing

After converting to `.pptx`, test with debug mode:

```bash
node pptx-to-srt.mjs file.pptx --debug
```

This shows:
- Each slide number
- Romanian text extracted
- English text extracted  
- Duration used

## Need Help?

See `README.md` for:
- Full CLI options
- Troubleshooting guide
- Color detection details
- Output format specification
