const cheerio = require('cheerio');
const { createAxiosInstance } = require('../services/axios.service');
const { parseLink } = require('../utils/helpers');
const { BASE_URL } = require('../config/constants');

const axios = createAxiosInstance();

/**
 * Extract generic info (rating, genres, season) from detail page
 * @param {object} $ - Cheerio instance
 * @returns {object} Info object containing rating, season, genres
 */
function extractInfo($) {
    let rating = '-';
    let season = '-';
    let genres = [];

    $('.mli-mvi').each((i, el) => {
        const text = $(el).text();

        if (text.includes('Rating')) {
            rating = $(el).find('span[itemprop="ratingValue"]').text().trim();
        } else if (text.includes('Genre')) {
            $(el).find('a').each((j, a) => {
                genres.push({
                    name: $(a).text().trim(),
                    url: $(a).attr('href')
                });
            });
        } else if ($(el).find('a[rel="tag"]').length > 0 && !text.includes('Genre')) {
            season = $(el).find('a').text().trim();
        }
    });

    return { rating, season, genres };
}

/**
 * Extract episodes list
 * @param {object} $ - Cheerio instance
 * @returns {Array} Array of episodes
 */
function extractEpisodes($) {
    const episodeList = [];

    $('.tvseason .les-content a').each((i, el) => {
        const epTitle = $(el).text().trim();
        const epUrl = $(el).attr('href');
        const epData = parseLink(epUrl);

        episodeList.push({
            title: epTitle,
            id: epData.id,
            link: epUrl
        });
    });

    return episodeList;
}

/**
 * Extract recommendations
 * @param {object} $ - Cheerio instance
 * @returns {Array} Array of recommendations
 */
function extractRecommendations($) {
    const recommendations = [];

    $('.rekom .ml-item-rekom').each((i, element) => {
        const recTitle = $(element).find('.judul').text().trim();
        const recLink = $(element).find('a.ml-mask').attr('href');
        const recImage = $(element).find('img.mli-thumb').attr('src');
        const recRating = $(element).find('.mli-mvi').text().trim();
        const recData = parseLink(recLink);

        if (recTitle) {
            recommendations.push({
                title: recTitle,
                rating: recRating,
                image: recImage,
                type: recData.slug,
                id: recData.id,
                link: recLink
            });
        }
    });

    return recommendations;
}

/**
 * Extract download links
 * @param {object} $ - Cheerio instance
 * @returns {Array} Array of download links grouped by resolution
 */
function extractDownloadLinks($) {
    const downloadLinks = [];

    $('.download-eps ul li').each((i, li) => {
        const resolution = $(li).find('strong').text().trim();
        const links = [];

        $(li).find('span a').each((j, a) => {
            links.push({
                server: $(a).text().trim(),
                url: $(a).attr('href')
            });
        });

        if (resolution) {
            downloadLinks.push({
                resolution,
                links
            });
        }
    });

    return downloadLinks;
}

/**
 * Extract stream options (embed players)
 * @param {object} $ - Cheerio instance
 * @returns {object} Stream options grouped by resolution
 */
function extractStreamOptions($) {
    const streamOptions = {};

    $('.player-modes .dropdown').each((i, dropdown) => {
        const resolution = $(dropdown).find('button').text().trim();

        if (!streamOptions[resolution]) {
            streamOptions[resolution] = [];
        }

        $(dropdown).find('.east_player_option').each((j, el) => {
            const serverName = $(el).find('span').text().trim();
            const post = $(el).attr('data-post');
            const nume = $(el).attr('data-nume');
            const type = $(el).attr('data-type');

            streamOptions[resolution].push({
                server: serverName,
                data_post: post,
                data_nume: nume,
                data_type: type
            });
        });
    });

    return streamOptions;
}

/**
 * Scrape anime detail
 * @param {string} animeId - Anime ID
 * @returns {Promise<object>} Anime detail data
 */
async function scrapeAnimeDetail(animeId) {
    const url = `${BASE_URL}/anime/${animeId}/`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $('div.mli-info .judul').text().trim();
    const image = $('.mli-thumb-box img').attr('src');
    const synopsis = $('.mli-desc').text().trim();

    const info = extractInfo($);
    const episodes = extractEpisodes($);
    const recommendations = extractRecommendations($);

    return {
        title,
        image,
        synopsis,
        info,
        episodes,
        recommendations
    };
}

/**
 * Scrape series detail
 * @param {string} seriesId - Series ID
 * @returns {Promise<object>} Series detail data
 */
async function scrapeSeriesDetail(seriesId) {
    const url = `${BASE_URL}/series/${seriesId}/`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $('div.mli-info .judul').text().trim();
    const image = $('.mli-thumb-box img').attr('src');
    const synopsis = $('.mli-desc').text().trim();

    const info = extractInfo($);
    const episodes = extractEpisodes($);
    const recommendations = extractRecommendations($);

    return {
        title,
        image,
        synopsis,
        info,
        episodes,
        recommendations
    };
}

/**
 * Scrape film detail
 * @param {string} filmId - Film ID
 * @returns {Promise<object>} Film detail data
 */
async function scrapeFilmDetail(filmId) {
    const url = `${BASE_URL}/film/${filmId}/`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $('div.mli-info .judul').text().trim();
    const image = $('.mli-thumb-box img').attr('src');
    const synopsis = $('.mli-desc').text().trim();

    const info = extractInfo($);
    const recommendations = extractRecommendations($);
    const downloads = extractDownloadLinks($);
    const stream_options = extractStreamOptions($);

    return {
        title,
        image,
        synopsis,
        downloads,
        stream_options,
        info: {
            rating: info.rating,
            genres: info.genres
        },
        recommendations
    };
}

module.exports = {
    scrapeAnimeDetail,
    scrapeSeriesDetail,
    scrapeFilmDetail
};
