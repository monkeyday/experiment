const React = require('react'),
      d3 = require('d3');
module.exports = (D, H) => React.createElement(Root, { d: D, h: H });

function Row(d) {
  let a = [];
  console.log(d.d);
  for (let i in d.d) {
    a.push(React.createElement(
      'td',
      { key: i },
      d.d[i]
    ));
  }
  //a.push(<td><a href={'d/' + (d.l)}>Del</a></td>);
  return React.createElement(
    'tr',
    null,
    a
  );
}

function Table(p) {
  let a = p.h.map((v, i) => React.createElement(
    'td',
    { key: i },
    v
  ));
  let b = p.d.map((v, i) => React.createElement(Row, { key: i, i: i, d: v, l: p.p + i - 1 }));
  return React.createElement(
    'table',
    { className: 'table table-bordered table-hover' },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        a,
        React.createElement(
          'td',
          null,
          '\u522A\u9664'
        )
      )
    ),
    React.createElement(
      'tbody',
      null,
      b
    )
  );
}

//c: current page, t: total pages, P: pages per view, v: current view, p: actual page
function Page(p) {
  let c = p.c,
      P = p.p,
      t = p.t,
      v = c % P == 0 ? c / P - 1 : Math.floor(c / P),
      arr = [],
      opt = [];
  for (let i = 1; i <= P && i + P * v <= t; i++) {
    let n = i + P * v;
    n == c ? arr.push(React.createElement(
      'li',
      { className: 'active', key: n },
      React.createElement(
        'a',
        null,
        n
      )
    )) : arr.push(React.createElement(
      'li',
      { key: n },
      React.createElement(
        'a',
        { onClick: p.page },
        n
      )
    ));
  }
  for (let i = 1; i <= t; i++) {
    opt.push(React.createElement(
      'option',
      { value: i, key: i },
      i
    ));
  }
  return React.createElement(
    'div',
    { className: 'row' },
    React.createElement(
      'ul',
      { className: 'pagination' },
      v > 0 && React.createElement(
        'li',
        null,
        React.createElement(
          'a',
          { onClick: p.page },
          '<<'
        )
      ),
      c !== 1 && React.createElement(
        'li',
        { key: 'prev' },
        React.createElement(
          'a',
          { onClick: p.page },
          '<'
        )
      ),
      arr,
      c !== t && React.createElement(
        'li',
        { key: 'next' },
        React.createElement(
          'a',
          { onClick: p.page },
          '>'
        )
      ),
      v < Math.floor(t / p) && React.createElement(
        'li',
        null,
        React.createElement(
          'a',
          { onClick: p.page },
          '>>'
        )
      )
    ),
    React.createElement(
      'select',
      { className: 'form-control input-sm', value: c, onChange: p.page },
      opt
    )
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
    let c = e.target.value ? e.target.value : e.target.text;
    console.dir(c);
    this.setState({ C: c });
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
    let c = this.state.C,
        r = this.state.R,
        p = this.state.P,
        n = this.state.N;
    let a = r * c - 1 < n ? this.state.D.slice((c - 1) * r, r * c) : this.state.D.slice((c - 1) * r, n + 1);
    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(Table, { d: a, p: (c - 1) * r + 1, h: this.state.H }),
      React.createElement(Page, { c: c, p: p, t: Math.ceil(n / r), page: this.page })
    );
  }
}

function Root(p) {
  return React.createElement(
    'html',
    { lang: 'zh-Hant-TW' },
    React.createElement(
      'head',
      null,
      React.createElement('meta', { charset: 'UTF-8' }),
      React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      React.createElement(
        'title',
        null,
        'App'
      )
    ),
    React.createElement(
      'body',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row', id: 'content', 'data-d': JSON.stringify(p.d), 'data-h': JSON.stringify(p.h) },
          React.createElement(App, { d: p.d, h: p.h })
        )
      ),
      React.createElement('link', { rel: 'stylesheet', href: '/pub/css/bootstrap.min.css' }),
      React.createElement('script', { src: '/pub/js/react.js' }),
      React.createElement('script', { src: '/pub/js/react-dom.js' }),
      React.createElement('script', { src: '/pub/js/jquery-3.2.1.min.js' }),
      React.createElement('script', { src: '/pub/js/bootstrap.min.js' }),
      React.createElement('script', { src: '/pub/js/app.js' })
    )
  );
}

if (this.document) {
  let e = document.getElementById('content');
  ReactDOM.render(React.createElement(App, { d: JSON.parse(e.dataset.d), h: JSON.parse(e.dataset.h) }), e);
  e.removeAttribute('data-d');
}