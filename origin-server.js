const express = require('express');
const PORT = 5000;

const app = express();

app.use(express.static('public'));


app.listen(PORT, () => {
  console.log(`Origin server running at http://localhost:${PORT}`);
});
