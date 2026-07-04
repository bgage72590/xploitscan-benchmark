// NNN-NN-NNNN-shaped values that must NOT trigger VC212:
//  - the canonical placeholder SSN (excluded by value)
//  - a value with no SSN-named context
//  - a structurally-invalid SSN (area 000)
const ssn = "123-45-6789";                  // canonical placeholder → excluded
const placeholderSsn = "123-45-6789";       // same placeholder
const productCode = "800-12-3456";          // SSN shape but no ssn/social/taxpayer context
const invalid = { ssn: "000-12-3456" };     // ssn-named but area 000 is never a valid SSN

module.exports = { ssn, placeholderSsn, productCode, invalid };
