function Checkbox(p) {
  let a = [],
      b = [];
  let r = p.d.reduce((t, e) => {
    if (t.indexOf(e.p_code) == -1) {
      t.push(e.p_code);
      b.push(e);
    }
    return t;
  }, []);
  r.forEach((v, i) => {
    a.push(React.createElement(
      'label',
      { className: 'checkbox-inline', key: v + b[i].m_code },
      React.createElement('input', { id: v, name: 'p_code', type: 'checkbox', value: v, onClick: p.f }),
      b[i].p_name
    ));
  });
  return React.createElement(
    'div',
    { className: 'checkbox' },
    a
  );
}

function Form(p) {
  return React.createElement(
    'form',
    { id: 'filter', className: 'form-inline' },
    React.createElement(Checkbox, { d: p.d, f: p.f })
  );
}

function Text(p) {
  let d = p.d;
  return React.createElement(
    'text',
    { x: d.x, y: d.y, dx: d.dx, dy: d.dy, fill: d.f, stroke: d.s, strokeWidth: d.b, strokeDasharray: d.d, fontSize: d.fs, fontWeight: d.fw, opacity: d.o },
    d.c
  );
}

function Line(p) {
  let d = p.d;
  return React.createElement('line', { x1: d.x[0], y1: d.y[0], x2: d.x[1], y2: d.y[1], stroke: d.s, strokeWidth: d.b, strokeDasharray: d.d, strokeLinecap: d.l, opacity: d.o });
}

function Rect(p) {
  let d = p.d;
  return React.createElement('rect', { x: d.x[0], y: d.y[0], width: d.w, height: d.h, fill: d.f, stroke: d.s, strokeWidth: d.b, strokeDasharray: d.d, rx: d.x[1], ry: d.y[1], opacity: d.o, transform: d.t });
}

function Circle(p) {
  let d = p.d;
  return React.createElement('circle', { cx: d.x, cy: d.y, r: d.r, fill: d.f, stroke: d.s, strokeWidth: d.b, strokeDasharray: d.d, opacity: d.o });
}

function Ellipse(p) {
  let d = p.d;
  return React.createElement('ellipse', { cx: d.x[0], cy: d.y[0], rx: d.x[1], ry: d.y[1], fill: d.f, stroke: d.s, strokeWidth: d.b, strokeDasharray: d.d, opacity: d.o });
}

function Polygon(p) {
  let d = p.d;
  return React.createElement('polygon', { points: d.p, fill: d.f, fillRule: d.r, stroke: d.s, strokeWidth: d.b, strokeDasharray: d.d, opacity: d.o });
}

function Polyline(p) {
  let d = p.d;
  return React.createElement('polyline', { points: d.p, fill: d.f, stroke: d.s, strokeWidth: d.b, strokeDasharray: d.d, opacity: d.o });
}

function Path(p) {
  return React.createElement('path', { d: p.d('p_code', 'avg_price'), fill: p.f, stroke: p.s, strokeWidth: p.b, strokeDasharray: p.d, opacity: p.o });
}

function Round(p) {
  let a = [],
      b = [];
  let r = p.s.reduce((t, e) => {
    if (t.indexOf(e.p_code) == -1) {
      t.push(e.p_code);
      b.push(e);
    }
    return t;
  }, []);
  r.forEach((e, i) => {
    a.push(React.createElement(
      'g',
      { key: i },
      React.createElement(Text, { key: 't' + i, d: { x: p.xS(b[i].m_name), y: p.yS(b[i].avg_price), dx: 5, dy: -5, f: p.ca[i % 20], b: 1, d: '1,2', fs: 12, fw: 600, o: 1, t: b[i].avg_price } }),
      React.createElement(Circle, { key: 'c' + i, d: { x: p.xS(b[i].m_name), y: p.yS(b[i].avg_price), r: p.rS(b[i].amount), s: p.ca[i % 20], f: p.color(b[i].amount), b: 1, o: 0.7 } })
    ));
  });
  return React.createElement(
    'g',
    null,
    a
  );
}

