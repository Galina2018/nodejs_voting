getVariants();
getStat();
const form = document.getElementById('form');
form.addEventListener('submit', sendVote);

async function sendVote() {
  await fetch('/vote', {
    method: 'POST',
    body: new FormData(form),
  });
}
async function getVariants() {
  const response = await fetch('/variants');
  const variants = await response.json();
  document.getElementById('label0').innerText = variants[0].text;
  document.getElementById('label1').innerText = variants[1].text;
  document.getElementById('label2').innerText = variants[2].text;
  document.getElementById('label3').innerText = variants[3].text;
}
async function getStat() {
  const response = await fetch('/stat', { method: 'post' });
  const statistics = await response.json();
  document.getElementById('stat0').innerText = ' - ' + statistics[0].count;
  document.getElementById('stat1').innerText = ' - ' + statistics[1].count;
  document.getElementById('stat2').innerText = ' - ' + statistics[2].count;
  document.getElementById('stat3').innerText = ' - ' + statistics[3].count;
}
async function resXml() {
  const response = await fetch('/stat', {
    method: 'POST',
    headers: {
      Accept: 'application/xml',
    },
  });
  const data = await response.blob();
  const btn = document.createElement('a');
  btn.href = window.URL.createObjectURL(new Blob([data]));
  btn.download = 'result.xml';
  btn.click();
}
async function resHtml() {
  const response = await fetch('/stat', {
    method: 'POST',
    headers: {
      Accept: 'text/html',
    },
  });
  const data = await response.blob();
  const btn = document.createElement('a');
  btn.href = window.URL.createObjectURL(new Blob([data]));
  btn.download = 'result.html';
  btn.click();
}
async function resJson() {
  const response = await fetch('/stat', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await response.blob();
  const btn = document.createElement('a');
  btn.href = window.URL.createObjectURL(new Blob([data]));
  btn.download = 'result.json';
  btn.click();
}
