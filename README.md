# DOCX Publishing Demo

**Fieldnotes** is an interactive DOCX-to-React publishing prototype by Danny Byrne. A fictional field journal demonstrates how Word paragraphs and lightweight markers become a styled article, quote blocks, callouts, illustrations, and media components.

All sample content and the mountain illustration were created for this demo. The repository starts with fresh Git history and contains no personal source documents, photographs, or prior article content.

## Launch locally

Requires Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite (normally http://127.0.0.1:5173). No accounts, API keys, environment files, or backend are required.

## Try it

1. Read the automatically converted fictional journal.
2. Switch to **HTML** to inspect the conversion output.
3. Download the Word sample, change a paragraph, save it, and select it with **Choose a .docx**.
4. Open the marker guide to explore component syntax.
5. Use **Reset sample** to return to the bundled journal.

`public/samples/Component-Reference.docx` demonstrates every marker, including the optional video component. Choose it using the same file picker.

File conversion happens in browser memory; document contents are not uploaded or persisted. Google Fonts is used for typography with local fallbacks. The optional video component uses a neutral flower sample from [MDN’s video element examples](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video); playback requests an external video host. Other article content and assets are bundled locally.

## Build and deploy

```bash
npm test
npm run build
npm run preview
```

Deploy only `dist/` to a static host. The build uses relative asset paths, so it can also live under a portfolio subdirectory. No client-side routing or special server rewrites are needed.

## Pipeline

```text
DOCX → Mammoth HTML → paragraph cleanup → allowed elements and marker mapping → React
```

- `src/conversion.mjs`: normalize escaped markers and surrounding Word paragraphs.
- `src/render.mjs`: map markers to React and allow only supported HTML elements.
- `src/main.jsx`: sample loading, local file conversion, HTML inspector, reset, and feedback.
- `public/samples/`: new fictional Word documents.
- `public/images/`: original SVG illustration and no personal photos.
- `tests/publishing.test.mjs`: real fixture conversion, mapping, cleanup, unsafe markup handling, and invalid documents.

The rendering layer discards document-provided HTML attributes, arbitrary image sources, executable elements, and unsupported link schemes. Images are resolved from a local ID registry. The file picker limits documents to 10 MB. This is a local publishing demonstration, not a hardened arbitrary-document processing service; very large expanded documents can still consume browser resources.

## Markers

Type these as literal text in Word:

```html
<div id=quote>A quotation.</div>
<div id=info>A useful note.</div>
<img id=ridge />
<div id=datestamp>FIELD JOURNAL / FICTIONAL SAMPLE</div>
<div id=horizontalLine></div>
<div id=video></div>
```

Quote and info markers can span multiple paragraphs. The date marker renders the text supplied by the document. The video marker selects a neutral external sample; it does not accept arbitrary embed URLs. Add local image IDs in `src/render.mjs` to extend the illustration registry.

To regenerate the fixtures, install `python-docx` in a Python environment and run `python scripts/make-samples.py`. Generation clears document author fields. This is optional: the checked-in fixtures are sufficient to run and test the app.

## Scope

This prototype focuses on semantic content transformation and reusable components. It does not reproduce every Word layout, automatically publish to third-party platforms, synchronize a cloud drive, or provide multi-user editing. Unknown markup and unregistered images are omitted or reduced to readable text.
