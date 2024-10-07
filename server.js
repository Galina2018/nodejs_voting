const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

const webserver = express();

webserver.use(express.urlencoded({ extended: true }));

const port = 7380;
let variants = [];
let statistics = [];

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>    
</head>
<body>
<form method="post" action="/vote">
<fieldset>
  <legend>Где Вы хотите провести Новый год?</legend>
  <input type="radio" name="vote" id="vote0" value="0"></input>
  <label for="vote0" id="label0"></label><br />
  <input type="radio" name="vote" id="vote1" value="1"></input>
  <label for="vote1" id="label1"></label><br />
  <input type="radio" name="vote" id="vote2" value="2"></input>
  <label for="vote2" id="label2"></label><br />
  <input type="radio" name="vote id="vote3" value="3"></input>
  <label for="vote3" id="label3"></label><br />  
  <button type="submit">Проголосовать</button>
  </form>
</fieldset>
<script>
getVariants();
getStat();
async function getVariants() {
  const response = await fetch('/variants');
  const variants = await response.json();
  document.getElementById('label0').innerText = variants[0].text;
  document.getElementById('label1').innerText = variants[1].text;
  document.getElementById('label2').innerText = variants[2].text;
  document.getElementById('label3').innerText = variants[3].text;
}
async function getStat() {
const response = await fetch('/stat', {method: 'post'});
const statistics = await response.json()
 document.getElementById('label0').innerText += ' - ' + statistics[0].count;
 document.getElementById('label1').innerText += ' - ' + statistics[1].count;
 document.getElementById('label2').innerText += ' - ' + statistics[2].count;
 document.getElementById('label3').innerText += ' - ' + statistics[3].count;
}
</script>
</body>
</html>
`;

webserver.get('/variants', (req, res) => {
  const variants_data = fs.readFileSync(path.join(__dirname, 'variants.json'));
  variants = JSON.parse(variants_data);
  res.send(variants);
});

webserver.post('/stat', (req, res) => {
  let statistics_data = fs.readFileSync(
    path.join(__dirname, 'statistics.json')
  );
  statistics = JSON.parse(statistics_data);
  res.send(statistics);
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
  res.send(html);
});

webserver.get('/voting', (req, res) => {
  res.send(html);
});

webserver.listen(port, () => {
  console.log('webserver running on port ' + port);
});
