const React = require('react'), d3 = require('d3'), ReactDOMServer = require('react-dom/server');
module.exports = D => '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(<Root d={D} />);

function Text(p) { //text-anchor: start, middle, end, inherit
  let d = p.d;
  return (
    <text x={d.x} y={d.y} dx={d.dx} dy={d.dy} rotate={d.r} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} fontSize={d.fs} fontWeight={d.fw} textAnchor={d.a} opacity={d.o}>{d.t}</text>
  );
}

function SubText(p) {
  let d = p.dl
  return (
    <tspan x={d.x} y={d.y} dx={d.dx} dy={d.dy} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} fontSize={d.fs} fontWeight={d.fw} opacity={d.o}>{d.t}</tspan>
  );
}

function LinkText(p) {
  let d = p.d;
  return (
    <a href={d.l} target='_blank'>
    <text x={d.x} y={d.y} dx={d.dx} dy={d.dy} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} fontSize={d.fs} fontWeight={d.fw} opacity={d.o}>{d.t}</text>
    </a>
  );
}

function Line(p) { //stroke-linecap: butt, round, square, stroke-dasharray: length, space, length, space,...
  let d = p.d;
  return (
    <line x1={d.x[0]} y1={d.y[0]} x2={d.x[1]} y2={d.y[1]} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} strokeLinecap={d.l} opacity={d.o} />
  );
}

function Rect(p) {
  let d = p.d;
  return (
    <rect x={d.x} y={d.y} width={d.w} height={d.h} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} opacity={d.o} fillOpacity={d.fo} strokeOpacity={d.so} transform={d.t} />
  );
}

function CRect(p) {
  let d = p.d;
  let x = d.x - d.w / 2;
  let y = d.y - d.h /2;
  return (
    <Rect d={{ x: x, y: y, w: d.w, h: d.h, f: d.f, t: d.t, o: d.o }} />
  );
}

function RoundRect(p) {
  let d = p.d;
  return (
    <rect x={d.x[0]} y={d.y[0]} width={d.w} height={d.h} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} rx={d.x[1]} ry={d.y[1]} opacity={d.o} fillOpacity={d.fo} strokeOpacity={d.so} transform={d.t} />
  );
}

function Circle(p) {
  let d = p.d;
  return (
    <circle cx={d.x} cy={d.y} r={d.r} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} opacity={d.o} />
  );
}

function Dot(p) {
  let d = p.d;
  return (
    <circle cx={d.x} cy={d.y} r='1' fill={d.f} opacity={d.o} />
  );
}

function Ellipse(p) {
  let d = p.d;
  return (
    <ellipse cx={d.x[0]} cy={d.y[0]} rx={d.x[1]} ry={d.y[1]} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} opacity={d.o} />
  );
}

function Polygon(p) { //fill-rule: nonzero, evenodd stroke-linejoin: miter, round, bevel
  let d = p.d;
  d.p.forEach((e) => {
    e[0] = e[0] + d.x;
    e[1] = e[1] + d.y;
  });
  let pt = d.p.reduce((t, e) => {
    t.push(e.join(','));
    return t;
  }, []).join(' ');
  return (
    <polygon points={pt} fill={d.f} fillRule={d.r} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d} opacity={d.o} onClick={p.evt} onDragEndCapture={p.evt} />
  );
}

function Polyline(p) {
  let d = p.d;
  d.p.forEach((e) => {
    e[0] = e[0] + d.x;
    e[1] = e[1] + d.y;
  });
  let pt = d.p.reduce((t, e) => {
    t.push(e.join(','));
    return t;
  }, []).join(' ');
  return (
    <polyline points={pt} fill={d.f} stroke={d.s} strokeWidth={d.b} strokeDasharray={d.d}  opacity={d.o} />
  );
}

function Path(p) { //M = moveto, L = lineto, H = horizontal lineto, V = vertical lineto, C = curveto, S = smooth curveto, Q = quadratic Bézier curve, T = smooth quadratic Bézier curveto, A = elliptical Arc, Z = closepath
  return (
    <path d={p.d('p_code', 'avg_price')} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d}  opacity={p.o} />
  );
}

function Round(p) {
  let a = [], b = [];
  let r = p.s.reduce((t, e) => {
    if (t.indexOf(e.p_code) == -1) {
      t.push(e.p_code);
      b.push(e);
    }
    return t;
  }, []);
  r.forEach((e, i) => {
    a.push(
    <g key={i}>
    <Text key={'t' + i} d={{ x: p.xS(b[i].m_name), y: p.yS(b[i].avg_price), dx: 5, dy: -5, f: p.ca[i % 20], b: 1, d: '1,2', fs: 12, fw: 600, o: 1, t: b[i].avg_price }} />
    <Circle key={'c'+ i} d={{ x: p.xS(b[i].m_name), y: p.yS(b[i].avg_price), r: p.rS(b[i].amount), s: p.ca[i % 20], f: p.color(b[i].amount), b: 1, o: 0.7 }} />
    </g>
    );
  });
  return <g>{a}</g>;
}

