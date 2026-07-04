// Adapted from OWASP/NodeGoat app/routes/research.js (Apache-2.0). See NOTICE.
const needle = require('needle');
function ResearchHandler () {
  this.displayResearch = (req, res, next) => {
    const url = req.query.url + req.query.symbol;
    return needle.get(url, (error, newResponse, body) => {
      if (!error && newResponse.statusCode === 200) res.send(body);
    });
  };
}
module.exports = ResearchHandler;
