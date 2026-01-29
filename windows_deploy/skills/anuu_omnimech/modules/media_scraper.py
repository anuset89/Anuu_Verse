#!/usr/bin/env python3
import sys
import json
import yt_dlp
import os
import glob
import re

def clean_vtt(vtt_content):
    """
    Simple cleaner for VTT files to extract text.
    Removes headers, timestamps, and duplicates.
    """
    lines = vtt_content.splitlines()
    text_lines = []
    seen = set()
    
    for line in lines:
        line = line.strip()
        # Skip empty lines, headers, timestamps, and metadata
        if not line: continue
        if line.startswith('WEBVTT'): continue
        if line.startswith('Kind:'): continue
        if line.startswith('Language:'): continue
        if '-->' in line: continue
        if line.startswith('<c>'): continue # specific styling
        
        # Remove tags like <00:00:00.000>
        line = re.sub(r'<[^>]+>', '', line)
        
        # Youtube VTT often has duplicates for moving captions, simple dedup
        if line in seen: continue
        
        seen.add(line)
        text_lines.append(line)
        
    return "\n".join(text_lines)

def get_video_data(url):
    # Use a specific filename template to make it easy to find
    output_template = 'temp_video_%(id)s'
    
    ydl_opts_base = {
        'skip_download': True,
        'quiet': True,
        'no_warnings': True,
        'outtmpl': output_template,
    }
    
    ydl_opts_subs = ydl_opts_base.copy()
    ydl_opts_subs.update({
        'writesubtitles': True,
        'writeautomaticsub': True,
        'subtitleslangs': ['es', 'en'], 
    })

    transcript_text = "Transcript not available (Download Error / 429)."

    # First try to get metadata ONLY (safer)
    info = None
    with yt_dlp.YoutubeDL(ydl_opts_base) as ydl:
        try:
            info = ydl.extract_info(url, download=False)
        except Exception as e:
            print(f"Error extracting metadata: {e}", file=sys.stderr)
            return None, str(e)
            
    # Then try to download subtitles
    if info:
        try:
            with yt_dlp.YoutubeDL(ydl_opts_subs) as ydl:
                ydl.download([url])
                
                video_id = info['id']
                vtt_files = glob.glob(f"temp_video_{video_id}*.vtt")
                
                if vtt_files:
                    vtt_file = vtt_files[0]
                    for f in vtt_files:
                        if '.es.' in f:
                            vtt_file = f
                            break
                    
                    with open(vtt_file, 'r', encoding='utf-8') as f:
                        transcript_text = clean_vtt(f.read())
                    
                    # Cleanup
                    for f in vtt_files:
                        try:
                            os.remove(f)
                        except:
                            pass
        except Exception as e:
            # If subtitle download fails, we just keep the info we have
            print(f"Warning: Could not download subtitles: {e}", file=sys.stderr)
            
    return info, transcript_text

def format_output(info, transcript):
    if not info:
        return "No information found."

    title = info.get('title', 'Unknown Title')
    channel = info.get('uploader', 'Unknown Channel')
    description = info.get('description', 'No description available.')
    
    output = f"# {title}\n"
    output += f"**Channel:** {channel}\n\n"
    output += "## Description\n"
    output += f"{description}\n\n"
    output += "## Transcript\n"
    output += f"{transcript}\n"
    
    return output

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python youtube_scraper.py <video_url>")
        sys.exit(1)

    url = sys.argv[1]
    info, transcript = get_video_data(url)
    print(format_output(info, transcript))