function Position(p) {
  let arr = [];
  for (let i = 0; i < p.i; i ++) {
    let a = p.e ? p.s + (p.e - p.s) / (p.i - 1) * i : p.s + 360 / p.i * i;
    let r = a * Math.PI / 180;
    let x = p.x + p.R * Math.cos(r);
    let y = p.y - p.R * Math.sin(r);
    let e = React.createElement(p.t, { x: x, y: y, key: i, w: p.w, h: p.h, f: p.f, o: 0.5, a: p.a, s: p.ss }, null);
    arr.push(e);
  }
  return (
    <g fill='blue' strokeWidth='5'>{arr}</g>
  );
}

function Poly(p) {
  let arr = [];
  for (let i = p.i; i > 0; i --) {
    let s = 360 / p.i - (180 - 360 / p.i) / 2;
    let a = s + 360 / p.i * i; //angle
    let r =  a * Math.PI / 180; //radian
    let x = p.x + p.R * Math.cos(r);
    let y = p.y - p.R * Math.sin(r);  
    arr.push([x, y]);
  }
  return (
  <Polygon d={{ x: p.x, y: p.y, p: arr, f: 'url(#LG1)', r: 'nonzero', s: 'url(#RG1)', b: 3, d: '5,4', o: 0.3 }} />);
}

function Parallelogram(p) {
  let a = [];
  let r = p.a * Math.PI / 180;
  let x = p.x - p.w / 2 - p.h / 2 / Math.tan(r);
  let y = p.y + p.h / 2;
  a.push([x, y]);
  a.push([x + p.w, y]);
  a.push([x + p.w + p.h / Math.tan(r), y - p.h]);
  a.push([x + p.h / Math.tan(r), y - p.h]);
  return (
  <Polygon d={{ x: 0, y: 0, p: a, f: 'url(#LG1)', r: 'nonzero', s: 'url(#RG1)', b: 3, d: '5,4', o: 0.3 }} />);
}

function Triangle(p) {
  let a = [];
  let h = p.w / 2 * Math.tan(p.a * Math.PI / 180);
  let s = p.s * Math.PI / 180;
  let b = Math.atan(h / p.w);
  let c = Math.sqrt(Math.pow(h / 2, 2) + Math.pow(p.w / 2, 2));
  a.push([p.x - Math.cos(s + b) * c, p.y + Math.sin(s + b) * c]);
  a.push([p.x + Math.cos(s - b) * c, p.y - Math.sin(s - b) * c]);
  a.push([p.x - Math.cos(Math.PI / 2 - s) * h / 2, p.y - Math.sin(Math.PI / 2 - s) * h / 2]);
  return (
  <Polygon d={{ x: 0, y: 0, p: a, f: 'url(#LG1)', r: 'nonzero', s: 'url(#RG1)', b: 3, d: '5,4', o: 0.3 }} />);
}

function Gradient(p) { //spreadMethod: pad, reflect, repeat
  let a = [];
  p.s.forEach((e, i) => a.push(<stop key={i} offset={e.f} stopColor={e.c} stopOpacity={e.o} />));
  if (p.t == 'l') {
    return (
      <linearGradient id={p.id} x1={p.x1} x2={p.x2} y1={p.y1} y2={p.y2} >{a}</linearGradient>
    );
  } else {
    return (
      <radialGradient id={p.id} cx={p.x} cy={p.y} r={p.r} fx={p.fx} fy={p.fy} >{a}</radialGradient>
    );
  }
}

function Clip(p) {
  return (
    <clipPath id={p.id}>
    </clipPath>
  );
}

function Mask(p) {
  return (
    <mask id={p.id}>
    </mask>
  );
}

