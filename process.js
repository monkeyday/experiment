const http = require('http'), express = require('express'), app = express(), 
                    EvtEmit = require('events'), fs = require('fs'), mg = require('mongoose'), babel = require('babel-core'), host = process.argv[2];
const errHandle = (e) => { if (e) console.log(e); }
var data;
class Evt extends EvtEmit {}
const evt = new Evt();

/**
 * get codes from local file
 * @param n 	SPAMZ8BZ200IV
 * @return	 Array
 * @throws C1BusinessRuleException
 */           
mg.connect(`mongodb://${host}:27017/opendata`, { useMongoClient: true }, errHandle);
// open default mongoose connection
const db = mg.connection; // default mongoose connection

db.on('connected', () => {
  let o = {};
  
  o.map = function() {
    var v = { amount: this.amount, sum: this.amount * this.avg_price };
    emit(this.p_code, v);
  }
  
  o.reduce = function(k, v) {
    return v.reduce((t, e) => {
      t.amount += e.amount;
      t.sum += e.sum;
      return t;
    }, { amount: 0, sum: 0 });
  }
  
  o.finalize = function(k, v) {
    v.avg_price = v.sum / v.amount;
    return v;
  }
  
  o.query = { date: { $gt: new Date('2017-06-30') } };
  
  db.model('Fruits').find({ date: new Date('2017-06-30') }, ['-__v', '-_id'], (e, d) => {
    console.log(d[0]);
    data = d;
  });
  
  db.model('Fruits').mapReduce(o, (e, r) => {
    if (e) throw e;
    console.log(r[0]);
  });
  
  db.model('Fruits').aggregate(
    { $match: { date: new Date('2017-06-30') } },
    { $group: { _id: '$m_code', count: { $sum: 1 }, d: { $push: '$$ROOT' } } },
    { $sort: { count: 1 } }
  , (e, r) => {
    if (e) throw e;
    console.log(r[0]);
  });
  
  db.model('Fruits').aggregate(
    { $match: { date: { $gt: new Date('2017-06-30') } } },
    { $project: { _id: '$m_code', count: { $sum: 1 }, day: { $dayOfWeek: '$date' }, p: ['$amount', '$avg_price'] } }
  , (e, r) => {
    if (e) throw e;
    console.log(r[1]);
  });
  
});
db.on('disconnected', () => console.log('connection disconnected'));

const schem = mg.Schema({
  T: String,
  C: {},
  D: { type: Date, default: Date.now},
  N: Number
}), detail = mg.Schema({
  date: Date,
  p_code: String,
  p_name: String,
  m_code: String,
  m_name: String,
  u_price: Number,
  m_price: Number,
  d_price: Number,
  avg_price: Number,
  amount: Number,
  l_cate: String,
  m_cate: String,
  s_cate: String,
  imports: Boolean
}), rec = mg.Schema({
  T: String,
  D: Date,
  M: String,
  ID: String,
  U: String,
  N: Number
}, { timestamps: true }), code = mg.Schema({
  Type: String,
  Code: String,
  Name: [String],
  P_Code: String,
  Category: String,
  Import: Boolean,
  Avtive: Boolean
}), Codes = mg.model('Codes', code),
 OpenData = mg.model('OpenData', schem, 'opendatas'),
 Fruits = mg.model('Fruits', detail),
 Vegetables = mg.model('Vegetables', detail),
 Flowers = mg.model('Flowers', detail),
 Rests = mg.model('Rests', detail),
 Records = mg.model('Records', rec);
//59725b79c6a11b1254fa1c7a, 596bd14e8d35e50a040ce648



/**
 * get codes from local file
 * @param n 	SPAMZ8BZ200IV
 * @return	 Array
 * @throws C1BusinessRuleException
 */
function getCode(n) {
  return new Promise((rsv) => {
    fs.readFile('pub/code.txt', 'utf8', (e, d) => {
      if (e) throw e;
      d = JSON.parse(d)
      let c = [], a = [];
      d.forEach((v) => {
        if (v['大分類名稱'] == n) {
          c.push(v['原始編碼']);
          a.push(v);
        }
      });
      return rsv([c, a]);
    });
  });
}
/*getCode('花卉').then((v) => {
  let a = [];
  v[1].forEach((e) => {
    //console.log(e);
    a.push({
      Type: 'Flowers',
      Code: e['原始編碼'],
      Name: (e['備註']) ? (e['編碼說明'] + ' ' + e['備註']).split(' ') : [e['編碼說明']],
      P_Code: e['大項'],
      Category: getCate(e['編碼說明']),
      Import: (e['編碼說明'].indexOf('進口') !== -1) ? true : false,
      Active: true
    });
  });
  //console.log(a);
  mg.models['Codes'].insertMany(a).then((r) => console.log(r));
}).catch(errHandle);*/

