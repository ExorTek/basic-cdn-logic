const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const compression = require('compression');
const cluster = require('node:cluster');
const { availableParallelism } = require('node:os');

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


if (cluster.isMaster) {
  const numWorkers = availableParallelism();
  console.log(`Master cluster setting up ${numWorkers} workers...`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`CDN Server worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}. Restarting...`);
    cluster.fork();
  });

} else {
  app.listen(PORT, () => {
    console.log(`CDN Server worker ${process.pid} listening on: http://localhost:${PORT}`);
  });
}
