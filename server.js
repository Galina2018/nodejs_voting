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
let statistics = [
  {
    code: 0,
    count: 86,
  },
  {
    code: 1,
    count: 32,
  },
  {
    code: 2,
    count: 24,
  },
  {
    code: 3,
    count: 27,
  },
];
const variants = [
  {
    code: '0',
    text: 'ресторан',
  },
  {
    code: '1',
    text: 'усадьба',
  },
  {
    code: '2',
    text: 'баня',
  },
  {
    code: '3',
    text: 'дома',
  },
];
webserver.get('/variants', (req, res) => {
  res.send(variants);
});

webserver.post('/stat', (req, res) => {
  if (req.headers.accept === 'text/html') {
    let result = '<table border=1>';
    if (variants.length) {
      statistics.forEach((e) => {
        result =
          result +
          `<tr><td>${variants[e.code].text}</td><td>${e.count}</td></tr>`;
      });
    }
    result += '</table>';
    res.setHeader('Content-type', 'text/html');
    res.setHeader('Content-Disposition', 'attachment');
    res.send(result);
  } else if (req.headers.accept === 'application/xml') {
    let result = '<Statistics>';
    if (variants.length) {
      statistics.forEach((e) => {
        result =
          result +
          `<variant>${variants[e.code].text}</variant><stat>${e.count}</stat>`;
      });
    }
    result += '</Statistics>';
    res.setHeader('Content-type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment');
    res.send(result);
  } else if (req.headers.accept === 'application/json') res.send(statistics);
  else res.send(statistics);
});

webserver.post('/vote', upload.none(), (req, res) => {
  statistics = statistics.map((e) => {
    if (e.code == req.body.vote) e.count++;
    return e;
  });
  res.send(statistics);
});

webserver.get('/', (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf8');
  res.send(html);
});

webserver.listen(port, () => {
  console.log('webserver running on port ' + port);
});
