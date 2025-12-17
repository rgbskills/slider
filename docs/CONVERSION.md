# Converting .ppt to .pptx

Your file `file.ppt` is in the older binary PowerPoint format. This tool requires the modern `.pptx` format.

## Quick Conversion Options

### Option 1: Google Slides (Free, Online)
1. Go to https://slides.google.com
2. Upload `file.ppt`
3. File → Download → Microsoft PowerPoint (.pptx)

### Option 2: Microsoft PowerPoint
1. Open `file.ppt` in PowerPoint
2. File → Save As → Format: PowerPoint Presentation (.pptx)

### Option 3: LibreOffice (Free, Offline)
```bash
# Install LibreOffice
brew install --cask libreoffice

# Convert the file
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pptx file.ppt --outdir .
```

### Option 4: Online Converters
- https://cloudconvert.com/ppt-to-pptx
- https://www.zamzar.com/convert/ppt-to-pptx/

## After Conversion

Once you have `file.pptx`, run:
```bash
node pptx-to-srt.mjs file.pptx
```
