# PPTX to SRT Converter - Complete Documentation Index

## 📚 Documentation Files

### 🚀 Start Here
1. **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide to get running in minutes
2. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview and features

### 📖 Detailed Documentation  
3. **[README.md](README.md)** - Full documentation with all features and options
4. **[STRUCTURE.md](STRUCTURE.md)** - PowerPoint structure requirements and examples
5. **[EXAMPLES.md](EXAMPLES.md)** - SRT output examples and DaVinci Resolve import guide

### 🔧 Setup & Conversion
6. **[CONVERSION.md](CONVERSION.md)** - How to convert .ppt files to .pptx format
7. **[convert-ppt.sh](convert-ppt.sh)** - macOS script to automate .ppt conversion
8. **[test.sh](test.sh)** - Test script to verify installation

### 💻 Core Files
9. **[pptx-to-srt.mjs](pptx-to-srt.mjs)** - Main converter script (executable)
10. **[package.json](package.json)** - Node.js dependencies configuration

---

## 🎯 Quick Navigation

**I want to...**

### Convert a file right now
→ [QUICKSTART.md](QUICKSTART.md) - Fastest path to conversion

### Understand what this tool does
→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete overview

### Learn all CLI options
→ [README.md](README.md) - Full documentation

### Fix a .ppt file
→ [CONVERSION.md](CONVERSION.md) - Conversion instructions

### Set up my PowerPoint correctly
→ [STRUCTURE.md](STRUCTURE.md) - Slide structure guide

### See example output
→ [EXAMPLES.md](EXAMPLES.md) - SRT file examples

### Test if everything works
→ Run `./test.sh` in terminal

### Get help
→ Run `node pptx-to-srt.mjs --help`

---

## 📋 File Descriptions

| File | Purpose | Type |
|------|---------|------|
| `pptx-to-srt.mjs` | Main converter script | Executable |
| `package.json` | Dependencies config | Config |
| `README.md` | Full documentation | Docs |
| `QUICKSTART.md` | Quick start guide | Docs |
| `PROJECT_SUMMARY.md` | Project overview | Docs |
| `STRUCTURE.md` | PowerPoint guide | Docs |
| `EXAMPLES.md` | Output examples | Docs |
| `CONVERSION.md` | .ppt conversion help | Docs |
| `convert-ppt.sh` | macOS converter | Script |
| `test.sh` | Test/verification | Script |
| `.gitignore` | Git ignore rules | Config |

---

## 🎓 Learning Path

### Beginner
1. Read [QUICKSTART.md](QUICKSTART.md)
2. Convert your .ppt to .pptx ([CONVERSION.md](CONVERSION.md))
3. Run: `node pptx-to-srt.mjs file.pptx`
4. Check [EXAMPLES.md](EXAMPLES.md) to understand output

### Intermediate  
1. Read [README.md](README.md) for all options
2. Learn slide structure in [STRUCTURE.md](STRUCTURE.md)
3. Use `--debug` flag to troubleshoot
4. Experiment with different durations and offsets

### Advanced
1. Review the source code in `pptx-to-srt.mjs`
2. Customize color detection for your needs
3. Add support for additional languages
4. Integrate into your video production workflow

---

## ⚡ Common Commands

```bash
# Install dependencies
npm install

# Convert with defaults
node pptx-to-srt.mjs file.pptx

# Convert with custom duration
node pptx-to-srt.mjs file.pptx --default-duration 5

# Debug mode
node pptx-to-srt.mjs file.pptx --debug

# Bilingual output
node pptx-to-srt.mjs file.pptx --output bilingual

# Custom output name
node pptx-to-srt.mjs file.pptx --out my-subtitles

# With start offset (1 second delay)
node pptx-to-srt.mjs file.pptx --start-offset-ms 1000

# Full custom example
node pptx-to-srt.mjs file.pptx \
  --out output \
  --default-duration 5 \
  --start-offset-ms 2000 \
  --output separate \
  --debug

# Run tests
./test.sh

# Show help
node pptx-to-srt.mjs --help
```

---

## 🔍 Troubleshooting Quick Links

**Problem** → **Solution**

- File won't convert → [CONVERSION.md](CONVERSION.md)
- Colors not detected → [STRUCTURE.md](STRUCTURE.md#troubleshooting-color-detection)
- Wrong output format → [EXAMPLES.md](EXAMPLES.md)
- Need different timing → [README.md](README.md#cli-options)
- Import to Resolve → [EXAMPLES.md](EXAMPLES.md#importing-to-davinci-resolve)
- Tool not working → Run `./test.sh`

---

## 📞 Support

For detailed help, see individual documentation files listed above.

Each file is focused on a specific aspect:
- **Quick answers** → QUICKSTART.md
- **Deep dives** → README.md
- **Examples** → EXAMPLES.md, STRUCTURE.md
- **Problems** → CONVERSION.md, test.sh

---

**Ready to start?** Open [QUICKSTART.md](QUICKSTART.md) and begin converting!
