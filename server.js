const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const DOMAIN = `http://localhost:${PORT}`;
const DB_PATH = './urls.json';

app.use(express.static('public'));
app.use(express.json());

if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '{}');

app.post('/shorten', (req, res) => {
    const { originalURL } = req.body;
    let data = JSON.parse(fs.readFileSync(DB_PATH));

    // URL Validation
    try {
        new URL(originalURL);
    } catch {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    // Already used?
    const found = Object.entries(data).find(([short, long]) => long === originalURL);
    if (found) return res.status(400).json({ error: 'URL already shortened', short: found[0] });

    // Generate unique short
    let short;
    do {
        short = Math.random().toString(36).substring(2, 10);
    } while (data[short]);

    data[short] = originalURL;
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    res.json({ short });
});

app.get('/:short', (req, res) => {
    const short = req.params.short;
    const data = JSON.parse(fs.readFileSync(DB_PATH));

    if (data[short]) return res.redirect(data[short]);
    res.send(`<h2 style="text-align:center;padding:50px;color:red;">The Short URL is Invalid,<br>go to <a href='${DOMAIN}'>${DOMAIN}</a> to make one.</h2>`);
});

app.listen(PORT, () => console.log(`🔗 Raqkid Shortener running on ${DOMAIN}`));