function getCate(d) {
  let a = { '蘭花類': ['文心蘭', '石斛蘭', '拖鞋蘭', '虎頭蘭', '報歲蘭', '葉蘭', '蜘蛛蘭', '蝴蝶蘭', '樹蘭', '蘭花'], '菊花類': ['大理花', '大菊', '小菊', '山防風', '孔雀草', '瓜葉菊', '向日葵', '波斯菊', '非洲菊', '麥桿菊', '雲南菊'], '球根類': ['鬱金香', '香水百合', '宮燈百合', '斑葉蘭', '新文竹', '萱草', '臺灣百合', '寶貝', '鐵砲百合', '石蒜', '孤挺花'], '其他切花類': ['火鶴花', '小可愛', '滿天星', '康乃馨', '劍蘭', '洋桔梗', '玫瑰', '水晶花', '卡斯比亞', '星辰花', '繡球花', '紫羅蘭', '帝王花', '白鶴芋', '海芋', '茉莉花', '白頭翁', '金魚草', '羽扇豆', '美人蕉', '夜來香', '雞冠花', '貓柳', '荷花', '睡蓮', '風鈴花', '龍膽', '薑花', '薑荷花'], '切枝切葉類': ['切葉類', '八角金盤', '青蘋果', '火鶴葉', '黃金葛葉', '電信蘭葉', '火龍果', '小米', '小麥', '高梁', '觀賞玉米', '七里香', '圓葉', '扁柏', '茶花', '觀賞南瓜', '洛神葵', '星點木', '木瓜葉', '桃花'], '盆花類': ['長壽花'], '種子與苗圃類': ['杜鵑花'] }, c;
  for (let p in a) {
    if (a[p].indexOf(d) !== -1) c = p;
  }
  return c;
}

const u = { h: 'data.coa.gov.tw', p: '/Service/OpenData/FromM/FarmTransData.aspx', s: ['.'], t: 'A' };

/**
 * batch saving open data to database
 * @param u Object - includes information about open data source url, delimeter symbol and database record type
 * @param d Array - start and end date string or number within an array
 * @param s String - database model name
 * @return	 Array
 */
function batchSave(u, d, s) {
  let gen = genDate(...d), D = gen.next();
  while (!D.done) {
    getData(u, D.value, 0, []).then((v) => {
      console.log(v[0] + ' : ' + v[1].length);
    }).catch(errHandle);
    D = gen.next();
  }
  //saveDB(v, e, s, u.t);
}
//batchSave(u, ['2017-07-15', 3, ['.']], 'OpenData');

function batch(u, d, s, a) {
  let D = d.shift(), arr = a;
  return new Promise((rsv) => {
    getData(u, D, 0, []).then((v) => {
      console.log(D + ':' + v.length);
      arr.push({ date: chDate(D), data: v});
      return rsv();
    });
  }).then((v) => {
    return (d.length !== 0) ? batch(u, d, s, arr) : Promise.resolve(arr);
  }).catch(errHandle);
}

//batch(u, genDateArr('2017-05-01', '2017-05-31', ['.']), 'OpenData', []).then((v) => saveDB(v, 'OpenData', u.t));

/*con.models['OpenData'].remove({ _id: '597f9238b379840e90ad19aa' }, (e, r) => {
  if (e) throw e;
  console.log(r);
});*/

/**
 * transform jsx file to front end and server side javascript file
 * @param f String - filename of the file going to be transformed
 * @param l Number - lines to remove
 * @return Promise<String> - React DOM Server rendering string
 */
function parseJS(f, l) {
  return new Promise((rsv) => {
    babel.transformFile(`./src/jsx/${f}.jsx`, { plugins: ['babel-plugin-transform-react-jsx'] }, (e, r) => {
      if (e) throw e;
      let c = r.code;
      fs.writeFile(`./src/js/${f}.js`, c, (e) => {
        if (e) throw e;
      });
      while (l > 0) {
        c = c.substr(c.search(/(\n|\r)/) + 1);
        l --;
      }
      return rsv(c);
    });
  }).then((v) => {
    return new Promise((rsv) => {
      let c = babel.transform(v, { presets: ['minify'] });
      fs.writeFile(`./pub/js/${f}.js`, c.code, (e) => {
        if (e) throw e;
        return rsv(require(`./src/js/${f}.js`)(data));
      });
    });
  }).catch(errHandle);
}

