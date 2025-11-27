const axios = require('axios');
const { USER_AGENT } = require('../config/constants');

/**
 * Create configured axios instance with default headers
 * @returns {object} Axios instance
 */
function createAxiosInstance() {
    return axios.create({
        headers: {
            'User-Agent': USER_AGENT
        }
    });
}

module.exports = {
    createAxiosInstance
};
