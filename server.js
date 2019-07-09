const http = require('http'), express = require('express'), app = express(), host = '127.0.0.1',
                    port = '3000', url = 'http://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx',
                    EvtEmit = require('events'), fs = require('fs'), BrowserRouter = require('react-router-dom').BrowserRouter,
                    mg = require('mongoose');

mg.connect('mongodb://127.0.0.1:27017/opendata');

var data, code, db;
const schem = mg.Schema({
  t: String,
  c: {},
  d: { type: Date, default: Date.now},
  r: Number
});
const OpenData = mg.model('OpenData', schem);

class Evt extends EvtEmit {}
const evt = new Evt();

function getCode(n) {
  fs.readFile('pub/code.txt', 'utf8', (err, d) => {
    if (err) throw err;
    code = JSON.parse(d)
              .map((v) => (
              v['大分類名稱'] == n) 
              ? v['原始編碼'] 
              : '')
              .filter((v) => (v !== ''));
  });
}

function getData() {
  http.request({
    host: 'data.coa.gov.tw',
    path: '/Service/OpenData/FromM/FarmTransData.aspx',
    method: 'GET'
  }, (msg) => {
    let tmp = '';
    msg.setEncoding('utf8');
    msg.on('data', (c) => {
      tmp += c;
    })
    .on('end', () => {
      data = tmp;
      evt.emit('dataGot');
    });
  }).end();
}

function saveDB() {
  evt.on('dataGot', () => {
    let d = JSON.parse(data)
               .map((v) => (code.indexOf(v['作物代號']) !== -1) ? Object.assign(v, {'大分類': '果品'}) : Object.assign(v, {'大分類': ''}))
               .filter((v) => (v['大分類'] !== ''));
    let opd = new OpenData({
      t: 'a',
      c: d,
      r: d.length
    });
    opd.save((err, opd) => {
      if (err) throw err;
      db = opd;
      evt.emit('dbSaved');
    });
  });
}

Date.prototype.chDate = () => {
  this.getFullYear();
};

getCode('果品');
saveDB();

app.get('/', (req, res) => {
  getData();
  evt.on('dbSaved', () => {
    res.set({
      'Content-Type': 'application/json;  charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.send(db);
  });
});

app.listen(3000, (err) =>{
  if (err) throw err;
  console.log('server is running on 127.0.0.1:3000');
});

/* node version server
const server = http.createServer((req, res) => {
  getData();
  evt.on('dataGot', () => {
    res.writeHead(200, {
      'Content-Type': 'application/json;  charset=utf-8',
      'Access-Control-Allow-Origin': '*' });
    data = JSON.parse(data)
              .map((v) => (code.indexOf(v['作物代號']) !== -1) ? Object.assign(v, {'大分類': '蔬菜'}) : Object.assign(v, {'大分類': ''}))
              .filter((v) => (v['大分類'] !== ''));
    res.end(JSON.stringify(data));
  });
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}/`);
});*/