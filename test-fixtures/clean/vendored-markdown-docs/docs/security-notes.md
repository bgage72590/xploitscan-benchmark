# Security notes

Project documentation. Nothing in this file is deployed — the code blocks are
teaching examples showing the wrong way and then the right way. In a 20-repo
field study, 458 findings across VC004, VC104, VC033, VC034, VC009 and VC097
came from markdown like this.

## Don't build SQL by concatenation

The example below is the anti-pattern we are warning contributors about:

```js
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users WHERE name = '" + req.query.name + "'";
  db.execute(query);
});
```

Use a parameterized query instead:

```js
app.get("/users", (req, res) => {
  db.execute("SELECT * FROM users WHERE name = $1", [req.query.name]);
});
```

## Don't shell out with user input

```js
const { exec } = require("child_process");
exec("convert " + req.body.filename + " out.png");
```

## Don't disable TLS verification

```js
const https = require("https");
const agent = new https.Agent({ rejectUnauthorized: false });
```

## Don't log secrets

```js
console.log("Signing with key", process.env.STRIPE_SECRET_KEY);
```
