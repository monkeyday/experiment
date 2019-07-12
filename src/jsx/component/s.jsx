const Svg = {
  o: [],
  Text(p) { //text-anchor: start, middle, end, inherit
    return (
    <text x={p.x} y={p.y} dx={p.dx} dy={p.dy} rotate={p.r} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d} fontSize={p.fs} fontWeight={p.fw} textAnchor={p.a} opacity={p.o} onCopy={p.evt}>{p.t}</text>
    );
  },
  SubText(p) {
    return (
    <tspan x={p.x} y={p.y} dx={p.dx} dy={p.dy} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d} fontSize={p.fs} fontWeight={p.fw} opacity={p.o}>{p.t}</tspan>
    );
  },
  LinkText(p) {
    return (
    <a href={p.l} target='_blank'>
    <text x={p.x} y={p.y} dx={p.dx} dy={p.dy} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d} fontSize={p.fs} fontWeight={p.fw} opacity={p.o}>{p.t}</text>
    </a>
    );
  },
  Line(p) { //stroke-linecap: butt, round, square, stroke-dasharray: length, space, length, space,...
    return (
    <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d} strokeLinecap={p.l} opacity={p.o} />
    );
  },
  Rect(p) {
    return (
    <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d} opacity={p.o} fillOpacity={p.fo} strokeOpacity={p.so} transform={p.t} onClick={p.evt} />
    );
  },
  CRect(p) {
    let x = p.x - p.w / 2;
    let y = p.y - p.h /2;
    return (
    <Svg.Rect {...{ x: x, y: y, w: p.w, h: p.h, f: p.f, b: p.b, s: p.s, t: p.t, o: p.o, evt: p.evt }}  />
    );
  },
  RRect(p) {
    return (
    <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d} rx={p.rx} ry={p.ry} opacity={p.o} fillOpacity={p.fo} strokeOpacity={p.so} transform={p.t} onClick={p.evt} onDrag={p.evt} draggable={true} />
    );
  },
  Circle(p) {
    return (
    <circle cx={p.x} cy={p.y} r={p.r} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d} opacity={p.o} />
    );
  },
  Dot(p) {
    return (
    <circle cx={p.x} cy={p.y} r={p.r} fill={p.f} opacity={p.o} />
    );
  },
  Ellipse(p) {
    return (
    <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d} opacity={p.o} />
    );
  },
  Polygon(p) { //fill-rule: nonzero, evenodd stroke-linejoin: miter, round, bevel
    p.p.forEach((e) => {
      e[0] = e[0] + p.x;
      e[1] = e[1] + p.y;
    });
    let pt = p.p.reduce((t, e) => {
      t.push(e.join(','));
      return t;
    }, []).join(' ');
    return (
    <polygon points={pt} fill={p.f} fillRule={p.r} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d} opacity={p.o} onClick={p.evt} ref={p.dom} />
    );
  },
  Polyline(p) {
    p.p.forEach((e) => {
      e[0] = e[0] + p.x;
      e[1] = e[1] + p.y;
    });
    let pt = p.p.reduce((t, e) => {
      t.push(e.join(','));
      return t;
    }, []).join(' ');
    return (
    <polyline points={pt} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.d}  opacity={p.o} />
    );
  },
  Path(p) { //M = moveto, L = lineto, H = horizontal lineto, V = vertical lineto, C = curveto, S = smooth curveto, Q = quadratic Bézier curve, T = smooth quadratic Bézier curveto, A = elliptical Arc, Z = closepath
    return (
    <path d={p.d('p_code', 'avg_price')} fill={p.f} stroke={p.s} strokeWidth={p.b} strokeDasharray={p.sd}  opacity={p.o} />
    );
  },
  Round(p) {
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
      <Svg.Text  {...{ key: 't' + i, x: p.xS(b[i].m_name), y: p.yS(b[i].avg_price), dx: 5, dy: -5, f: p.ca[i % 20], b: 1, d: '1,2', fs: 12, fw: 600, o: 1, t: b[i].avg_price }} />
      <Svg.Circle {...{ key: 'c'+ i, x: p.xS(b[i].m_name), y: p.yS(b[i].avg_price), r: p.rS(b[i].amount), s: p.ca[i % 20], f: p.color(b[i].amount), b: 1, o: 0.7 }} />
      </g>
      );
    });
    return <g>{a}</g>;
  },
  Position(p) {
    let arr = [];
    for (let i = 0; i < p.i; i ++) {
      let a = p.e ? p.s + (p.e - p.s) / (p.i - 1) * i : p.s + 360 / p.i * i;
      let r = a * Math.PI / 180, 
      x = p.x + p.R * Math.cos(r), 
      y = p.y - p.R * Math.sin(r), 
      e = React.createElement(p.t, { x: x, y: y, key: i, w: p.w, h: p.h, f: p.f, o: 0.5, a: p.a, s: p.ss }, null);
      arr.push(e);
    }
    return (
    <g fill='blue' strokeWidth='5'>{arr}</g>
    );
  },
  Poly(p) {
    let arr = [];
    for (let i = p.i; i > 0; i --) {
      let s = 360 / p.i - (180 - 360 / p.i) / 2, 
      a = s + 360 / p.i * i, 
      r =  a * Math.PI / 180, 
      x = p.x + p.R * Math.cos(r), 
      y = p.y - p.R * Math.sin(r);  
      arr.push([x, y]);
    }
    return (
    <Svg.Polygon {...{ x: p.o.x, y: p.o.y, p: arr, f: 'url(#LG1)', r: 'nonzero', s: 'url(#RG1)', b: 3, d: '5,4', o: 0.3, dom: p.dom }} />);
  },
  Parallelogram(p) {
    let a = [], r = p.a * Math.PI / 180,
    x = p.x - p.w / 2 - p.h / 2 / Math.tan(r),
    y = p.y + p.h / 2;
    a.push([x, y], [x + p.w, y], [x + p.w + p.h / Math.tan(r), y - p.h], [x + p.h / Math.tan(r), y - p.h]);
    return (
    <Svg.Polygon {...{ x: 0, y: 0, p: a, f: 'url(#LG1)', r: 'nonzero', s: 'url(#RG1)', b: 3, d: '5,4', o: 0.3, dom: p.dom }} />);
  },
  Triangle(p) {
    let a = [], h = p.w / 2 * Math.tan(p.a * Math.PI / 180),
    s = p.s * Math.PI / 180, 
    b = Math.atan(h / p.w), 
    c = Math.sqrt(Math.pow(h / 2, 2) + Math.pow(p.w / 2, 2));
    a.push([p.x - Math.cos(s + b) * c, p.y + Math.sin(s + b) * c], [p.x + Math.cos(s - b) * c, p.y - Math.sin(s - b) * c], [p.x - Math.cos(Math.PI / 2 - s) * h / 2, p.y - Math.sin(Math.PI / 2 - s) * h / 2]);
    return (
    <Svg.Polygon {...{ x: 0, y: 0, p: a, f: 'url(#LG1)', r: 'nonzero', s: 'url(#RG1)', b: 3, d: '5,4', o: 0.3, dom: p.dom }} />);
  },
  Gradient(p) { //spreadMethod: pad, reflect, repeat
    let a = [];
    p.s.forEach((e, i) => a.push(<stop key={i} offset={e.f} stopColor={e.c} stopOpacity={e.o} />));
    return (p.t == 'l') ? 
    <linearGradient id={p.id} x1={p.x1} x2={p.x2} y1={p.y1} y2={p.y2} >{a}</linearGradient> : 
    <radialGradient id={p.id} cx={p.x} cy={p.y} r={p.r} fx={p.fx} fy={p.fy} >{a}</radialGradient>;
  },
  Grid(p) {
    let a = [];
    for (let i = 0; i <= p.w; i += p.c) {
      a.push(<Svg.Line key={'c' + i} x1={i} y1={0} x2={i} y2={p.h} s={p.s} b={p.b} d={p.d} />);
    }
    for (let i = 0; i <= p.h; i += p.r) {
      a.push(<Svg.Line key={'r' + i} x1={0} y1={i} x2={p.w} y2={i} s={p.s} b={p.b} d={p.d} />);
    }
    return (
    <g>{a}</g>
    );
  },
  Clip(p) {
    return (
    <clipPath id={p.id}>
    </clipPath>
    );
  },
  Mask(p) {
    return (
    <mask id={p.id}>
    </mask>
    );
  },
  D(p) {
    return (
    <div ref={p.dom}>Drag</div>
    );
  },
  evt(e) {
    e.preventDefault();
    console.dir(e.nativeEvent);
    console.dir(Svg.o);
  },
  dom(e) {
    Svg.o.push(e);
  }
};

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
      this.polyg = $(Svg.o[1]);
      this.polyg.draggable({
        addClasses: false,
        stop: (e, u) => {
          console.dir(this.polyg[1].points);
          let x = e.clientX, y = e.clientY;
          for (let p of this.polyg[1].points) {
            p.x += x;
            p.y += y;
          }
          console.dir(this.polyg[1].points);
          console.dir(u.position);
        }, //248.74639560909117,211.12604669781575 221.6941869558779,245.04844339512096 178.30581304412215,245.04844339512098 151.25360439090883,211.12604669781575 160.90842587659853,168.82550990706332 200,150 239
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
    console.dir(e.target);
  }
  
  onDragOver(e) {
    e.preventDefault();
    // Logic here
    console.log('onDragOver');
  }
  
  onDragStart(e){
    e.dataTransfer.setData('id', 'setTheId');
    console.log('onDragStart');
  }
  
  onDrop(e) {
    console.log('onDrop');
    var id = event.dataTransfer.getData('id');
    console.log('Dropped with id:', id);
  }
  
  render() {
    return (
      <svg id='graph' width={this.state.G.W} height={this.state.G.H} style={{ margin: this.state.G.M, padding: this.state.G.P }} version='1.1' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <Svg.Gradient id='RG1' t='r' s={[{f: '0%', c: 'green'}, {f: '30%', c: 'yellow'}, {f: '60%', c: 'orange'}, {f: '100%', c: 'purple', o: 0.5}]} />
          <Svg.Gradient id='LG1' t='l' s={[{f: '0%', c: 'green'}, {f: '30%', c: 'yellow'}, {f: '60%', c: 'orange'}, {f: '100%', c: 'purple', o: 0.5}]} />
        </defs>
        <g>
          <Svg.Rect {...{ x: 0, y: 0, w: this.state.G.W - this.state.G.P * 2, h: this.state.G.H - this.state.G.P * 2, f: '#ffc', s: '#cf9', b: 3 }} />
          <Svg.Line {...{ x1: 0, x2: 100, y1: 0, y2: 100, s: '#f9f', b: 2, d: '5,4', l: 'round' }} />
          <Svg.Dot {...{ x: 150 + this.state.X, y: 150 + this.state.Y, f: 'black', o: 1 }} />
          <Svg.Round s={this.state.D} xS={this.xS('m_name')} yS={this.yS('avg_price')} rS={this.rS('amount')} color={this.color('amount')} ca={this.state.C} />
        </g>
        
        <Svg.Path {...{ d: this.path, s: 'grey', f: 'none' }} />
        <path d='M100 100 C 80 200, 270 200, 250 100 S 420 0, 400 100, 570 200, 550 100' fill='transparent' stroke='orange' strokeWidth={3} />
        <path d='M100 300 Q 150 350, 200 300 T 300 300, 400 300' fill='transparent' stroke='olive' strokeWidth={3} />
        <g id='x'></g>
        <g id='y'></g>
        <g id='d' transform={`translate(0, ${this.state.G.H - this.state.G.P * 2})`}></g>
      </svg>
    );
  }
}