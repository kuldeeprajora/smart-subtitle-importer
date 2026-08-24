/*  
    SMART SUBTITLE IMPORTER V2
    CLEAN SINGLE PRECOMP VERSION
*/

(function smartSubtitleImporter(thisObj) {

    function buildUI(thisObj) {

        var win = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "Smart Subtitle Importer", undefined);

        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 10;
        win.margins = 16;

        // STYLE
        var stylePanel = win.add("panel", undefined, "Subtitle Style");
        stylePanel.orientation = "column";
        stylePanel.alignChildren = ["fill", "top"];
        stylePanel.spacing = 6;
        stylePanel.margins = 10;

        var fontGroup = stylePanel.add("group");
        fontGroup.add("statictext", undefined, "Font");
        var fontInput = fontGroup.add("edittext", undefined, "");
        fontInput.characters = 24;
        fontInput.helpTip = "Optional: enter the After Effects font name. Leave blank for default.";

        var sizeScaleGroup = stylePanel.add("group");
        sizeScaleGroup.add("statictext", undefined, "Font Size");
        var fontSizeInput = sizeScaleGroup.add("edittext", undefined, "80");
        fontSizeInput.characters = 6;

        sizeScaleGroup.add("statictext", undefined, "Scale %");
        var scaleInput = sizeScaleGroup.add("edittext", undefined, "100");
        scaleInput.characters = 6;

        var colorGroup = stylePanel.add("group");
        colorGroup.add("statictext", undefined, "Font Color");
        var colorInput = colorGroup.add("edittext", undefined, "#FFFFFF");
        colorInput.characters = 10;
        colorInput.helpTip = "Use hex color, for example #FFFFFF or #FFCC00.";

        // SRT
        var srtGroup = win.add("group");

        var srtPath = srtGroup.add("edittext", undefined, "");
        srtPath.characters = 30;

        var browseBtn = srtGroup.add("button", undefined, "Browse SRT");

        // IN PRESET
        var inGroup = win.add("group");

        var inPath = inGroup.add("edittext", undefined, "");
        inPath.characters = 30;

        var inBtn = inGroup.add("button", undefined, "IN Animation");

        // OUT PRESET
        var outGroup = win.add("group");

        var outPath = outGroup.add("edittext", undefined, "");
        outPath.characters = 30;

        var outBtn = outGroup.add("button", undefined, "OUT Animation");

        // IMPORT
        var importBtn = win.add("button", undefined, "Generate Subtitles");

        browseBtn.onClick = function () {
            var file = File.openDialog("Select SRT File", "*.srt");
            if (file) srtPath.text = file.fsName;
        };

        inBtn.onClick = function () {
            var file = File.openDialog("Select IN Animation Preset", "*.ffx");
            if (file) inPath.text = file.fsName;
        };

        outBtn.onClick = function () {
            var file = File.openDialog("Select OUT Animation Preset", "*.ffx");
            if (file) outPath.text = file.fsName;
        };

        importBtn.onClick = function () {

            var comp = app.project.activeItem;

            if (!(comp instanceof CompItem)) {
                alert("Please select a composition.");
                return;
            }

            var srtFile = new File(srtPath.text);

            if (!srtFile.exists) {
                alert("SRT file not found.");
                return;
            }

            var styleOptions = getStyleOptions(
                fontInput.text,
                fontSizeInput.text,
                scaleInput.text,
                colorInput.text
            );

            if (!styleOptions) {
                return;
            }

            app.beginUndoGroup("Generate Subtitles");

            srtFile.open("r");
            var content = srtFile.read();
            srtFile.close();

            var subtitles = parseSRT(content);

            // CREATE SUBTITLE PRECOMP
            var subtitleComp = app.project.items.addComp(
                "SUBTITLES_PRECOMP",
                comp.width,
                comp.height,
                comp.pixelAspect,
                comp.duration,
                comp.frameRate
            );

            // IMPORT PRECOMP INTO MAIN COMP
            var precompLayer = comp.layers.add(subtitleComp);

            var inPreset = (inPath.text !== "") ? new File(inPath.text) : null;
            var outPreset = (outPath.text !== "") ? new File(outPath.text) : null;

            // CREATE ALL SUBTITLE LAYERS
            for (var i = 0; i < subtitles.length; i++) {

                var sub = subtitles[i];

                var textLayer = subtitleComp.layers.addText(sub.text);

                textLayer.inPoint = sub.start;
                textLayer.outPoint = sub.end;

                // TEXT STYLE
                var textProp = textLayer.property("Source Text");
                var textDoc = textProp.value;

                if (styleOptions.fontName !== "") {
                    try {
                        textDoc.font = styleOptions.fontName;
                    } catch(err){}
                }

                textDoc.fontSize = styleOptions.fontSize;
                textDoc.fillColor = styleOptions.fillColor;
                textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;

                textProp.setValue(textDoc);

                textLayer.scale.setValue([
                    styleOptions.scale,
                    styleOptions.scale
                ]);

                // POSITION
                textLayer.position.setValue([
                    comp.width / 2,
                    comp.height - 180
                ]);

                // APPLY IN PRESET
                if (inPreset && inPreset.exists) {
                    try {
                        textLayer.applyPreset(inPreset);
                    } catch(err){}
                }

                // APPLY OUT PRESET
                if (outPreset && outPreset.exists) {
                    try {
                        textLayer.applyPreset(outPreset);
                    } catch(err){}
                }
            }

            alert("All subtitles imported into one clean precomp.");

            app.endUndoGroup();
        };

        return win;
    }

    // STYLE HELPERS

    function getStyleOptions(fontName, fontSizeText, scaleText, colorText) {

        var fontSize = parsePositiveNumber(fontSizeText, "Font Size");
        var scale = parsePositiveNumber(scaleText, "Scale");
        var fillColor = parseColor(colorText);

        if (fontSize === null || scale === null) {
            return null;
        }

        if (!fillColor) {
            alert("Font Color must be a hex value like #FFFFFF.");
            return null;
        }

        return {
            fontName: trimString(fontName),
            fontSize: fontSize,
            scale: scale,
            fillColor: fillColor
        };
    }

    function parsePositiveNumber(value, label) {

        var number = Number(trimString(value));

        if (isNaN(number) || number <= 0) {
            alert(label + " must be a positive number.");
            return null;
        }

        return number;
    }

    function parseColor(value) {

        var text = trimString(value);

        if (text.charAt(0) === "#") {
            text = text.substring(1);
        }

        if (!/^[0-9a-fA-F]{6}$/.test(text)) {
            return null;
        }

        return [
            parseInt(text.substring(0, 2), 16) / 255,
            parseInt(text.substring(2, 4), 16) / 255,
            parseInt(text.substring(4, 6), 16) / 255
        ];
    }

    function trimString(value) {
        return String(value).replace(/^\s+|\s+$/g, "");
    }

    // SRT PARSER

    function parseSRT(data) {

        var subtitles = [];

        var blocks = data.split(/\r?\n\r?\n/);

        for (var i = 0; i < blocks.length; i++) {

            var lines = blocks[i].split(/\r?\n/);

            if (lines.length >= 3) {

                var time = lines[1].split(" --> ");

                subtitles.push({
                    start: convertTime(time[0]),
                    end: convertTime(time[1]),
                    text: lines.slice(2).join("\r")
                });
            }
        }

        return subtitles;
    }

    function convertTime(t) {

        var p = t.replace(",", ":").split(":");

        return (
            Number(p[0]) * 3600 +
            Number(p[1]) * 60 +
            Number(p[2]) +
            Number(p[3]) / 1000
        );
    }

    var panel = buildUI(thisObj);

    if (panel instanceof Window) {
        panel.center();
        panel.show();
    }

})(this);
