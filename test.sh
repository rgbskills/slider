#!/bin/bash

# Test script for pptx-to-srt converter
# This script helps verify the tool works correctly

echo "================================"
echo "PPTX to SRT Converter - Test"
echo "================================"
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
node --version
echo ""

# Check if dependencies are installed
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  - Dependencies installed ✓"
else
    echo "  - Dependencies NOT installed ✗"
    echo "  - Run: npm install"
    exit 1
fi
echo ""

# Check if tool is executable
echo "✓ Checking tool..."
if [ -f "pptx-to-srt.mjs" ]; then
    echo "  - pptx-to-srt.mjs found ✓"
else
    echo "  - pptx-to-srt.mjs NOT found ✗"
    exit 1
fi
echo ""

# Test help command
echo "✓ Testing help command..."
node pptx-to-srt.mjs --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  - Help command works ✓"
else
    echo "  - Help command failed ✗"
    exit 1
fi
echo ""

# Check for input file
echo "✓ Checking for input file..."
if [ -f "file.ppt" ]; then
    echo "  - file.ppt found"
    echo "  - WARNING: This is a .ppt file (binary format)"
    echo "  - Tool requires .pptx format"
    echo "  - See CONVERSION.md for conversion instructions"
elif [ -f "file.pptx" ]; then
    echo "  - file.pptx found ✓"
    echo ""
    echo "✓ Running test conversion..."
    node pptx-to-srt.mjs file.pptx --debug --default-duration 4
    echo ""
    
    # Check if output files were created
    if [ -f "subtitles.ro.srt" ] && [ -f "subtitles.en.srt" ]; then
        echo "✓ SUCCESS! Subtitle files created:"
        echo "  - subtitles.ro.srt"
        echo "  - subtitles.en.srt"
        echo ""
        echo "Preview subtitles.en.srt (first 20 lines):"
        head -n 20 subtitles.en.srt
    else
        echo "✗ Output files not created"
        echo "Check debug output above for errors"
    fi
else
    echo "  - No input file found"
    echo "  - Add a file.pptx to test the converter"
fi

echo ""
echo "================================"
echo "Test Complete"
echo "================================"
