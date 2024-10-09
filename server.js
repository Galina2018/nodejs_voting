const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const multer = require('multer');

const webserver = express();
const upload = multer();

webserver.use(express.urlencoded({ extended: true }));
webserver.use(express.static('public'));
const port = 7380;

webserver.get('/variants', (req, res) => {
  const variants_data = fs.readFileSync(path.join(__dirname, 'variants.json'));
  res.send(variants_data);
});

webserver.post('/stat', (req, res) => {
  let statistics_data = fs.readFileSync(
    path.join(__dirname, 'statistics.json')
  );
  res.send(statistics_data);
});

webserver.post('/vote', upload.none(), (req, res) => {
  let statistics_data = fs.readFileSync(
    path.join(__dirname, 'statistics.json')
  );
  statistics = JSON.parse(statistics_data);
  const newStat = statistics.map((e) => {
    if (e.code == req.body.vote) e.count++;
    return e;
  });
  const fd = fs.openSync(path.join(__dirname, 'statistics.json'), 'w');
  fs.ftruncateSync(fd, 0);
  fs.writeSync(fd, JSON.stringify(newStat) + os.EOL);
  fs.closeSync(fd);
});

webserver.get('/', (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf8');
  res.send(html);
});

webserver.listen(port, () => {
  console.log('webserver running on port ' + port);
});

