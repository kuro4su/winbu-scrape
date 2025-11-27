const cheerio = require('cheerio');
const { createAxiosInstance } = require('../services/axios.service');
const { parseLink, extractPagination } = require('../utils/helpers');
const { BASE_URL } = require('../config/constants');

const axios = createAxiosInstance();

/**
 * Scrape catalog/list page with filters
 * @param {number} page - Page number
 * @param {object} filters - Filter options
 * @returns {Promise<object>} Catalog data
 */
async function scrapeCatalog(page = 1, filters = {}) {
    const {
        title = '',
        status = '',
        type = '',
        order = 'latest',
        genre = []
    } = filters;

    // Construct URL
    let url = `${BASE_URL}/daftar-anime-2/`;

    if (page > 1) {
        url += `page/${page}/`;
    }

    const params = new URLSearchParams();
    params.append('order', order);
    params.append('status', status);
    params.append('type', type);

    if (title) {
        params.append('title', title);
    }

    // Handle array of genres
    // Note: URLSearchParams doesn't handle array with [] suffix automatically in the way PHP/WordPress expects somedurations
    // But axios params serializer can handle it, or we append manually.
    // The target site uses `genre[]=action&genre[]=drama`

    // We'll construct the query string manually for full control or use a custom serializer if needed.
    // Let's append manually to the URL object if we were using one, but here we are building string.

    let queryString = params.toString();

    if (Array.isArray(genre) && genre.length > 0) {
        genre.forEach(g => {
            queryString += `&genre[]=${encodeURIComponent(g)}`;
        });
    } else if (typeof genre === 'string' && genre) {
        queryString += `&genre[]=${encodeURIComponent(genre)}`;
    }

    const fullUrl = `${url}?${queryString}`;

    console.log(`Scraping catalog: ${fullUrl}`);

    try {
        const response = await axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const items = [];

        $('#movies .ml-item').each((i, element) => {
            const title = $(element).find('.judul').text().trim();
            const rawLink = $(element).find('a.ml-mask').attr('href');
            const linkData = parseLink(rawLink);
            const image = $(element).find('img.mli-thumb').attr('src');
            
            if (title) {
                items.push({
                    title,
                    image,
                    type: linkData.slug,
                    id: linkData.id,
                    link: linkData.original
                });
            }
        });

        const pagination = extractPagination($, page);

        return {
            data: items,
            pagination
        };
    } catch (error) {
        console.error(`Error scraping catalog: ${error.message}`);
        return {
            data: [],
            pagination: {
                current_page: page,
                has_next_page: false,
                has_prev_page: false,
                total_pages: 1
            }
        };
    }
}

module.exports = {
    scrapeCatalog
};
