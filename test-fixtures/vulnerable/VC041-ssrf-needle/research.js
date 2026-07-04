// SSRF via the `needle` HTTP client — URL assembled from user input and
// fetched with no allowlist. The NodeGoat pattern from the held-out set.
const needle = require("needle");

function ResearchHandler() {
  this.displayResearch = (req, res) => {
    const url = req.query.url + req.query.symbol;
    return needle.get(url, (error, newResponse, body) => {
      if (!error && newResponse.statusCode === 200) res.send(body);
    });
  };
}

module.exports = ResearchHandler;
