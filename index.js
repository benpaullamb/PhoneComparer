const path = require('path');
const express = require('express');
const { searchPhones, getCorePhoneSpecs, getPhoneSpecs } = require('./backend/phones');
const app = express();

app.use(express.static(path.join(__dirname, './public')));

app.get('/search', async (req, res) => {
    const phones = await searchPhones(req.query.s);
    res.json(phones);
});

app.get('/phone', async (req, res) => {
    const specs = await getCorePhoneSpecs(req.query.url);
    res.json(specs);
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(80, () => {
    console.log('http://localhost');
});