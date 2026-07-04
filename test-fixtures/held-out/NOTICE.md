# Held-out benchmark corpus — third-party attribution

These fixtures are excerpts of public, intentionally-vulnerable training
projects that **no XploitScan rule author wrote**. They exist to measure
detection on code the rules were never tuned against. Hint comments that the
source projects include (e.g. `// vuln-code-snippet`) are stripped so the
scanner can't key on them; the vulnerable code itself is faithful to the source.

| Fixture | Source project | File | License |
|---|---|---|---|
| sqli-dvna, cmdi-dvna, xxe-dvna, deserialize-dvna, open-redirect-dvna, idor-dvna | [appsecco/dvna](https://github.com/appsecco/dvna) | core/appHandler.js | MIT |
| sqli-juiceshop | [juice-shop/juice-shop](https://github.com/juice-shop/juice-shop) | routes/login.ts | MIT |
| path-traversal-juiceshop | [juice-shop/juice-shop](https://github.com/juice-shop/juice-shop) | routes/fileServer.ts | MIT |
| jwt-hardcoded-key-juiceshop | [juice-shop/juice-shop](https://github.com/juice-shop/juice-shop) | lib/insecurity.ts | MIT |
| weak-hash-md5-juiceshop | [juice-shop/juice-shop](https://github.com/juice-shop/juice-shop) | lib/insecurity.ts, routes/login.ts | MIT |
| ssti-juiceshop | [juice-shop/juice-shop](https://github.com/juice-shop/juice-shop) | routes/dataErasure.ts | MIT |
| xss-dom-juiceshop | [juice-shop/juice-shop](https://github.com/juice-shop/juice-shop) | frontend/src/app/search-result/search-result.component.ts | MIT |
| eval-nodegoat, ssrf-nodegoat, weak-hash-mongo-nosqli | [OWASP/NodeGoat](https://github.com/OWASP/NodeGoat) | app/routes, app/data | Apache-2.0 |
| proto-pollution-lodash | [kimmobrunfeldt/lodash-merge-pollution-example](https://github.com/kimmobrunfeldt/lodash-merge-pollution-example) | index.js | ISC |

All sources are permissively licensed (MIT / Apache-2.0 / ISC). OWASP
WrongSecrets (AGPL-3.0) was deliberately excluded to avoid copyleft.
