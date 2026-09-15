// Renders a stored note into a standalone HTML file that the user downloads.
// Document fields are written straight into the markup, so anything a user
// typed (or pasted from another account's shared note) runs on open.
// Fixture for VC022 (HTML Export/Render Without Sanitization).

const fs = require("fs");
const path = require("path");

function renderDocument(doc) {
  return `<article class="doc"><h1>${doc.title}</h1><div class="body">${doc.body}</div></article>`;
}

function exportHtmlFile(doc, outDir) {
  const markup = `<!doctype html><meta charset="utf-8"><title>${doc.title}</title><main>${renderDocument(doc)}</main>`;
  const target = path.join(outDir, `${doc.id}.html`);
  fs.writeFileSync(target, markup, "utf8");
  return target;
}

module.exports = { renderDocument, exportHtmlFile };
