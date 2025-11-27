const cheerio = require('cheerio');
const axios = require('axios');
const { USER_AGENT, BASE_URL } = require('../config/constants');

/**
 * Extract download links from episode page
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
 * Extract stream options from episode page
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
 * Scrape episode detail
 * @param {string} episodeId - Episode ID
 * @returns {Promise<object>} Episode data
 */
async function scrapeEpisode(episodeId) {
    const url = `${BASE_URL}/${episodeId}/`;
    const response = await axios.get(url, {
        headers: { 'User-Agent': USER_AGENT }
    });

    const $ = cheerio.load(response.data);
    const title = $('.list-title h2').first().text().trim();
    const downloads = extractDownloadLinks($);
    const stream_options = extractStreamOptions($);

    return {
        title,
        downloads,
        stream_options,
        note: "Untuk mendapatkan link embed asli, lakukan GET request ke /api/server/:id dengan query params nume dan type"
    };
}

/**
 * Get video server embed source
 * @param {string} postId - Post ID
 * @param {string} nume - Nume parameter
 * @param {string} type - Type parameter
 * @returns {Promise<string>} HTML embed code
 */
async function getServerEmbed(postId, nume, type) {
    const params = new URLSearchParams();
    params.append('action', 'player_ajax');
    params.append('post', postId);
    params.append('nume', nume);
    params.append('type', type);

    const response = await axios.post(`${BASE_URL}/wp-admin/admin-ajax.php`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': USER_AGENT,
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': BASE_URL,
            'Referer': `${BASE_URL}/`
        }
    });

    return response.data;
}

module.exports = {
    scrapeEpisode,
    getServerEmbed
};
