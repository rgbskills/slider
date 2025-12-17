# Example SRT Output

This shows what the generated subtitle files will look like.

## Input: PowerPoint Slides

### Slide 1 (4 seconds)
- Yellow: "Welcome to our presentation"
- White: "Bun venit la prezentarea noastră"

### Slide 2 (4 seconds)
- Yellow: "Today we will discuss important topics"
- White: "Astăzi vom discuta subiecte importante"

### Slide 3 (4 seconds)
- Yellow: "Thank you for watching"
- White: "Vă mulțumim că ați urmărit"

## Output: subtitles.en.srt

```srt
1
00:00:00,000 --> 00:00:04,000
Welcome to our presentation

2
00:00:04,000 --> 00:00:08,000
Today we will discuss important topics

3
00:00:08,000 --> 00:00:12,000
Thank you for watching
```

## Output: subtitles.ro.srt

```srt
1
00:00:00,000 --> 00:00:04,000
Bun venit la prezentarea noastră

2
00:00:04,000 --> 00:00:08,000
Astăzi vom discuta subiecte importante

3
00:00:08,000 --> 00:00:12,000
Vă mulțumim că ați urmărit
```

## Bilingual Output (--output bilingual)

```srt
1
00:00:00,000 --> 00:00:04,000
Welcome to our presentation
Bun venit la prezentarea noastră

2
00:00:04,000 --> 00:00:08,000
Today we will discuss important topics
Astăzi vom discuta subiecte importante

3
00:00:08,000 --> 00:00:12,000
Thank you for watching
Vă mulțumim că ați urmărit
```

## With Start Offset (--start-offset-ms 2000)

Adds 2 seconds to all timestamps:

```srt
1
00:00:02,000 --> 00:00:06,000
Welcome to our presentation

2
00:00:06,000 --> 00:00:10,000
Today we will discuss important topics

3
00:00:10,000 --> 00:00:14,000
Thank you for watching
```

## With Custom Duration (--default-duration 5)

Each slide gets 5 seconds instead of 4:

```srt
1
00:00:00,000 --> 00:00:05,000
Welcome to our presentation

2
00:00:05,000 --> 00:00:10,000
Today we will discuss important topics

3
00:00:10,000 --> 00:00:15,000
Thank you for watching
```

## SRT Format Specification

Each subtitle entry has:
1. **Sequence number** (1, 2, 3, ...)
2. **Timestamp** (start --> end)
   - Format: HH:MM:SS,mmm
   - Hours: 00-99
   - Minutes: 00-59
   - Seconds: 00-59
   - Milliseconds: 000-999
3. **Text content** (one or more lines)
4. **Blank line** (separator)

## Importing to DaVinci Resolve

### Method 1: Timeline
1. Open your DaVinci Resolve project
2. Go to Edit page
3. Right-click timeline → Subtitles → Import Subtitle
4. Select the .srt file
5. Adjust position/styling in Inspector

### Method 2: Direct Import
1. File → Import → Subtitle
2. Choose .srt file
3. Drag to timeline

### Tips
- Import English and Romanian to separate tracks
- Use Fusion page for advanced subtitle styling
- Export with subtitles burned in or as separate stream