class Graph extends React.Component {
  constructor(p) {
    super(p);

    this.state = {
      D: p.d,
      N: p.d.length,
      G: { W: 800, H: 800, P: 100, M: 10 },
      C: d3.scaleOrdinal(d3.schemeCategory20).range() //color array
    };

    this.xS = k => d3.scaleBand().domain(this.state.D.map(e => e[k])).rangeRound([0, this.state.G.W - this.state.G.P * 2]);

    this.yS = k => d3.scaleLinear().domain([d3.min(this.state.D, d => d[k]), d3.max(this.state.D, d => d[k])]).range([this.state.G.H - this.state.G.P * 2, 0]);

    this.rS = k => d3.scaleSqrt().domain([d3.min(this.state.D, d => d[k]), d3.max(this.state.D, d => d[k])]).range([0, this.state.G.W / 10]);

    this.color = k => d3.scaleSequential(d3.interpolateRainbow).domain([d3.min(this.state.D, d => d[k]), d3.max(this.state.D, d => d[k])]);

    this.date = d3.scaleTime().domain([new Date('2017-01-01'), new Date(d3.max(this.state.D, d => d['date']))]).range([0, this.state.G.W - this.state.G.P * 2]);

    this.path = this.path.bind(this);

    this.click = this.click.bind(this);
  }

  componentDidMount() {
    let xA = d3.axisBottom(this.xS('m_name')).ticks(10);
    let yA = d3.axisLeft(this.yS('avg_price')).ticks(10);
    let dA = d3.axisBottom(this.date).ticks(d3.timeMonth.every(1));
    d3.select('#x').call(xA);
    d3.select('#y').call(yA);
    d3.select('#d').call(dA);
    /*let p = d3.path();
    p.moveTo(100, 350);
    p.quadraticCurveTo(200, -200, 300, 350);
    p.quadraticCurveTo(400, 750, 500, 350);
    this.setState({ path: p.toString() });*/
  }

  path(xK, yK) {
    let p = d3.path(),
        b = [];
    let r = this.state.D.reduce((t, e) => {
      if (t.indexOf(e[xK]) == -1) {
        t.push(e[xK]);
        b.push(e);
      }
      return t;
    }, []);
    r.forEach((e, i) => {
      let x = this.xS(xK)(b[i][xK]),
          y = this.yS(yK)(b[i][yK]);
      if (i == 0) {
        p.moveTo(0, y);
      } else {
        p.lineTo(x, y);
      }
    });
    return p.toString();
  }

  click(e) {
    console.log(e.target.value);
    this.setState({ D: this.state.D.filter(v => v.p_code == e.target.value) });
  }

