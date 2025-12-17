# PPTX to SRT Converter

Converts PowerPoint presentations with colored text to DaVinci Resolve subtitle files.

## Setup

1. **Install Node.js** (if you don't have it): https://nodejs.org
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Add your files** to the `input/` folder
4. **Run conversion**

## Commands

```bash
# Basic conversion (3 seconds per subtitle)
npm run convert -- -f file.pptx

# Custom interval (5 seconds per subtitle)
npm run convert -- -f file.pptx 5

# Spread subtitles between timecodes
npm run convert -- -f file.pptx -s 00:02:43:18 -e 02:20:54:02
```

## How It Works

- Put `.pptx` or `.ppt` files in `input/` folder
- **White text** → Romanian (`.ro.srt`)
- **Yellow text** → English (`.en.srt`)
- Converted files appear in `converted/` folder

## Single File Conversion

```bash
node program/pptx-to-srt.mjs input/file.pptx -d 5
node program/pptx-to-srt.mjs input/file.pptx --start-timecode 00:02:43:18 --end-timecode 02:20:54:02
```

## Timecode Format

Use `HH:MM:SS:FF` format (hours:minutes:seconds:frames at 25fps)

Example: `00:02:43:18` = 2 minutes, 43 seconds, 18 frames

## Requirements

- **White text** (#FFFFFF) for Romanian
- **Yellow text** (#FFFF00) for English
- Text colors must be exact
