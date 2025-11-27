const cheerio = require('cheerio');
const { createAxiosInstance } = require('../services/axios.service');
const { parseLink } = require('../utils/helpers');
const { BASE_URL } = require('../config/constants');

const axios = createAxiosInstance();

/**
 * Scrape home page data
 * @returns {Promise<object>} Home page data with all sections
 */
async function scrapeHome() {
    const response = await axios.get(BASE_URL);
    const $ = cheerio.load(response.data);

    const top10AnimeList = [];
    const top10FilmList = [];
    const animeTerbaruList = [];
    const latestFilmList = [];
    const jepangKoreaChinaBaratList = [];
    const tvShowList = [];

    $('.movies-list-wrap').each((index, section) => {
        const sectionTitle = $(section).find('.list-title h2').text().trim();

        if (sectionTitle.includes('Top 10')) {
            scrapeTop10Section($, section, sectionTitle, top10AnimeList, top10FilmList);
        } else if (sectionTitle.includes('Anime Donghua')) {
            scrapeListSection($, section, animeTerbaruList);
        } else if (sectionTitle.includes('Film Terbaru')) {
            scrapeFilmSection($, section, latestFilmList);
        } else if (sectionTitle.includes('Jepang Korea China Barat')) {
            scrapeListSection($, section, jepangKoreaChinaBaratList);
        } else if (sectionTitle.includes('TV Show')) {
            scrapeListSection($, section, tvShowList);
        }
    });

    return {
        top10_anime: top10AnimeList,
        latest_anime: animeTerbaruList,
        top10_film: top10FilmList,
        latest_film: latestFilmList,
        jepang_korea_china_barat: jepangKoreaChinaBaratList,
        tv_show: tvShowList
    };
}

/**
 * Scrape Top 10 section
 */
function scrapeTop10Section($, section, sectionTitle, top10AnimeList, top10FilmList) {
    let targetArray = null;

    if (sectionTitle.includes('Series')) targetArray = top10AnimeList;
    else if (sectionTitle.includes('Movies') || sectionTitle.includes('Film')) targetArray = top10FilmList;

    if (targetArray) {
        $(section).find('.ml-item-potrait').slice(0, 10).each((i, element) => {
            const title = $(element).find('.judul').text().trim();
            const rawLink = $(element).find('a.ml-mask').attr('href');
            const linkData = parseLink(rawLink);
            const image = $(element).find('img.mli-thumb').attr('src');
            const rating = $(element).find('.mli-mvi').text().trim();
            const rank = $(element).find('.mli-topten b').text().trim();

            if (title) {
                targetArray.push({
                    rank,
                    title,
                    rating,
                    image,
                    type: linkData.slug,
                    id: linkData.id,
                    link: linkData.original
                });
            }
        });
    }
}

/**
 * Scrape list section (anime, series, tv show)
 */
function scrapeListSection($, section, targetArray) {
    $(section).find('.ml-item').each((i, element) => {
        const title = $(element).find('.judul').text().trim();
        const rawLink = $(element).find('a.ml-mask').attr('href');
        const linkData = parseLink(rawLink);
        const image = $(element).find('img.mli-thumb').attr('src');
        const episode = $(element).find('.mli-episode').text().trim();
        const time = $(element).find('.mli-waktu').text().trim();
        const views = $(element).find('.mli-mvi').text().trim();

        if (title) {
            targetArray.push({
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

/**
 * Scrape film section
 */
function scrapeFilmSection($, section, targetArray) {
    $(section).find('.ml-item').each((i, element) => {
        const title = $(element).find('.judul').text().trim();
        const rawLink = $(element).find('a.ml-mask').attr('href');
        const linkData = parseLink(rawLink);
        const image = $(element).find('img.mli-thumb').attr('src');
        const time = $(element).find('.mli-waktu').text().trim();
        const views = $(element).find('.mli-info .mli-mvi').text().trim();

        if (title) {
            targetArray.push({
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

module.exports = {
    scrapeHome
};
