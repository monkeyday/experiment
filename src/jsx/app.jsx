const React = require('react'), d3 = require('d3');
module.exports = (D, H) => <Root d={D} h={H} />;

function Row(d) {
  let a = [];
  console.log(d.d);
  for (let i in d.d) {
    a.push(<td key={i}>{d.d[i]}</td>);
  }
  //a.push(<td><a href={'d/' + (d.l)}>Del</a></td>);
  return <tr>{a}</tr>
}

function Table(p) {
  let a = p.h.map((v, i) => (
    <td key={i}>{v}</td>
  ));
  let b = p.d.map((v, i) => <Row key={i} i={i} d={v} l={p.p + i - 1} />);
  return (
    <table className="table table-bordered table-hover">
      <thead><tr>{a}<td>刪除</td></tr></thead>
      <tbody>{b}</tbody>
    </table>
  );
}

//c: current page, t: total pages, P: pages per view, v: current view, p: actual page
function Page(p) {
  let c = p.c, P = p.p, t = p.t, v = (c % P == 0) ? c / P - 1 : Math.floor(c / P), arr = [], opt = [];
  for (let i = 1; i <= P &&  i + P * v <= t; i ++) {
    let n = i + P * v;
    (n == c) ? 
    arr.push(<li className='active' key={n}><a>{n}</a></li>) : 
    arr.push(<li key={n}><a onClick={p.page}>{n}</a></li>);
  }
  for (let i = 1; i <= t; i++) {
    opt.push(<option value={i} key={i}>{i}</option>);
  }
  return (
    <div className="row">
    <ul className='pagination'>
      {v > 0 && <li><a onClick={p.page}>&lt;&lt;</a></li>}
      {c !== 1 && <li key='prev'><a onClick={p.page}>&lt;</a></li>}
      {arr}
      {c !== t && <li key='next'><a onClick={p.page}>&gt;</a></li>}
      {v < Math.floor(t / p) && <li><a onClick={p.page}>&gt;&gt;</a></li>}
    </ul>
    <select className='form-control input-sm' value={c} onChange={p.page}>
      {opt}
    </select>
    </div>
  );
}

class App extends React.Component {
  constructor(d) {
    super(d);
    this.state = {
      D: d.d,
      P: 20,
      R: 20,
      N: d.d.length,
      C: 1,
      H: d.h
    };
    this.page = this.page.bind(this);
  }
  page(e) {
    let c = (e.target.value) ? e.target.value : e.target.text;
    console.dir(c);
    this.setState({ C: c })
  }
  /*switch (v) {
      case 'prev':
        c -= 1;
        break;
      case 'next':
        c += 1;
        break;
      case 'dcr':
        c = ((c % p == 0) ? c / p - 2 : Math.floor(c / p) - 1) * p + 1;
        break;
      case 'icr':
        c = ((c % p == 0) ? c / p : Math.floor(c / p) + 1) * p + 1;
        break;
      default:
        c = +v;
    }*/
  render() {
    let c = this.state.C, r = this.state.R, p = this.state.P, n = this.state.N;
    let a = (r * c - 1 < n) ? this.state.D.slice((c - 1) * r, r * c) : this.state.D.slice((c - 1) * r, n + 1);
    return (
      <div className="row">
      <Table d={a} p={(c - 1) * r + 1} h={this.state.H} />
      <Page c={c} p={p} t={Math.ceil(n / r)} page={this.page} />
      </div>
    );
  }
}

function Root(p) {
  return (
    <html lang='zh-Hant-TW'>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>App</title>
      </head>
      <body>
        <div className="container">
          <div className="row" id="content" data-d={JSON.stringify(p.d)} data-h={JSON.stringify(p.h)}>
            <App d={p.d} h={p.h} />
          </div>
        </div>
      <link rel="stylesheet" href="/pub/css/bootstrap.min.css" />
      <script src="/pub/js/react.js"></script>
      <script src="/pub/js/react-dom.js"></script>
      <script src="/pub/js/jquery-3.2.1.min.js"></script>
      <script src="/pub/js/bootstrap.min.js"></script>
      <script src="/pub/js/app.js"></script>
      </body>
    </html>
  );
}

if (this.document) {
  let e = document.getElementById('content');
  ReactDOM.render(<App d={JSON.parse(e.dataset.d)} h={JSON.parse(e.dataset.h)} />, e);
  e.removeAttribute('data-d');
}