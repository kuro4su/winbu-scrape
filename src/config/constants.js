// Base URL untuk scraping
const BASE_URL = 'https://winbu.tv';

// User Agent untuk request
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Port server
const PORT = process.env.PORT || 3000;

module.exports = {
    BASE_URL,
    USER_AGENT,
    PORT
};
