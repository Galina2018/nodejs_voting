const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ejs = require('ejs');

const webserver = express();

webserver.use(express.urlencoded({ extended: true }));
webserver.set('view engine', 'ejs');

const port = 7380;
let variants = [];
let statistics = [];

const divOpen = '<div>';
const divClose = '</div>';
const inputStart = '<input type="radio" name="vote" id="vote_check';
const inputFinish = ' />';
const inputValue = ' value="';
const labelOpen = '<label for="vote_check';
const labelClose = '.text %></label>';
const withStatLabelClose = ' %></label>';
const nameFile = path.join(__dirname, 'index.html');
const startHtml =
  '<!DOCTYPE html><html><body><fieldset><legend>Где Вы хотите провести Новый год?</legend><form method = "get" action="http://178.172.195.18:7380/variants"><button type="submit">Варианты</button></form><form method="post" action="http://178.172.195.18:7380/stat"><button type="submit">Статистика</button></form><form method="post" name="vote" action="http://178.172.195.18:7380/vote">';
const endHtmlWithBtn =
  '<button type="submit">Проголосовать</button></form></fieldset></body></html>';
function variantsList(arr) {
  let html = '';
  arr.forEach((elem, idx) => {
    let input = `${elem.code}"`;
    let label = `${elem.code}"><%= variants[${idx}]`;
    html = `${html}${divOpen}${inputStart}${input}${inputValue}${input}${inputFinish}${labelOpen}${label}${labelClose}${divClose}`;
  });
  return html;
}
function variantsAndStatList(vars, stat) {
  const varsAndStat = vars.map((e, i) => ({ ...e, ...stat[i] }));
  let html = '';
  varsAndStat.forEach((elem, idx) => {
    let input = `${elem.code}"`;
    let label = `${elem.code}"><%= variants[${idx}].text %> - <%= statistics[${idx}].count`;
    html = `${html}${divOpen}${inputStart}${input}${inputValue}${input}${inputFinish}${labelOpen}${label}${withStatLabelClose}${divClose}`;
  });
  return html;
}

webserver.get('/variants', (req, res) => {
  const variants_data = fs.readFileSync(path.join(__dirname, 'variants.json'));
  variants = JSON.parse(variants_data);
  let variantsHtml = variantsList(variants);
  variantsHtml = `${startHtml}${variantsHtml}${endHtmlWithBtn}`;
  const fd = fs.openSync(nameFile, 'w');
  fs.ftruncateSync(fd, 0);
  fs.writeSync(fd, variantsHtml + os.EOL);
  fs.closeSync(fd);
  var template = fs.readFileSync(nameFile, 'utf8');
  res.send(ejs.render(template, { statistics, variants }));
});

webserver.post('/stat', (req, res) => {
  let statistics_data = fs.readFileSync(
    path.join(__dirname, 'statistics.json')
  );
  statistics = JSON.parse(statistics_data);
  let variantsStatHtml = variantsAndStatList(variants, statistics);
  variantsStatHtml = `${startHtml}${variantsStatHtml}${endHtmlWithBtn}`;
  const fd = fs.openSync(nameFile, 'w');
  fs.ftruncateSync(fd, 0);
  fs.writeSync(fd, variantsStatHtml + os.EOL);
  fs.closeSync(fd);
  var template = fs.readFileSync(nameFile, 'utf8');
  res.send(ejs.render(template, { statistics, variants }));
});

webserver.post('/vote', (req, res) => {
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
  let variants_data = fs.readFileSync(path.join(__dirname, 'variants.json'));
  variants = JSON.parse(variants_data);
  var template = fs.readFileSync(nameFile, 'utf8');
  res.send(ejs.render(template, { statistics, variants }));
});

webserver.get('/voting', (req, res) => {
  let variantsHtml = variantsList(variants);
  variantsHtml = `${startHtml}${variantsHtml}${endHtmlWithBtn}`;
  const fd = fs.openSync(nameFile, 'w');
  fs.ftruncateSync(fd, 0);
  fs.writeSync(fd, variantsHtml + os.EOL);
  fs.closeSync(fd);
  var template = fs.readFileSync(nameFile, 'utf8');
  res.send(ejs.render(template, { statistics, variants }));
});

webserver.listen(port, () => {
  console.log('webserver running on port ' + port);
});
