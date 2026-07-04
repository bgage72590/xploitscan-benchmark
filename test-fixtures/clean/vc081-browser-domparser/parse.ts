// Browser DOMParser — per the HTML/XML spec it does NOT resolve external
// entities, so it is not an XXE sink. VC081 must NOT fire.
export function parseHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent;
}
export function parseXmlSafe(xml: string) {
  return new DOMParser().parseFromString(xml, "application/xml");
}
