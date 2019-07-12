const React = require('react'), d3 = require('d3');
module.exports = D => <Root d={D} />;

function Text(p) {
  let d = p.d;
  return (
    <text x={d.x[0]} y={d.y[0]} dx={d.x[1]} dy={d.y[1]} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} strokeLinecap={d.l} opacity={d.o} transform={d.t} fontSize={d.fs}>{d.c}</text>
  );
}

function Line(p) {
  let d = p.d;
  return (
    <line x1={d.x[0]} y1={d.y[0]} x2={d.x[1]} y2={d.y[1]} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} strokeLinecap={d.l} opacity={d.o} />
  );
}

function Rect(p) {
  let d = p.d;
  return (
    <rect x={d.x[0]} y={d.y[0]} width={d.w} height={d.h} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} rx={d.x[1]} ry={d.y[1]} opacity={d.o} transform={d.t} />
  );
}

function Circle(p) {
  let d = p.d;
  return (
    <circle cx={d.x} cy={d.y} r={d.r} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} opacity={d.o} />
  );
}

function Ellipse(p) {
  let d = p.d;
  return (
    <ellipse cx={d.x[0]} cy={d.y[0]} rx={d.x[1]} ry={d.y[1]} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} opacity={d.o} />
  );
}

function Polygon(p) {
  let d = p.d;
  return (
    <polygon points={d.p} fill={d.f} fillRule={d.r} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} opacity={d.o} />
  );
}

function Polyline(p) {
  let d = p.d;
  return (
    <polyline points={d.p} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d}  opacity={d.o} />
  );
}

function Path(p) {
  return (
    <path d={p.d('p_code', 'avg_price')} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d}  opacity={p.o} />
  );
}

function Round(p) {
  let s = p.s;
  let a = s.D.map((e, i) => <Circle key={i} d={{ x: p.xS(e.m_name), y: p.yS(e.avg_price), r: p.rS(e.amount), s: s.C[i % 20], f: p.color(e.amount), b: 1, o: 0.2 }} />);
  return <g>{a}</g>;
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
    
    this.xS = (k) => d3.scaleBand().
    domain(this.state.D.map((e) => e[k])).
    rangeRound([0, this.state.G.W - this.state.G.P * 2]);
    
    this.yS = (k) => d3.scaleLinear().
    domain([d3.min(this.state.D, (d) => d[k]), d3.max(this.state.D, (d) => d[k])]).
    range([this.state.G.H - this.state.G.P * 2, 0]);
    
    this.rS = (k) => d3.scaleSqrt().
    domain([d3.min(this.state.D, (d) => d[k]), d3.max(this.state.D, (d) => d[k])]).
    range([0, this.state.G.W / 10]);
    
    this.color = (k) => d3.scaleSequential(d3.interpolateRainbow).
    domain([d3.min(this.state.D, (d) => d[k]), d3.max(this.state.D, (d) => d[k])]);
    
    this.date = d3.scaleTime().
    domain([new Date('2017-01-01'), new Date(d3.max(this.state.D, (d) => d['date']))]).
    range([0, this.state.G.W - this.state.G.P * 2]);
    
    this.path = this.path.bind(this);
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
    let p = d3.path();
    this.state.D.forEach((e, i) => {
      let x = this.xS(xK)(e[xK]), y = this.yS(yK)(e[yK]);
      if (i == 0) {
        p.moveTo(0, y);
      } else {
        p.lineTo(x, y);
      }
    });
    return p.toString();
  }
  render() {
    let path = { d: this.path, s: 'white', f: 'none' };
    return (
      <svg id='graph' width={this.state.G.W} height={this.state.G.H} style={{ margin: this.state.G.M, padding: this.state.G.P }}>
      <g>
        <Rect d={{ x: this.state.G.P, y: this.state.G.P, w: this.state.G.W - this.state.G.P * 2, h: this.state.G.H - this.state.G.P * 2, f: '#ffc', s: '#cf9', b: 3 }} />
        <Line d={{ x: [0, 100], y: [0, 100], s: '#f9f', b: 2, d: '5,4', l: 'round' }} />
        <Round s={this.state} xS={this.xS('m_name')} yS={this.yS('avg_price')} rS={this.rS('amount')} color={this.color('amount')} />
      </g>
        <Ellipse d={{ x: [200, 30], y: [200, 20], f: 'navy', s: 'white', d: '5,4', o: 0.5}} />
        <Rect d={{ x: [350, 10], y: [50, 10], w: 50, h: 50, f: 'pink', t: 'rotate(10 20,40)' }} />
        <Polygon d={{ p: '100,50 100,250 200,250', f: 'orange', r: 'nonzero', s: 'lime', b: 3, d: '5,4', o: 0.5 }} />
        <Polyline d={{ p: '50,350 150,150 250,50', f: 'none', s: 'brown', b: 2, d: '5,4', o: 0.3 }} />
        <Text d={{ x: [100, 5] , y: [100, -5], f: 'blue', s: 'white', b: 1, d: '5,4', c: 'Hello', fs: 36, o: 0.5 }} />
        /*<Path {...path} />*/
      <g id='x'></g>
      <g id='y'></g>
      <g id='d' transform={`translate(0, ${this.state.G.H - this.state.G.P * 2})`}></g>
      </svg>
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
          <div className="row" id="content" data-d={JSON.stringify(p.d)}>
            <Graph d={p.d} />
          </div>
        </div>
      <link rel="stylesheet" href="/pub/css/bootstrap.min.css" />
      <script src="/pub/js/react.js"></script>
      <script src="/pub/js/react-dom.js"></script>
      <script src="/pub/js/jquery-3.2.1.min.js"></script>
      <script src="/pub/js/bootstrap.min.js"></script>
      <script src="/pub/js/d3.min.js"></script>
      <script src="/pub/js/graph.js"></script>
      </body>
    </html>
  );
}

if (this.document) {
  let e = document.getElementById('content');
  ReactDOM.render(<Graph d={JSON.parse(e.dataset.d)} />, e);
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