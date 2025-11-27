# Winbu TV Scraper API

Clean and modular scraper API for Winbu TV website.

## 📁 Project Structure

```
winbu-scrape/
├── src/
│   ├── config/
│   │   └── constants.js          # Configuration & constants
│   ├── utils/
│   │   └── helpers.js             # Helper functions
│   ├── services/
│   │   └── axios.service.js       # Axios configuration
│   ├── scrapers/
│   │   ├── home.scraper.js        # Home page scraping
│   │   ├── detail.scraper.js      # Detail page scraping
│   │   ├── episode.scraper.js     # Episode scraping
│   │   └── pagination.scraper.js  # Paginated pages scraping
│   └── routes/
│       └── index.js               # API routes
├── index.js                        # Entry point
├── package.json
└── README.md
```

## 🚀 Installation

```bash
npm install
```

## 📝 Running the Server

```bash
npm start
```

Server will run on `http://localhost:3000`

## 🔌 API Endpoints

### Home Page
```
GET /api/home
```
Returns all home page sections (Top 10, Latest, etc.)

### Search
```
GET /api/search?q=keyword&page=1
```
Search for anime, series, or films by keyword with pagination support.

**Parameters:**
- `q` or `s` (required) - Search keyword
- `page` (optional) - Page number, default: 1

**Example:**
```
GET /api/search?q=naruto&page=1
```

### Detail Pages

**Anime Detail:**
```
GET /api/anime/:id
```

**Series Detail:**
```
GET /api/series/:id
```

**Film Detail:**
```
GET /api/film/:id
```

### Episode

**Episode Detail:**
```
GET /api/episode/:id
```

**Server Embed:**
```
GET /api/server/:id?nume=1&type=schtml
```

### Paginated Lists

**Anime Donghua:**
```
GET /api/animedonghua?page=1
```

**Films:**
```
GET /api/film?page=1
```

**Series:**
```
GET /api/series?page=1
```

**TV Shows:**
```
GET /api/tvshow?page=1
```

**Catalog:**
```
GET /api/catalog?page=1&title=...&status=...&type=...&order=...&genre=...
```
Returns filtered catalog results. Supports multiple genres.

## 💡 Code Organization

### Scrapers
- `home.scraper.js` - Handles home page content scraping
- `detail.scraper.js` - Handles anime/series/film detail pages
- `episode.scraper.js` - Handles episode details and embeds
- `pagination.scraper.js` - Handles paginated list pages

### Services
- `axios.service.js` - Configured axios instance with default headers

### Utils
- `helpers.js` - Reusable helper functions (parseLink, extractPagination)

### Config
- `constants.js` - API constants (BASE_URL, USER_AGENT, PORT)

## 🔧 Features

- ✅ Modular architecture
- ✅ Clean code separation
- ✅ Reusable components
- ✅ Easy to maintain
- ✅ Well documented
- ✅ Error handling
- ✅ Pagination support

## 📦 Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `axios` - HTTP client
- `cheerio` - HTML parser

## 🛠️ Development

The codebase is now organized into separate modules for better maintainability:

1. **Scrapers** - Each scraper handles specific page types
2. **Routes** - Clean API endpoint definitions
3. **Services** - Shared services like axios configuration
4. **Utils** - Helper functions used across modules
5. **Config** - Centralized configuration

## 📄 License

MIT

## 👨‍💻 Author

Created with ❤️ for educational purposes only.
