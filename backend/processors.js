const got = require('got');
const cheerio = require('cheerio');

module.exports = async function() {
    let body;
    try {
        const res = await got('https://nanoreview.net/en/soc-list/rating');
        body = res.body;
    } catch(err) {
        return [];
    }
    const $ = cheerio.load(body);
    
    const rows = $('table.table-list tbody tr');
    const processors = rows.map(function() {
        
        const cells = $(this).children();
        const data = cells.map(function() {
            return $(this).text().trim();
        });

        return {
            rank: Number(data[0]),
            processor: data[1],
            rating: Number(data[2]),
            anTuTu: data[3] === '-' ? -1 : Number(data[3]),
            geekBench: data[4],
            cores: Number(data[5].split(' ')[0]),
            clock: Number(data[6].split(' ')[0]),
            brand: data[7]
        };
    });

    return processors.get();
};