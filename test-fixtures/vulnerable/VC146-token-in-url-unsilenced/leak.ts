// Token in URL with NO silencer — VC146 must detect this.
const apiKey = process.env.API_KEY;
const url = `https://api.example.com/data?api_key=${apiKey}`;
fetch(url);
