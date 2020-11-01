const got = require('got');
const cheerio = require('cheerio');
const getProcessors = require('./processors');

async function searchPhones(search) {
    const query = search.toLowerCase().trim().split(' ').join('+');

    let body;
    try {
        const res = await got(`https://www.gsmarena.com/res.php3?sSearch=${query}`);
        body = res.body;
    } catch(err) {
        return [];
    }
    const $ = cheerio.load(body);

    const items = $('#review-body ul li');
    const phones = items.map(function() {
        const item = $(this);

        const namePieces = item.find('span').contents().map(function() {
            return $(this).text().trim();
        });
        const name = namePieces.get().filter(string => string).join(' ')

        return {
            name,
            url: `https://www.gsmarena.com/${item.find('a').attr('href')}`,
            img: item.find('img').attr('src')
        };
    });

    return phones.get();
}

async function getPhoneSpecs(phoneUrl) {
    let body;
    try {
        const res = await got(phoneUrl);
        body = res.body;
    } catch(err) {
        return {};
    }
    const $ = cheerio.load(body);

    const phone = {};

    phone['Name'] = $('h1.specs-phone-name-title').text().trim();
    phone['Photo'] = $('.specs-photo-main img').attr('src');

    const sections = $('#specs-list table');
    sections.each(function() {
        const section = $(this);
        const rows = section.find('tbody tr');
        
        const sectionName = rows.find('th').text().trim();
        phone[sectionName] = {};
        
        let prevTitle = '';
        rows.each(function() {
            const cells = $(this);
            const title = cells.find('td.ttl').text().trim();
            const info = cells.find('td.nfo').text().trim();

            if(!info) return;

            if(!title) return phone[sectionName][prevTitle] += ', ' + info;
            
            phone[sectionName][title] = info;
            prevTitle = title;
        });
    });

    const processorRank = await getProcessorRank(phone['Platform']['Chipset']);
    phone['Platform'] = {
        ...phone['Platform'],
        ...processorRank
    };

    return phone;
}

async function getProcessorRank(chipset) {
    const processors = await getProcessors();
    const cpuName = chipset.split('(')[0].trim().toLowerCase();
    return processors.find(processor => processor['Processor'].toLowerCase() === cpuName);
}

async function getCorePhoneSpecs(url) {
    const specs = await getPhoneSpecs(url);

    specs['Network'] = undefined;
    
    specs['Launch']['Announced'] = undefined;
    
    specs['Body']['Dimensions'] = undefined;
    specs['Body']['SIM'] = undefined;

    // specs['Platform']['Chipset'] = undefined;
    specs['Platform']['CPU'] = undefined;
    specs['Platform']['AnTuTu'] = undefined;
    specs['Platform']['GeekBench'] = undefined;
    specs['Platform']['Brand'] = undefined;

    specs['Memory']['Card slot'] = undefined;

    specs['Comms']['WLAN'] = undefined;
    specs['Comms']['Bluetooth'] = undefined;
    specs['Comms']['GPS'] = undefined;
    specs['Comms']['Radio'] = undefined;

    specs['Misc']['Colors'] = undefined;
    specs['Misc']['Models'] = undefined;

    specs['Tests']['Performance'] = undefined;
    specs['Tests']['Display'] = undefined;
    specs['Tests']['Camera'] = undefined;
    specs['Tests']['Loudspeaker'] = undefined;
    specs['Tests']['Audio quality'] = undefined;

    return specs;
}

module.exports = {
    searchPhones,
    getPhoneSpecs,
    getCorePhoneSpecs
};