require("babel-register");
const React = require('react'), ReactDOMServer = require('react-dom/server'), R = require('../../src/jsx/root.jsx'), PropTypes = require('prop-types'), js = ['s', 'nav', 'f'];
R.use(js);
js.push('test');
module.exports = D => '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(<R.Root {...{ d: D, n: 'Test', j: js, c: 'Content' }} />);

class Content extends React.Component {
  constructor(props) {
    super(props); //define props

    this.state = {
      svg: { w: 800,h: 800},
      origin: { x: 5, y: 5 },
      tb: {r: 20, p:20, c: 1}
    }; //initial state
    
    this.evt = Svg.evt.bind(this); //bind methods
    this.dom = Svg.dom.bind(this);
    this.today = today.bind(this);
    
    this.b = { f: 'LightSkyBlue', s: 'brown', b: 3 };
    this.o = {
      ellipse: { cx: 150, rx: 30, cy: 150, ry: 20, f: 'url(#RG1)', s: 'white', d: '5,4', o: 0.5 },
      parallelogram: { x: 250, y: 250, a: 160, w: 50, h: 15, dom: this.dom },
      dot: Object.assign({}, this.b, { x: 105, y: 105, r: 3 }),
      rrect: { x: 0, rx: 10, y: 0, ry: 10, w: 50, h: 50, f: 'pink', t: 'rotate(10 20,40)', evt: this.evt },
      crect: Object.assign({}, this.b, { x: 300, y: 300, w: 50, h: 50, t: 'rotate(10 20,40)', o: 0.5, evt: this.evt }),
      polygon: { x: 0, y: 0, p: [[100, 120], [75, 130], [100, 250], [200, 250], [300, 150], [175, 200]], f: 'url(#LG1)', r: 'nonzero', s: 'url(#RG1)', b: 3, d: '5,4', o: 0.3, dom: this.dom },
      polyline: { x: 0, y: 0, p: [[50, 150], [150, 250], [250, 50], [200, 100]], f: 'none', s: 'brown', b: 2, d: '5,4', o: 0.3 },
      poly: { i: 7, R: 50, x: 100, y: 100, o: this.state.origin, evt: this.evt, dom: this.dom },
      triangle: { x: 300, y: 300, a: 15, s: 1, w: 150, dom: this.dom },
      position: { i: 8, s: 20, R: 100, x: 300, y: 300, w: 100, h: 80, r: 15, t: Svg.Triangle, a: 15, ss: 110, f: 'url(#RG1)' },
      text: { x: 100, dx: 5, y: 100, dy: -5, f: 'Teal', s: 'YellowGreen', b: 2, d: '5,4', t: 'Hello', fs: 36, fw: 600, o: 0.5, evt: this.evt },
      grid: { w: this.state.svg.w, h: this.state.svg.h, c: 100, r: 100, s: 'grey', b: 1, d: '2,5' },
      menu: [{ t: 'React SVG', d: ['Poly', 'Triangle', '-', 'Parellelogram'] }, { t: 'Produce Table' }, { t: 'React D3' }, { t: 'Process CSV' }, { t: 'Process XLS' }]
    };
  }
  
  componentDidMount() {
    $(() => {
      this.polyg = $(Svg.o[2]);
      this.polyg.on('mousedown', (e) => {
        e.preventDefault();
        console.log(e.clientX + '-' + e.clientY);
      });
      this.polyg.on('dragend', (e) => {
        e.preventDefault();
        console.log(e.clientX + '-' + e.clientY);
      });
      /*this.polyg.on('drop', (e) => {
        console.log(e.clientX + '-' + e.clientY);
      });*/
      this.polyg.draggable({
        addClasses: false,
        stop: (e, u) => {
          this.setState({ origin: { x: u.position.left, y: u.position.top - this.state.svg.y }});
          let x = u.position.left, y = u.position.top - this.state.svg.y;
          for (let p of Svg.o[2].points) {
            p.x += 10;
            p.y -= 10;
          }
          console.dir(Svg.o[2].points);
        },
        zIndex: 1
      });
    });
  }
  
  render() {
    let b = this.b, o = this.o;
    return (
    <div>
      <Svg.D dom={this.dom} />
      <Nav.Nav m={o.menu} evt={this.evt} />
      <Calendar c={this} />
      <Tb t='Agriculture' h={[]} d={this.props.d} to={this.today} r={this.state.tb.r} p={this.state.tb.p} c={this.state.tb.c} />
      <SVG d={this.props.d} />
      <svg width={this.state.svg.w} height={this.state.svg.h}>
        <Svg.Parallelogram {...o.parallelogram} />
        <Svg.Poly {...o.poly} />
        <Svg.Triangle {...o.triangle} />
        <Svg.Position {...o.position} />
        <Svg.Ellipse {...o.ellipse} />
        <Svg.Dot {...o.dot} />
        <Svg.RRect {...o.rrect} />
        <Svg.CRect {...o.crect} />
        <Svg.Polygon {...o.polygon} />
        <Svg.Polyline {...o.polyline} />
        <Svg.Text {...o.text} />
        <Svg.Grid {...o.grid} />
      </svg>
    </div>
    );
  }

}

class Container extends React.Component {
  constructor(p) {
    super(p); //define props

    this.state = {
      svg: { x: 800,y: 800},
      menu: {}
    }; //initial state
    
    this.sort = this.sort.bind(this); //bind methods

  }
  
  componentWillMount() { //before render
    console.log('component will mount');
  }
  
  componentDidMount() { //initialization with DOM or request
    this.timer = setInterval(() => this.tick(), 1000);
  }
  
  componentWillReceiveProps(np) {
    this.forceUpdate();
  }
  
  shouldComponentUpdate(np, ns) {
    
  }
  
  componentWillUpdate(np, ns) {
    
  }
  
  componentDidUpdate(pvp, pvs) {
    
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  
  handleChange() {
    this.setState((prv, p) => ({
      
    }));
  }
  
  render() {
    return (
      <div className='row'>
        <Nav m={this.props.g.M} cate={this.category} />
        <Filter filter={this.state.filter} setDate={this.setDate} search={this.search} />
        <Tb data={this.state.data.filter((v) => (v['作物'] !== ''))} sort={this.sort} opt={this.state.opt[this.state.type]} graph={this.graph} p={Math.ceil(this.state.opt[this.state.type].N / this.props.g.R)} c={this.state.cur} cate={this.category} />
        <Pagination c={this.state.cur} t={Math.ceil(this.state.opt[this.state.type].N / this.props.g.R)} p={this.props.g.P} page={this.page} />
        <Modal d={this.state.graph} />
      </div>
    );
  }
}

Content.defaultProps = {
  
};

/*Content.propTypes = {
  item: PropTypes.string  
};*/


if (this.document) {
  let e = document.getElementById('content');
  ReactDOM.render(<Content d={JSON.parse(e.dataset.d)} />, e);
  e.removeAttribute('data-d');
}