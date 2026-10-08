// Generates the SAML service-provider signing certificate for SSO.
// Usage: node scripts/generate-saml-cert.js > saml/sp.pem
const forge = require("node-forge");

const keys = forge.pki.rsa.generateKeyPair({ bits: 1024, e: 0x10001 });
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = "01";
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 5);
const attrs = [{ name: "commonName", value: "app.acme.example" }];
cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey, forge.md.sha256.create());

process.stdout.write(forge.pki.privateKeyToPem(keys.privateKey));
process.stdout.write(forge.pki.certificateToPem(cert));