/**
 * get data from sending request to open data providing url
 * @param i 	Number - counter for open data requesting skipping
 * @param a Array - store recursive retrieved data
 * @return Promise<Array> a promise resolving array
 */
function getData(u, d, i, a) {
  let arr = a;
  return new Promise((rsv) => {
    request(u, d, i).then((v) => {
      arr = arr.concat(v);
      i ++;
      return rsv(v);
    });
  }).then((v) => {
    return (v.length !== 3000) ? Promise.resolve(arr) : getData(u, d, i, arr);
  }).catch(errHandle);
}

/**
 * request data from specifying url, date and skipping counter
 * @param i 	Number - counter for open data requesting skipping
 * @param u Object - provide url information
 * @return Promise<Array> a promise resolving array
 */
function request(u, d, i) {
  return new Promise((rsv) => {
    http.request({
      host: 'data.coa.gov.tw',
      path: `/Service/OpenData/FromM/FarmTransData.aspx?StartDate=${d}&EndDate=${d}&$Top=3000&$Skip=${i * 3000}`,
      method: 'GET'
    }, (msg) => {
      console.log('requesting:' + i + '-' + d);
      let tmp = '';
      msg.setEncoding('utf8');
      msg.on('data', (c) => {
        tmp += c;
      })
      .on('end', () => {
        return rsv(JSON.parse(tmp));
      });
    }).end();
  });
}

/*function addCode(d) {
  let d = JSON.parse(data)
               .map((v) => (code.indexOf(v['作物代號']) !== -1) ? Object.assign(v, {'大分類': '果品'}) : Object.assign(v, {'大分類': ''}))
               .filter((v) => (v['大分類'] !== ''));
} {"date":"2017-07-16T00:00:00.000Z",
"p_code":"G3", Code
"p_name":"酪梨", Name.join(' ')
"m_code":"260",
"m_name":"宜蘭市",
"u_price":60,
"m_price":50,
"d_price":35,
"avg_price":48,
"amount":1580,
"l_cate":"果品", Type
"m_cate":"G3", P_Code
"s_cate":""} Category
import*/

/**
 * request data from specifying url, date and skipping counter
 * @param d Array - data to be saved
 * @param s String - Mongoose model name
 * @return Promise<Array> a promise resolving array
 */
function saveDB(v, s, t) {
  let a = [], b = [];
  v.forEach((e) => {
    a.push({ T: t, C: e.data, D: e.date, N: e.data.length });
  });
  mg.models[s].insertMany(a).then((r) => {
    r.forEach((e) => {
      b.push({ T: e.T, D: e.D, M: 'OpenData', ID: e._id, U: u.h + u.p, N: e.N});
    });
    mg.models['Records'].insertMany(b).then((rs) => console.log(rs));
  }).catch(errHandle);
}

/**
 * generate a period or a number of date objects
 * @param s 	String - starting date to be generated
 * @param e String | Number - ending date or numbers to be generated
 * @param d String | Array - a delimeter or a delimeter within an Array means need to be transformed into Taiwan date
 * @return Date - date object
 */
function genDateArr(s, e, d) {
  let ms = 1000 * 60 * 60 * 24, sD = Date.parse(s),
  eD = (typeof e == 'string') ? Date.parse(e) : sD + (e - 1) * ms, a = [];
  if (eD < sD) return;
  for (let i = sD; i <= eD; i += ms) {
    a.push(chDate(i, d));
  }
  return a;
}

function* genDate(s, e, d) {
  let ms = 1000 * 60 * 60 * 24, sD = Date.parse(s),
  eD = (typeof e == 'string') ? Date.parse(e) : sD + (e - 1) * ms;
  if (eD < sD) return;
  for (let i = sD; i <= eD; i += ms) {
    yield chDate(i, d);
  }
}

/**
 * transform string to date object or date object to specified string format
 * @param d String | Number - date string or milliseconds to be transformed
 * @param s 	String | Array - a delimeter or a delimeter within an Array means need to be transformed into Taiwan date
 * @return Number | String - Date milliseconds or string with specified delimeter or Taiwan date format
 */
