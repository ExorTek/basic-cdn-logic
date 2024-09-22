const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const compression = require('compression');

const ORIGIN_SERVER = 'http://localhost:5000';
const PORT = 5001;

const app = express();
const cache = new NodeCache({stdTTL: 100, checkperiod: 120});

app.use(compression());

app.get('/cdn/*', (req, res) => {
  const url = req.url.replace('/cdn', '');
  const cached = cache.get(url);

  if (cached) {
    console.log(`Serving ${url} from cache`);
    res.contentType(cached.contentType);
    return res.send(cached.data);
  }

  axios.get(`${ORIGIN_SERVER}${url}`, {responseType: 'arraybuffer'})
    .then(response => {
      const contentType = response.headers['content-type'];
      cache.set(url, {data: response.data, contentType});

      console.log(`Fetched ${url} from origin server`);
      res.contentType(contentType);
      res.send(response.data);
    })
    .catch(error => {
      console.log(`Error fetching ${url} from origin server - ${error}`);
      res.status(404).send({
        success: false,
        message: `File not found!`
      });
    });
});

app.get('/stats', (req, res) => {
  const stats = {
    cacheStats: cache.getStats(),
    uptime: process.uptime()
  };
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`CDN server running at http://localhost:${PORT}`);
});