class SVG extends React.Component {
  constructor(p) {
    super(p);
    
    this.state = {
      D: p.d,
      N: p.d.length,
      G: { W: 800, H: 800, P: 100, M: 10 },
      C: d3.scaleOrdinal(d3.schemeCategory20).range(), //color array
      X: 0,
      Y: 0
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
    
    this.click = this.click.bind(this);
    
    this.evt = this.evt.bind(this);
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
    $(() => {
      $('polygon').draggable({
        addClasses: false,
        stop: (e, u) => {
          console.dir(u);
          this.setState({X: u.offset.left - u.originalPosition.left, Y: u.offset.top - u.originalPosition.top})
        },
        helper: 'clone',
        zIndex: 1
      });
      
    });
  }
  
  path(xK, yK) {
    let p = d3.path(), b = [];
    let r = this.state.D.reduce((t, e) => {
      if (t.indexOf(e[xK]) == -1) {
        t.push(e[xK]);
        b.push(e);
      }
      return t;
    }, []);
    r.forEach((e, i) => {
      let x = this.xS(xK)(b[i][xK]), y = this.yS(yK)(b[i][yK]);
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
    this.setState({ D: this.state.D.filter((v) => (v.p_code == e.target.value)) });
  }
  
  evt(e) {
    e.preventDefault();
    console.dir(e.target);
  }
  
  render() {
    let path = { d: this.path, s: 'grey', f: 'none' };
    return (
      <svg id='graph' width={this.state.G.W} height={this.state.G.H} style={{ margin: this.state.G.M, padding: this.state.G.P }} version='1.1' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <Gradient id='RG1' t='r' s={[{f: '0%', c: 'green'}, {f: '30%', c: 'yellow'}, {f: '60%', c: 'orange'}, {f: '100%', c: 'purple', o: 0.5}]} />
          <Gradient id='LG1' t='l' s={[{f: '0%', c: 'green'}, {f: '30%', c: 'yellow'}, {f: '60%', c: 'orange'}, {f: '100%', c: 'purple', o: 0.5}]} />
        </defs>
        <g>
          <Rect d={{ x: this.state.G.P, y: this.state.G.P, w: this.state.G.W - this.state.G.P * 2, h: this.state.G.H - this.state.G.P * 2, f: '#ffc', s: '#cf9', b: 3 }} />
          <Line d={{ x: [0, 100], y: [0, 100], s: '#f9f', b: 2, d: '5,4', l: 'round' }} />
          <Dot d={{ x: 150 + this.state.X, y: 150 + this.state.Y, f: 'black', o: 1 }} />
          <Round s={this.state.D} xS={this.xS('m_name')} yS={this.yS('avg_price')} rS={this.rS('amount')} color={this.color('amount')} ca={this.state.C} />
        </g>
        <Parallelogram x={300} y={300} a={160} w={50} h={15} />
        <Poly i={7} R={50} x={300} y={300} />
        <Triangle x={300} y={300} a={15} s={1} w={150} />
        <Position i={8} s={20} R={100} x={300} y={300} w={100} h={80} r={15} t={Triangle} a={15} ss={110} f='url(#RG1)' />
        <Ellipse d={{ x: [200, 30], y: [200, 20], f: 'url(#RG1)', s: 'white', d: '5,4', o: 0.5}} />
        <Dot d={{ x: 150, y: 150, r: 1, f: 'black', s: 'black', b: 1 }} />
        <RoundRect d={{ x: [this.state.X, 10], y: [this.state.Y, 10], w: 50, h: 50, f: 'pink', t: 'rotate(10 20,40)' }} />
        <CRect d={{ x: 300, y: 300, w: 50, h: 50, f: 'pink', t: 'rotate(10 20,40)', o: 0.3 }} />
        <Polygon d={{ x: this.state.X, y: this.state.Y, p: [[100, 120], [75, 130], [100, 250], [200, 250], [300, 150], [175, 200]], f: 'url(#LG1)', r: 'nonzero', s: 'url(#RG1)', b: 3, d: '5,4', o: 0.3 }} evt={this.evt} />
        <Polyline d={{ x: this.state.X, y: this.state.Y, p: [[50, 150], [150, 250], [250, 50], [200, 100]], f: 'none', s: 'brown', b: 2, d: '5,4', o: 0.3 }} />
        <Text d={{ x: [100, 5] , y: [100, -5], f: 'blue', s: 'white', b: 3, d: '5,4', t: 'Hello', fs: 36, o: 0.5 }} />
        <Path {...path} />
        <path d='M100 100 C 80 200, 270 200, 250 100 S 420 0, 400 100, 570 200, 550 100' fill='transparent' stroke='orange' strokeWidth={3} />
        <path d='M100 300 Q 150 350, 200 300 T 300 300, 400 300' fill='transparent' stroke='olive' strokeWidth={3} />
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
        <title>SVG</title>
      </head>
      <body>
        <div className="container" id="content" data-d={JSON.stringify(p.d)}>
          <SVG d={p.d} />
        </div>
      <link rel="stylesheet" href="/pub/css/bootstrap.min.css" />
      <script src="/pub/js/react.js"></script>
      <script src="/pub/js/react-dom.js"></script>
      <script src="/pub/js/jquery-3.2.1.min.js"></script>
      <script src="/pub/js/bootstrap.min.js"></script>
      <script src="/pub/js/d3.min.js"></script>
      <script src="/pub/js/svg.js"></script>
      <script src="/pub/js/jquery-ui.min.js"></script>
      </body>
    </html>
  );
}

if (this.document) {
  let e = document.getElementById('content');
  ReactDOM.render(<SVG d={JSON.parse(e.dataset.d)} />, e);
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