  render() {
    let path = { d: this.path, s: 'white', f: 'none' };
    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(Form, { d: this.state.D, f: this.click }),
      React.createElement(
        'svg',
        { id: 'graph', width: this.state.G.W, height: this.state.G.H, style: { margin: this.state.G.M, padding: this.state.G.P } },
        React.createElement(
          'g',
          null,
          React.createElement(Rect, { d: { x: this.state.G.P, y: this.state.G.P, w: this.state.G.W - this.state.G.P * 2, h: this.state.G.H - this.state.G.P * 2, f: '#ffc', s: '#cf9', b: 3 } }),
          React.createElement(Line, { d: { x: [0, 100], y: [0, 100], s: '#f9f', b: 2, d: '5,4', l: 'round' } }),
          React.createElement(Round, { s: this.state.D, xS: this.xS('m_name'), yS: this.yS('avg_price'), rS: this.rS('amount'), color: this.color('amount'), ca: this.state.C })
        ),
        React.createElement(Ellipse, { d: { x: [200, 30], y: [200, 20], f: 'navy', s: 'white', d: '5,4', o: 0.5 } }),
        React.createElement(Rect, { d: { x: [350, 10], y: [50, 10], w: 50, h: 50, f: 'pink', t: 'rotate(10 20,40)' } }),
        React.createElement(Polygon, { d: { p: '100,50 100,250 200,250', f: 'orange', r: 'nonzero', s: 'lime', b: 3, d: '5,4', o: 0.5 } }),
        React.createElement(Polyline, { d: { p: '50,350 150,150 250,50', f: 'none', s: 'brown', b: 2, d: '5,4', o: 0.3 } }),
        React.createElement(Text, { s: this.state.D, xS: this.xS('p_code'), yS: this.yS('avg_price'), d: { x: [100, 5], y: [100, -5], f: 'blue', s: 'white', b: 1, d: '5,4', c: 'Hello', fs: 36, o: 0.5 } }),
        React.createElement(Path, path),
        React.createElement('g', { id: 'x' }),
        React.createElement('g', { id: 'y' }),
        React.createElement('g', { id: 'd', transform: `translate(0, ${this.state.G.H - this.state.G.P * 2})` })
      )
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
        { className: 'container', id: 'content', 'data-d': JSON.stringify(p.d) },
        React.createElement(Graph, { d: p.d })
      ),
      React.createElement('link', { rel: 'stylesheet', href: '/pub/css/bootstrap.min.css' }),
      React.createElement('script', { src: '/pub/js/react.js' }),
      React.createElement('script', { src: '/pub/js/react-dom.js' }),
      React.createElement('script', { src: '/pub/js/jquery-3.2.1.min.js' }),
      React.createElement('script', { src: '/pub/js/bootstrap.min.js' }),
      React.createElement('script', { src: '/pub/js/d3.min.js' }),
      React.createElement('script', { src: '/pub/js/g.js' })
    )
  );
}

if (this.document) {
  let e = document.getElementById('content');
  ReactDOM.render(React.createElement(Graph, { d: JSON.parse(e.dataset.d) }), e);
  e.removeAttribute('data-d');
}
//data, scale, linear, domain, range, ordinal, rangeBand, axis, orient, ticks, nest, interpolate
/*var o = { t: 20, r: 20, b: 30, l: 40, w: 640, h: 300 };
var nest = d3.nest().key((d) => d[9]).sortKeys(d3.ascending).entries(work);
o.m = d3.max(work, (d) => +d[7]);
o.y = d3.scale.linear().domain([0, o.m]).range([o.h-o.t-o.b, 0]);
o.x = d3.scale.ordinal().domain(work.map((elt) => elt[9])).rangeBands([0, o.w-o.l-o.r]);
o.xaxis = d3.svg.axis().scale(o.x).orient('bottom');
o.yaxis = d3.svg.axis().scale(o.y).orient('left').ticks(5);
d3.select('#graph').attr({ width: o.w + 'px', height: o.h + 'px' });
d3.select('#graph').selectAll('g').remove();
o.g = d3.select('#graph').append('g').attr('transform', 'translate(' + o.l + ',' + o.t + ')');
o.g.append('g').attr('transform', 'translate(0,' + (o.h-o.t-o.b) + ')').call(o.xaxis);
o.g.append('g').call(o.yaxis);
//o.poly = work.map((elt) => o.x(elt[1]) + ',' + o.y(elt[7]));
//o.g.append('polyline').attr('points', o.poly.join(' '));
o.bar = o.g.selectAll('.bar').data(nest).enter().append('g').attr({ class: 'bar' });
o.bar.selectAll('circle').data((d) => d.values).enter().append('circle').attr({ cx: (d) => o.x(d[9]) + 'px',cy: (d) => o.y(d[7]) + 'px', r: '3px' });
o.bar.selectAll('text').data((d) => d.values).enter().append('text').attr({ x: (d) => o.x(d[9]) + 'px', y: (d) => o.y(d[7]) + 'px', dy:'1em' }).text((d) => d[7]);
o.bar.selectAll('polyline').data((d) => d.values).enter().append('polyline').attr('points', (d) => d[9] + ',' + d[7]);*/