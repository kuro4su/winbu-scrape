const cheerio = require('cheerio');
const { createAxiosInstance } = require('../services/axios.service');
const { parseLink, extractPagination } = require('../utils/helpers');
const { BASE_URL } = require('../config/constants');

const axios = createAxiosInstance();

/**
 * Search for content by keyword
 * @param {string} query - Search query keyword
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<object>} Search results with pagination
 */
async function searchContent(query, page = 1) {
    // Build URL with query params
    const url = page === 1
        ? `${BASE_URL}/?s=${encodeURIComponent(query)}`
        : `${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const results = [];

    // Parse search results
    $('.movies-list .a-item').each((i, element) => {
        const title = $(element).find('.judul').text().trim();
        const rawLink = $(element).find('a.ml-mask').attr('href');
        const linkData = parseLink(rawLink);
        const image = $(element).find('img.mli-thumb').attr('src');

        // Get type (Series/Film/etc)
        let type = 'unknown';
        $(element).find('.mli-mvi-x').each((j, info) => {
            const text = $(info).text().trim();
            if (text.includes('Series') || text.includes('Film')) {
                type = text.replace(/\s+/g, ' ').split(' ')[0].toLowerCase();
            }
        });

        // Get release date
        let releaseDate = '';
        $(element).find('.mli-mvi-x').each((j, info) => {
            const text = $(info).text().trim();
            if (text.match(/\d{4}-\d{2}-\d{2}/)) {
                releaseDate = text.replace(/\s+/g, '');
            }
        });

        // Get description
        const description = $(element).find('.mli-desc').text().trim();

        if (title) {
            results.push({
                title,
                type: linkData.slug || type,
                id: linkData.id,
                link: linkData.original,
                image,
                release_date: releaseDate,
                description
            });
        }
    });

    // Extract pagination info
    const pagination = extractPagination($, page);

    return {
        query,
        results,
        pagination
    };
}

module.exports = {
    searchContent
};
