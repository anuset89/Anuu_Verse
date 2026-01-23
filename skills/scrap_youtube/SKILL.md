---
name: Scrap YouTube
description: Extract metadata and transcripts from YouTube videos using yt-dlp.
---

# Scrap YouTube Skill

This skill allows you to extract information from YouTube videos without needing a browser or API key. It uses `yt-dlp` locally.

## Features
- **Metadata**: Title, Channel, Description.
- **Transcript**: Downloads and cleans auto-generated or manual subtitles (VTT).

## Usage

```bash
python skills/scrap_youtube/scripts/scraper.py "VIDEO_URL"
```

## Dependencies
- `yt-dlp` (Install via `pip install yt-dlp`)

## output
- Prints Markdown formatted text to stdout.
