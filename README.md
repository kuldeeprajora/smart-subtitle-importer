# Smart Subtitle Importer

Smart Subtitle Importer is an Adobe After Effects ScriptUI panel that converts an SRT subtitle file into timed text layers inside a single subtitle precomposition.

**Project status: Final Draft**

## Features

- Parse standard SRT subtitle blocks and timing information
- Create one text layer per subtitle entry
- Set every subtitle layer's in and out points from the SRT timecodes
- Place all generated subtitle layers in a clean `SUBTITLES_PRECOMP`
- Match the subtitle precomp's size, duration, pixel aspect, and frame rate to the active composition
- Add the generated subtitle precomp to the active composition automatically
- Configure font name, font size, scale, and six-digit hex text color
- Center-align subtitles near the bottom of the frame
- Optionally apply After Effects `.ffx` presets for IN and OUT animation
- Generate the complete subtitle setup inside one After Effects undo group

## Installation

Copy `smartSubtitleImporter.jsx` into the After Effects `Scripts/ScriptUI Panels` directory.

- Windows: `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\`
- macOS: `/Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/`

Restart After Effects, then open **Window > Smart Subtitle Importer**.

## Usage

1. Open the composition that should receive the subtitles.
2. Open **Smart Subtitle Importer** from the Window menu.
3. Enter an optional After Effects font name, plus the font size, scale, and hex color.
4. Click **Browse SRT** and select a standard `.srt` file.
5. Optionally choose `.ffx` files using **IN Animation** and **OUT Animation**.
6. Click **Generate Subtitles**.

The tool creates `SUBTITLES_PRECOMP`, adds all timed subtitle layers to it, and inserts that precomp into the active composition.

## SRT Expectations

Each subtitle block should contain an index, a timing line in the form `HH:MM:SS,mmm --> HH:MM:SS,mmm`, and one or more text lines. Blocks should be separated by a blank line.

Example:

```srt
1
00:00:01,000 --> 00:00:03,500
First subtitle line

2
00:00:04,000 --> 00:00:06,000
Second subtitle line
```

## Status

**Final Draft.** The current functionality is accepted and no further feature changes are planned before release. The repository remains private until the decision is made to publish it.
