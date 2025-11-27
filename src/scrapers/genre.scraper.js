const cheerio = require('cheerio');
const { createAxiosInstance } = require('../services/axios.service');
const { parseLink } = require('../utils/helpers');
const { BASE_URL } = require('../config/constants');

const axios = createAxiosInstance();


/**
 * Scrape list of all genres from home page sidebar
 * @returns {Promise<Array>} Array of {name, slug, count}
 */
async function scrapeGenres() {
    try {
        const { data: html } = await axios.get(BASE_URL);
        const $ = cheerio.load(html);
        const genres = [];

        $('#sidebar ul.years.genres li').each((_, element) => {
            const $link = $(element).find('a');
            const href = $link.attr('href');
            const name = $link.text().trim().replace(/\s*\(\d+\)/, ''); // Remove count from name
            const count = $link.find('span').text().trim().replace(/[()]/g, ''); // Extract count

            if (href) {
                // Extract slug from URL: https://winbu.tv/genre/action/ -> action
                const slug = href.split('/genre/')[1]?.replace(/\/$/, '');

                if (slug && name) {
                    genres.push({
                        name: name.trim(),
                        slug: slug.trim(),
                        count: parseInt(count) || 0
                    });
                }
            }
        });

        return genres;
    } catch (error) {
        console.error('Error scraping genres:', error.message);
        return [];
    }
}

/**
 * Scrape content filtered by genre
 * @param {string} slug - Genre slug (e.g., 'action', 'drama')
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} {items, pagination}
 */
async function scrapeGenreContent(slug, page = 1) {
    try {
        const path = page === 1
            ? `/genre/${slug}/`
            : `/genre/${slug}/page/${page}/`;

        const url = `${BASE_URL}${path}`;
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        const items = [];

        // Parse content items (same structure as other list pages)
        $('.movies-list .ml-item').each((_, element) => {
            const $item = $(element);
            const $link = $item.find('a.ml-mask');
            const href = $link.attr('href');

            if (!href) return;

            const { type, id } = parseLink(href);
            const title = $link.attr('title') || $item.find('.judul').text().trim();
            const image = $item.find('img.mli-thumb').attr('src');
            const views = $item.find('.mli-mvi').text().trim();
            const time = $item.find('.mli-waktu').text().trim();

            // Get hidden info
            const $info = $item.find('.info-hidden');
            const rating = parseFloat($info.attr('data-rating')) || 0;
            const episode = parseInt($info.attr('data-episode')) || 0;

            items.push({
                id,
                type,
                title,
                image,
                views,
                time,
                rating,
                episode_count: episode
            });
        });

        // Extract pagination
        const pagination = {
            current_page: page,
            has_next_page: false,
            has_prev_page: page > 1,
            next_page: null,
            prev_page: page > 1 ? page - 1 : null,
            total_pages: 1
        };

        // Get total pages from pagination numbers (more reliable)
        let maxPage = 1;
        $('nav .pagination li a').each((_, el) => {
            const text = $(el).text().trim();
            const pageNum = parseInt(text);
            if (!isNaN(pageNum) && pageNum > maxPage) {
                maxPage = pageNum;
            }
        });

        if (maxPage > 1) {
            pagination.total_pages = maxPage;
        }

        // Set next page based on current vs total
        if (page < pagination.total_pages) {
            pagination.has_next_page = true;
            pagination.next_page = page + 1;
        }

        return {
            genre: slug,
            data: items,
            pagination
        };
    } catch (error) {
        console.error(`Error scraping genre ${slug} page ${page}:`, error.message);
        return {
            genre: slug,
            data: [],
            pagination: {
                current_page: page,
                has_next_page: false,
                has_prev_page: false,
                next_page: null,
                prev_page: null,
                total_pages: 1
            }
        };
    }
}

module.exports = {
    scrapeGenres,
    scrapeGenreContent
};
