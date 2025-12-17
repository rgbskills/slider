#!/bin/bash

# Convert .ppt to .pptx using AppleScript (macOS only)
# This script automates PowerPoint to convert the file

if [ -z "$1" ]; then
  echo "Usage: ./convert-ppt.sh input.ppt"
  exit 1
fi

INPUT_FILE="$1"
INPUT_ABS=$(cd "$(dirname "$INPUT_FILE")" && pwd)/$(basename "$INPUT_FILE")
OUTPUT_FILE="${INPUT_ABS%.ppt}.pptx"

echo "Converting $INPUT_ABS to PPTX format..."

osascript <<EOF
tell application "Microsoft PowerPoint"
    activate
    open POSIX file "$INPUT_ABS"
    set thePresentation to active presentation
    save thePresentation in POSIX file "$OUTPUT_FILE" as save as OpenXML presentation
    close thePresentation
end tell
EOF

echo "✓ Converted to: $OUTPUT_FILE"
