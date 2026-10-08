const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/temp/index.html');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
