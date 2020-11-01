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

    phone.name = $('h1.specs-phone-name-title').text().trim();

    const sections = $('#specs-list table');
    sections.each(function() {
        const section = $(this);
        const rows = section.find('tbody tr');
        
        const sectionName = toCamelCase(rows.find('th').text().trim().toLowerCase());
        phone[sectionName] = {};
        
        let prevTitle = '';
        rows.each(function() {
            const cells = $(this);
            const title = toCamelCase(cells.find('td.ttl').text().trim().toLowerCase());
            const info = cells.find('td.nfo').text().trim();

            if(!info) return;

            if(!title) return phone[sectionName][prevTitle] += ', ' + info;
            
            phone[sectionName][title] = info;
            prevTitle = title;
        });
    });

    const processorRank = await getProcessorRank(phone.platform.chipset);
    phone.platform = {
        ...phone.platform,
        ...processorRank
    };

    return phone;
}

async function getProcessorRank(chipset) {
    const processors = await getProcessors();
    const cpuName = chipset.split('(')[0].trim();
    return processors.find(processor => processor.processor === cpuName);
}

function toCamelCase(text) {
    if(!text.includes(' ')) return text;
    let camel = '';

    text.split(' ').forEach((word, i) => {
        if(i === 0) return camel += word;
        camel += word[0].toUpperCase() + word.substring(1);
    });

    return camel;
}

async function getCorePhoneSpecs(url) {
    const specs = await getPhoneSpecs(url);

    return {
        name: specs.name,
        launchStatus: specs.launch.status,
        body: {
            weight: specs.body.weight,
            build: specs.body.build
        },
        display: specs.display,
        processor: {
            os: specs.platform.os,
            chipset: specs.platform.chipset,
            rank: specs.platform.rank,
            rating: specs.platform.rating,
            cores: specs.platform.cores,
            clock: specs.platform.clock,
            gpu: specs.platform.gpu
        },
        memory: specs.memory.internal,
        mainCamera: specs.mainCamera,
        selfieCamera: specs.selfieCamera,
        headphoneJack: specs.sound['3.5mmJack'],
        comms: {
            nfc: specs.comms.nfc,
            usb: specs.comms.usb
        },
        sensors: specs.features.sensors,
        battery: specs.battery,
        price: specs.misc.price,
        batteryLife: specs.tests.batteryLife
    };
}

module.exports = {
    searchPhones,
    getPhoneSpecs,
    getCorePhoneSpecs
};