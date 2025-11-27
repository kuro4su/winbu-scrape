/**
 * Parse URL winbu.tv menjadi object dengan type, id, dan original link
 * @param {string} url - URL yang akan di-parse
 * @returns {object} Object berisi slug, id, dan original URL
 */
function parseLink(url) {
    if (!url) return { type: null, id: null, original: null };

    const parts = url.split('/').filter(Boolean);
    const id = parts.pop();
    const type = parts.pop();

    return {
        slug: type,
        id: id,
        original: url
    };
}

/**
 * Extract pagination info dari Cheerio object
 * @param {object} $ - Cheerio instance
 * @param {number} currentPage - Current page number
 * @returns {object} Pagination info
 */
function extractPagination($, currentPage) {
    let totalPages = 1;
    let hasNextPage = false;
    let nextPage = null;

    // Extract max page number from visible numbers
    $('.pagination li a').each((i, el) => {
        const num = $(el).text().trim();
        if (/^\d+$/.test(num)) {
            const n = parseInt(num);
            if (n > totalPages) totalPages = n;
        }
    });

    // Check for Next button (caret right)
    const nextLink = $('.pagination li a i.fa-caret-right').parent();
    if (nextLink.length > 0) {
        hasNextPage = true;
        // Try to extract page number from href
        const href = nextLink.attr('href');
        const match = href && href.match(/page\/(\d+)/);
        if (match) {
            nextPage = parseInt(match[1]);
            // If next page is beyond our current known max, update total
            if (nextPage > totalPages) totalPages = nextPage;
        } else {
            nextPage = currentPage + 1;
        }
    } else {
        // Fallback: if we are not at the max visible page, there is a next page
        if (currentPage < totalPages) {
            hasNextPage = true;
            nextPage = currentPage + 1;
        }
    }

    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const hasPrevPage = prevPage !== null;

    return {
        current_page: currentPage,
        total_pages: totalPages,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
        next_page: nextPage,
        prev_page: prevPage
    };
}

module.exports = {
    parseLink,
    extractPagination
};
