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
            'Rank': Number(data[0]),
            'Processor': data[1],
            'Rating': Number(data[2]),
            'AnTuTu': data[3] === '-' ? -1 : Number(data[3]),
            'GeekBench': data[4],
            'Cores': Number(data[5].split(' ')[0]),
            'Clock': Number(data[6].split(' ')[0]),
            'Brand': data[7]
        };
    });

    return processors.get();
};