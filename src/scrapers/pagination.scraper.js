const cheerio = require('cheerio');
const { createAxiosInstance } = require('../services/axios.service');
const { parseLink, extractPagination } = require('../utils/helpers');
const { BASE_URL } = require('../config/constants');

const axios = createAxiosInstance();

/**
 * Scrape anime donghua section with pagination
 * @param {number} page - Page number
 * @returns {Promise<object>} Anime list with pagination info
 */
async function scrapeAnimeDonghua(page = 1) {
    const url = page === 1
        ? `${BASE_URL}/animedonghua/`
        : `${BASE_URL}/animedonghua/page/${page}/`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const animeTerbaruList = [];

    $('.movies-list-wrap').each((index, section) => {
        const sectionTitle = $(section).find('.list-title h2').text().trim();

        if (sectionTitle.includes('Anime Donghua') || sectionTitle.includes('Latest')) {
            $(section).find('.ml-item').each((i, element) => {
                const title = $(element).find('.judul').text().trim();
                const rawLink = $(element).find('a.ml-mask').attr('href');
                const linkData = parseLink(rawLink);
                const image = $(element).find('img.mli-thumb').attr('src');
                const episode = $(element).find('.mli-episode').text().trim();
                const time = $(element).find('.mli-waktu').text().trim();
                const views = $(element).find('.mli-mvi').text().trim();

                if (title) {
                    animeTerbaruList.push({
                        title,
                        episode,
                        time,
                        views,
                        image,
                        type: linkData.slug,
                        id: linkData.id,
                        link: linkData.original
                    });
                }
            });
        }
    });

    const pagination = extractPagination($, page);

    return {
        pagination,
        data: { latest_anime: animeTerbaruList }
    };
}

/**
 * Scrape film section with pagination
 * @param {number} page - Page number
 * @returns {Promise<object>} Film list with pagination info
 */
async function scrapeFilm(page = 1) {
    const url = page === 1
        ? `${BASE_URL}/film/`
        : `${BASE_URL}/film/page/${page}/`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const latestFilmList = [];

    $('.movies-list-wrap').each((index, section) => {
        const sectionTitle = $(section).find('.list-title h2').text().trim();

        if (sectionTitle.includes('Film') || sectionTitle.includes('Latest')) {
            $(section).find('.ml-item').each((i, element) => {
                const title = $(element).find('.judul').text().trim();
                const rawLink = $(element).find('a.ml-mask').attr('href');
                const linkData = parseLink(rawLink);
                const image = $(element).find('img.mli-thumb').attr('src');
                const time = $(element).find('.mli-waktu').text().trim();
                const views = $(element).find('.mli-info .mli-mvi').text().trim();

                if (title) {
                    latestFilmList.push({
                        title,
                        time,
                        views,
                        image,
                        type: linkData.slug,
                        id: linkData.id,
                        link: linkData.original
                    });
                }
            });
        }
    });

    const pagination = extractPagination($, page);

    return {
        pagination,
        data: { latest_film: latestFilmList }
    };
}

/**
 * Scrape series section with pagination
 * @param {number} page - Page number
 * @returns {Promise<object>} Series list with pagination info
 */
async function scrapeSeries(page = 1) {
    const url = page === 1
        ? `${BASE_URL}/jepangkoreachinabarat/`
        : `${BASE_URL}/jepangkoreachinabarat/page/${page}/`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const seriesList = [];

    $('.movies-list-wrap').each((index, section) => {
        const sectionTitle = $(section).find('.list-title h2').text().trim();

        if (sectionTitle.includes('Jepang Korea China Barat') || sectionTitle.includes('Latest')) {
            $(section).find('.ml-item').each((i, element) => {
                const title = $(element).find('.judul').text().trim();
                const rawLink = $(element).find('a.ml-mask').attr('href');
                const linkData = parseLink(rawLink);
                const image = $(element).find('img.mli-thumb').attr('src');
                const episode = $(element).find('.mli-episode').text().trim();
                const time = $(element).find('.mli-waktu').text().trim();
                const views = $(element).find('.mli-info .mli-mvi').text().trim();

                if (title) {
                    seriesList.push({
                        title,
                        episode,
                        time,
                        views,
                        image,
                        type: linkData.slug,
                        id: linkData.id,
                        link: linkData.original
                    });
                }
            });
        }
    });

    const pagination = extractPagination($, page);

    return {
        pagination,
        data: { series_list: seriesList }
    };
}

/**
 * Scrape TV show section with pagination
 * @param {number} page - Page number
 * @returns {Promise<object>} TV shows list with pagination info
 */
async function scrapeTVShow(page = 1) {
    const url = page === 1
        ? `${BASE_URL}/tv/`
        : `${BASE_URL}/tv/page/${page}/`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const tvShowList = [];

    $('.movies-list-wrap').each((index, section) => {
        const sectionTitle = $(section).find('.list-title h2').text().trim();

        if (sectionTitle.includes('TV Show') || sectionTitle.includes('Latest')) {
            $(section).find('.ml-item').each((i, element) => {
                const title = $(element).find('.judul').text().trim();
                const rawLink = $(element).find('a.ml-mask').attr('href');
                const linkData = parseLink(rawLink);
                const image = $(element).find('img.mli-thumb').attr('src');
                const episode = $(element).find('.mli-episode').text().trim();
                const time = $(element).find('.mli-waktu').text().trim();
                const views = $(element).find('.mli-info .mli-mvi').text().trim();

                if (title) {
                    tvShowList.push({
                        title,
                        episode,
                        time,
                        views,
                        image,
                        type: linkData.slug,
                        id: linkData.id,
                        link: linkData.original
                    });
                }
            });
        }
    });

    const pagination = extractPagination($, page);

    return {
        pagination,
        data: { tv_show_list: tvShowList }
    };
}

/**
 * Scrape others section (Jepang Korea China Barat) with pagination
 * @param {number} page - Page number
 * @returns {Promise<object>} Others list with pagination info
 */
async function scrapeOthers(page = 1) {
    const url = page === 1
        ? `${BASE_URL}/others/`
        : `${BASE_URL}/others/page/${page}/`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const jepangKoreaChinaBaratList = [];

    $('.movies-list-wrap').each((index, section) => {
        const sectionTitle = $(section).find('.list-title h2').text().trim();

        if (sectionTitle.includes('Jepang Korea China Barat') || sectionTitle.includes('Latest')) {
            $(section).find('.ml-item').each((i, element) => {
                const title = $(element).find('.judul').text().trim();
                const rawLink = $(element).find('a.ml-mask').attr('href');
                const linkData = parseLink(rawLink);
                const image = $(element).find('img.mli-thumb').attr('src');
                const episode = $(element).find('.mli-episode').text().trim();
                const time = $(element).find('.mli-waktu').text().trim();
                const views = $(element).find('.mli-info .mli-mvi').text().trim();

                if (title) {
                    jepangKoreaChinaBaratList.push({
                        title,
                        episode,
                        time,
                        views,
                        image,
                        type: linkData.slug,
                        id: linkData.id,
                        link: linkData.original
                    });
                }
            });
        }
    });

    const pagination = extractPagination($, page);

    return {
        pagination,
        data: { jepang_korea_china_barat: jepangKoreaChinaBaratList }
    };
}

module.exports = {
    scrapeAnimeDonghua,
    scrapeFilm,
    scrapeSeries,
    scrapeTVShow,
    scrapeOthers
};
