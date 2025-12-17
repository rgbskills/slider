# PPTX to SRT Converter

Converts PowerPoint presentations with colored text to DaVinci Resolve subtitle files.

## Setup

1. **Install Node.js**: https://nodejs.org
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Add files** to `input/` folder
4. **Run conversion**

## Commands

```bash
# Spread subtitles between timecodes (HH:MM:SS:FF format)
npm run convert -- -f file.pptx -s 00:02:43:18 -e 02:20:54:02

# Fixed interval (seconds per subtitle)
npm run convert -- -f file.pptx 5

# Default interval (3 seconds)
npm run convert -- -f file.pptx
```

## How It Works

- Put `.pptx` or `.ppt` files in `input/` folder
- **White text** (#FFFFFF) → Romanian (`.ro.srt`)
- **Yellow text** (#FFFF00) → English (`.en.srt`)
- **Auto-converts** `.ppt` to `.pptx` if needed
- Converted files appear in `converted/` folder

## Timecode Format

`HH:MM:SS:FF` (hours:minutes:seconds:frames at 25fps)

Example: `00:02:43:18` = 2 minutes, 43 seconds, 18 frames

## Advanced Usage

```bash
# Single file with custom options
node program/pptx-to-srt.mjs input/file.pptx --start-timecode 00:02:43:18 --end-timecode 02:20:54:02
node program/pptx-to-srt.mjs input/file.pptx -d 5
node program/pptx-to-srt.mjs input/file.pptx --debug
```
