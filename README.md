
# Smart Subtitle Importer 

A script for Adobe After Effects that intelligently imports .srt subtitle files and generates animated text layers.

## Features

- Imports .srt subtitle file and parses into individual text layers
- Automatically sets in/out points for each subtitle layer based on .srt timecodes
- Allows applying animation presets to subtitles for IN and OUT animations
- Imports all subtitles into a single clean precomp for easy management
- Built-in SRT parser handles common .srt formats

## How to Use

1. In After Effects, run the `smartSubtitleImporter.jsx` script 
2. Browse and select your .srt subtitle file
3. (Optional) Select animation presets (.ffx) for the subtitle IN and OUT animations
4. Click "Generate Subtitles"
5. All subtitles will be imported into a new precomp named "SUBTITLES_PRECOMP"
6. The precomp is automatically added to your currently active composition

## Tips

- Make sure your active composition is selected before running the script
- IN/OUT animation presets are optional - leave blank for no animation
- Subtitles are centered and positioned near the bottom of the comp by default
- Adjust the default subtitle text style by modifying the script code

## Requirements

- Adobe After Effects CS6 or later
- Tested on Windows, should also work on Mac

## Installation

1. Place `smartSubtitleImporter.jsx` in your After Effects scripts folder:
    - Windows: `Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\`
    - Mac: `/Applications/Adobe After Effects <version>/Scripts/`
2. Restart After Effects if it was open

## License

This script is provided "as is" without any warranty. Feel free to use and modify for personal and commercial projects. Credit is appreciated but not required. 
