const { scrapeHome } = require('./src/scrapers/home.scraper');

async function test() {
    try {
        console.log('Starting scrapeHome...');
        const data = await scrapeHome();
        console.log('Scrape result keys:', Object.keys(data));
        console.log('Top 10 Anime count:', data.top10_anime.length);
        console.log('Latest Anime count:', data.latest_anime.length);
        console.log('Top 10 Film count:', data.top10_film.length);
        console.log('Latest Film count:', data.latest_film.length);
        console.log('TV Show count:', data.tv_show.length);
    } catch (error) {
        console.error('Scrape failed:', error);
    }
}

test();