function chDate(d, s) {
  if (s == null) { //without delimeter argument, return date milliseconds
    let s = ['.', '-', '_', '/'].find((v) => {
      return d.indexOf(v) !== -1;
    });
    let a = (s) ? d.split(s) : Array(d.slice(0, -4), d.substr(-4, 2), d.substr(-2, 2));
    a[0] = (a[0].length !== 4) ? +a[0] + 1911 : a[0];
    return Date.parse(a.join('-'));
  } else { //delimeter within array means need to be transformed into Taiwan date format 
    let D = new Date(d), y = (typeof s !== 'string') ? D.getFullYear() - 1911 : D.getFullYear(),
    m = D.getMonth() + 1, dd = D.getDate(), p = /\d{2}/;
    m = (p.test(m)) ? m : '0' + m;
    dd = (p.test(dd)) ? dd : '0' + dd;
    return  (typeof s !== 'string') ? Array(y, m, dd).join(s[0]) : Array(y, m, dd).join(s);
  }
}
//console.log(chDate(1501113600000, ['-']));

app.use('/pub', express.static('pub'));

app.get('/', (req, res) => {
  parseJS('test', 9).then((v) => {
    res.set({
      'Content-Type': 'text/html;  charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.send(v);
  }).catch(errHandle);
});

/*mg.models['Codes'].updateMany({ $and: [ { Type: 'Vegetables' }, { Code: /^W/ }, { P_Code: { $exists: false } } ] }, { $set: { Type: 'Fruits', P_Code: 'W' } }, { multi: true }, (e, r) => {
  if (e) throw e;
  console.log(r);
}); { $and: [ { Type: 'Flowers' }, { P_Code: { $exists: false } } ] }*/

function addCode(c) {
  return new Promise((rsv) => {
    let o = {};
    c.forEach((e, i) => {
      let a = {};
      mg.models['Codes'].find({ Type: e }, ['-__v', '-_id'], (err, d) => {
        if (err) throw err;
        d.forEach((v) => Object.assign(a, { [v.Code]: [v.Name.join('-'), v.P_Code, v.Category, v.Import] }));
        o[e] = { item: d.map((v) => v.Code), detail: a };
        if (i == c.length - 1) return rsv(o);
      });
    });
  });
}

let k = ['Fruits', 'Vegetables', 'Flowers'];
/*addCode(k).then((v) => {
  splitData(v, 'OpenData').then((r) => {
    let a = [];
    let d = r.reduce((t, e) => {
      for (let k in e) {
        t[k] = t[k].concat(e[k]);
        if (k !== 'date') a.push({ T: k, D: e.date, M: k, N: e[k].length });
      }
      return t;
    }, { Fruits: [], Vegetables: [], Flowers: [], Rests: [], date: [] });
    //console.log(a);
    for (let k in d) {
      if (k !== 'date') mg.models[k].insertMany(d[k].splice(0, 50000)).then((r) => console.log(r[49999]));
    }
  });
}).catch(errHandle);*/


function splitData(v, s) {
  return new Promise((rsv) => {
    let a =[];
    mg.models[s].find((err, r) => {
      if (err) throw err;
      r.forEach((d) => {
        let c = d.C, o = {};
        k.forEach((e) => Object.assign(o, { [e]: [] }));
        o.Rests = [];
        let result = c.reduce((t, e) => {
          if (e['作物代號'] == 'rest') {
            t.Rests.push({
              date: chDate(e['交易日期']),
              m_code: e['市場代號'],
              m_name: e['市場名稱']
            });
            return t;
          } else {
            k.forEach((p) => {
              if (v[p].item.indexOf(e['作物代號']) !== -1) {
                t[p].push({
                  date: chDate(e['交易日期']),
                  p_code: e['作物代號'],
                  p_name: e['作物名稱'],
                  m_code: e['市場代號'],
                  m_name: e['市場名稱'],
                  u_price: e['上價'],
                  m_price: e['中價'],
                  d_price: e['下價'],
                  avg_price: e['平均價'],
                  amount: e['交易量'],
                  l_cate: p,
                  m_cate: v[p].detail[e['作物代號']][1],
                  s_cate: v[p].detail[e['作物代號']][2],
                  imports: v[p].detail[e['作物代號']][3]
                });
                return t;
              }
            });
            return t;
          }
          
        }, o);
        //console.log(d.D.toString() + '-' + d.N + ':' + result.Fruits.length + ',' + result.Vegetables.length + ',' + result.Flowers.length + ',' + result.rest.length);
        result.date = d.D;
        a.push(result);
      });
      return rsv(a);
    });
  });
}

app.get('/db', (req, res) => {
  res.set({
    'Content-Type': 'application/json;  charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  mg.models['Codes'].find({ $and: [ { Type: 'Fruits' }, { P_Code: { $exists: true } } ] }, ['-__v'], (e, d) => {
    let a = d.map((v) => v.Code);
    let b = {};
    d.forEach((v) => Object.assign(b, {[v.Code]: [v.Name.join('-'), v.P_Code, v.Category, v.Import]}));
    res.send(b);
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