const express = require('express');
const cors = require('cors');
const { PORT } = require('./src/config/constants');
const apiRoutes = require('./src/routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Winbu TV Scraper API',
        version: '2.0.0',
        endpoints: {
            home: '/api/home',
            search: '/api/search?q=keyword&page=1',
            genres: '/api/genres',
            genre_content: '/api/genre/:slug?page=X',
            anime_detail: '/api/anime/:id',
            series_detail: '/api/series/:id',
            film_detail: '/api/film/:id',
            episode_detail: '/api/episode/:id',
            server_embed: '/api/server/:id?nume=X&type=Y',
            anime_list: '/api/animedonghua?page=X',
            film_list: '/api/film?page=X',
            series_list: '/api/series?page=X',
            tvshow_list: '/api/tvshow?page=X',
            others_list: '/api/others?page=X',
            catalog: '/api/catalog?page=X&title=...&status=...&type=...&order=...&genre=...'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});

module.exports = app;