function add (a, p, n, c) { //add repeated content into array
  for (let i = p; i < p + n; i ++) a[i] = c;
  return a;
}

function addPrev(a, p, n, y, m, d) { //add previous month days
  for (let i = p + n; i > 0; i --) a[n - i] = new Date(y, m, d - i + 1);
  return a;
}

function addNext(a, p, n, y, m, d) { //add next month days
  for (let i = 0; i < n; i ++) a[p + i] = new Date(y, m, i + 1);
  return a;
}

function toArr(d) {
  let a = [];
  d.forEach((e) => a.push(Object.values(e)));
  return a;  
}

function today(o) {
  let y = this.state.t.getFullYear(), m = this.state.t.getMonth(), d = this.state.t.getDate();
  return typeof e !== 'string' && y == o.getFullYear() && m == o.getMonth() && d == o.getDate() ? true : false;
}

function genClass(o, ex, cl) {
  let c = [];
  ex.forEach((e, i) => c.push(cl[i]));
  return c.join(' ');
}

function page(e) {
  let c = e.target.value ? e.target.value : e.target.text;
  c = c.indexOf('>') !== -1 ? this.state.c + 1 : +c;
  console.dir(c);
  this.setState({ r: 20, p:20, c: c })
}

const Nav = {
  Dropdown(p) {
    let a = p.d.map((e, i) => {
      return e !== '-' ? <li key={i}><a href='#' onClick={p.evt}>{e}</a></li> : 
      <li key={i} className='divider'></li>;
    });
    return (
    <li className='nav-item dropdown'>
      <a className='nav-link dropdown-toggle' data-toggle='dropdown'>{p.t}<span className='caret'></span></a>
      <ul className='dropdown-menu'>{a}</ul>
    </li>
    );
  },
  Nav(p) {
    let a = [];
    a = p.m.map((e, i) => {
      return e.d ? <Nav.Dropdown key={i} t={e.t} d={e.d} evt={p.evt} /> : 
      <li key={i} className='nav-item'><a href='#' className='nav-link' onClick={p.evt}>{e.t}</a></li>;
    });
    return <ul className='nav nav-tabs nav-fill'>{a}</ul>
  },
  Carousel(p) {
    let a = [], b = [];
    a.push(<li key={i} data-target={`#${p.id}`} data-slide-to={i}></li>);
    b.push(
    <div key={i} className='item active'>
      <img src={p.img} alt={p.a} />
      <div className='carousel-caption'>
        <h1>{p.t}</h1>
        <p>{p.p}</p>
      </div>
    </div>
    );
    return (
    <div id={p.id} className='carousel slide' data-ride='carousel' ref={(e) => this.e = e}>
      <ol className='carousel-indicators'>{a}</ol>
      <div className='carousel-inner'>{b}</div>
      <a href={`#${p.id}`} className='left carousel-control' data-slide='prev'><span></span></a>
      <a href={`#${p.id}`} className='right carousel-control' data-slide='next'><span></span></a>
    </div>
    );
  },
  Tab(p) {
    let a = [], b = [];
    a.push(<li><a href='' data-toggle='tab'>{p.e}</a></li>);
    b.push(<div className='tab-pane'></div>);
    return (
    <div>
    <ul className='nav nav-tabs'>{a}</ul>
    <div className='tab-content'>{b}</div>
    </div>
    );
  },
  Modal(p) {
    let a = [];
    a.push(<div className='row'><div className='col-md-3'></div></div>);
    /*<button type='button' className='btn btn-primary' data-toggle='modal' data-target=`#${p.id}`></button>*/
    return(
    <div className='modal fade bs-example-modal-lg' id={p.id} tabIndex='-1'>
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'><h4 className='modal-title'>{p.t}</h4></div>
          <div className='modal-body'>{a}</div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-default' data-dismiss='modal'>Close</button>
          </div>
        </div>
      </div>
    </div>
    );
  },
  Collapse(p) {
    let a = [];
    a.push(
    <div className='panel panel-default'>
      <div className='panel-heading'>
        <h4 className='panel-title'>
          <a data-toggle='collapse' data-parent={`#${p.id}`} href={p.a}>{p.t}</a>
        </h4>
      </div>
      <div className='panel-collapse collapse in'>
        <div className='panel-body'>{p.c}</div>
      </div>
    </div>
    );
    return <div className='panel-group' id={p.id}>{a}</div>
  }
};

const TB = {
  c: ['active', 'success', 'warning', 'danger', 'info'],
  Caption(p) {
    return (
    <caption className='bg-primary text-center'>
    {p.t}<br />
    {p.children}
    </caption>
    );
  },
  Th(p) {
    return p.d.map((e, i) => <th className='text-center' key={i}><a>{e}</a></th>);
  },
  Row(p) {
    /*arr.forEach((e, i, a) => {
      a[i].c = p.t(e) ? 'success' : '';
    });*/
    return Array.isArray(p.d) ? <tr><TB.Col d={p.d.map((e) => [e.getDate(), e.c])} /></tr> : <tr><TB.Col d={Object.values(p.d)} /></tr>
  },
  Col(p) {
    return p.d.map((e, i) => typeof e !== 'string' ? <td key={i} className={e[1]}><a>{e[0]}</a></td> : <td key={i}>{e}</td>);
  },
  Page(p) {
    let a = [], opt = [], c = p.c, P = p.p, t = p.t, v = (c % P == 0) ? c / P - 1 : Math.floor(c / P);
    for (let i = 1; i <= P && v * P + i <= t; i++) { //create pagination according to current page
      let n = v * P + i;
      n == c ? a.push(<li className='active' key={i}><a>{n}</a></li>) : 
      a.push(<li key={i}><a onClick={p.page}>{n}</a></li>);
    }
    for (let i = 1; i <= t; i++) { //create selection lists
      opt.push(<option value={i} key={i}>{i}</option>);
    }
    return (
    <div className='row text-center'>
      <div className='col-md-11'>
        <ul className='pagination'>
          {v > 0 && <li><a onClick={p.page}>&lt;&lt;</a></li>}
          {c !== 1 && <li key='prev'><a onClick={p.page}>&lt;</a></li>}
          {a}
          {c !== t && <li key='next'><a onClick={p.page}>&gt;</a></li>}
          {v < Math.floor(t / P) && <li><a onClick={p.page}>&gt;&gt;</a></li>}
        </ul>
      </div>
      <div className='col-md-1'>
        <select className='form-control input-sm' value={c} onChange={p.page}>
          {opt}
        </select>
      </div>
    </div>
    );
  }
};

class Tb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      d: props.d,
      p: props.p,
      r: props.r,
      c: props.c,
      h: props.h,
      t: 'Table'
    };
    this.page = page.bind(this);
  }
  
  render() {
    let _ = this.state, n = _.d.length, a = (_.r * _.c - 1 < n) ? _.d.slice((_.c - 1) * _.r, _.r * _.c) : _.d.slice((_.c - 1) * _.r, n + 1);
    return (
    <div>
    <table className='table table-bordered table-hover'>
      <TB.Caption t={_.t}>
      共{n}筆資料{n / _.r}頁<br />目前是第&nbsp;
      <span className='label label-warning'>{_.c}</span>&nbsp;頁
      </TB.Caption>
      <thead><tr><TB.Th d={_.h} /></tr></thead>
      <tbody>{a.map((e, i) => <TB.Row c={TB.c[i % 7]} d={e} key={i} />)}</tbody>
    </table>
    <TB.Page c={this.state.c} p={this.state.p} t={Math.ceil(this.state.d.length / this.state.r)} page={this.page} />
    </div>
    );
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    props.c.setState({ tb: {r: 20, p:20, c: 2} });
    let to = new Date(), y = props.y ? props.y : to.getFullYear(), feb = (y % 4 == 0 && y % 100 !== 0) || y % 400 == 0 ? 29 : 28;
    this.state = { //閏年2月為29天, month: 0~11, weekday: 0~6
      t: to,
      y: y,
      m: props.m ? props.m - 1 : to.getMonth(),
      n : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      yn : ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      d: [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    };
    this.month = this.month.bind(this);
    this.year = this.year.bind(this);
    this.today = today.bind(this);
  }
  
  month(y = this.state.y, m = this.state.m) {
    let a = [], b = [], d = this.state.d[m];
    
    for (let i = 1; i <= d; i ++) {
	    let o = new Date(y, m, i), w = o.getDay();
	    if (i == 1 && w !== 0) addPrev(a, 0, w, y, m - 1, this.state.d[m - 1]); //add(a, 0, w, '')
      a.push(o);
      if (i == d && w !== 6) addNext(a, a.length, 6 - w, y, m + 1, this.state.d[m + 1]); //add(a, a.length, 6 - w, '')
    }
    
    while(a.length > 0) b.push(a.splice(0, 7));
    return b;
  }
  
  year(y = this.state.y) {
    let a = [], b = [], d = this.state.d;
    for (let i = 0; i < 12; i ++) {
      let arr = [];
      for (let j = 1; j <= d[i]; j ++) {
        let o = new Date(y, i, j), w = o.getDay();
	      if (j == 1 && w !== 0) add(arr, 0, w, '');
        arr.push(o);
        if (j == d[i] && w !== 6) add(arr, arr.length, 6 - w, '');
      }
      a[i] = arr;
    }
    while(a.some((e) => e.length !== 0)) {
      let arr = [];
      a.forEach((e, i) => {
        e.length !== 0 ? arr.push(e.shift()) : arr.push('');
      });
      b.push(arr);
    }
    b = b.filter((e) => e.some((v) => v !== ''));
    b.forEach((e, i) => e.unshift(this.state.n[i % 7]));
    
    return b;
  }
  
  today(o) {
    let y = this.state.t.getFullYear(), m = this.state.t.getMonth(), d = this.state.t.getDate();
    return typeof e !== 'string' && y == o.getFullYear() && m == o.getMonth() && d == o.getDate() ? true : false;
  }
  
  componentDidMount() {
    
  }
  
  render() {
    let a = this.month(2017, 4).map((e, i) => <TB.Row key={i} d={e} t={this.state.t} c={i % 7 == 0 || i % 7 == 6 ? 'bg-danger' : ''} />);
      
    return (
    <Tb t='Calendar' c={this.state.y + ' / ' + (this.state.m + 1)} h={this.state.n} d={this.month(2017, 9)} to={this.today} />
    );
    /*
    <table className='table table-bordered'>
      <caption>{this.state.y + ' / ' + (this.state.m + 1)}</caption>
      <thead><tr><TB.Th h={this.state.yn} /></tr></thead>
      <tbody>{a}</tbody>
    </table>
    */
  }
};

class Filter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.date = this.date.bind(this);
    $.datepicker.setDefaults({
      yearRange: '-10:c',
      changeYear: true,
      changeMonth: true,
      showMonthAfterYear: true,
      constraintInput: true,
      dateFormat: 'yy.mm.dd',
      defaultDate: '-1y -1m +3d',
      maxDate: '+1m'
    });
  }
  date(e) {
    e.persist();
    $(e.target).datepicker({onSelect: () => this.props.setDate(e)});
  }
  render () {
    console.log('render Filter');
    return (
      <form className='form-inline'>
        <div className='form-group'>
          <label className='control-label'>{this.props.sday}
            <input type='text' className='form-control' id='sday' placeholder='請輸入交易起始日期'  value={this.props.filter.sday} onFocus={this.date} onChange={this.props.setDate} />
          </label>
        </div>
        <div className='form-group'>
          <label className='control-label'>{this.props.eday}
            <input type='text' className='form-control' id='eday' placeholder='請輸入交易結束日期'  value={this.props.filter.eday} onFocus={this.date} onChange={this.props.setDate} />
          </label>
        </div>
        <div className='form-group'>
          <label className='control-label'>{this.props.label}
            <input type='text' className='form-control' placeholder='請輸入作物名稱' value={this.props.filter.pname} onChange={this.props.search} />
          </label>
        </div>
        <div className='checkbox'>
          <label>進口
            <input className='form-control' type='checkbox' />
          </label>
        </div>
        <div className='form-group'>
          <label className='control-label'>{this.props.BA}
            <input type='text' className='form-control' placeholder='請輸入交易量下限'  />
          </label>
        </div>
        <div className='form-group'>
          <label className='control-label'>{this.props.TA}
            <input type='text' className='form-control' placeholder='請輸入交易量上限'  />
          </label>
        </div>
        <button type='button' className='btn btn-default'>查詢</button>
      </form>
    );
  }
}

class Contentt extends React.Component {
  constructor(props) {
    super(props); //define props
    var o1 = {}, o2 = {}, o3 = {};
    if (props.ini.T !== 'CP') {
      o1[props.ini.T] = {all: props.data};
    } else {
      o2[props.ini.I] = props.data;
      o1[props.ini.T] = o2;
    }
    o3[props.ini.T] = props.ini;
    this.state = {data: props.data.slice(0, props.g.R), cur: 1, filter: {sday: '', eday: '', pname: ''}, graph: [], storage: o1, type: props.ini.T, query: [], opt: o3, item: props.ini.I || 'all'}; //initial state
    this.sort = this.sort.bind(this); //bind methods
    this.setDate = this.setDate.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.graph = this.graph.bind(this);
    this.page = this.page.bind(this);
    this.filter = this.filter.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.getData = this.getData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.search = this.search.bind(this);
    this.category = this.category.bind(this);
  }
  sort(e) {
    var k = e.target.text, narr = [], o = {}, d = this.state.storage, t = this.state.type;
    if (['代號', '名稱', '代碼', '作物'].some((v) => k.indexOf(v) !== -1)) { //when sorting title includes specified names, use localeCompare()
      narr = d[t]['all'].sort((a, b) => (this.state.asc[k]) ? b[k].localeCompare(a[k]) : a[k].localeCompare(b[k]));
    } else if (k.indexOf('日期') !== -1) { //sort date
      narr = d[t]['all'].sort((a, b) => (this.state.asc[k]) ? this.formatDate(b[k]) - this.formatDate(a[k]) : this.formatDate(a[k]) - this.formatDate(b[k]));
    } else { //sort number data
      narr = d[t]['all'].sort((a, b) => (this.state.asc[k]) ? b[k] - a[k] : a[k] - b[k]);
    }
    d[t] = narr;
    o[k] = !this.state.asc[k]; //converse sorting title's flag
    this.setState((pS, pr) => ({storage: Object.assign(pS.storage, d), asc: Object.assign(pS.asc, o), data: pS.storage[t].slice((pS.cur - 1) * pr.g.R, pS.cur * pr.g.R)}));
  }
  formatDate(d) { //transfer date string to date number in order to be sorted
    var da = [];
    if (d.indexOf('.') !== -1) {
      da = d.split('.');
    } else if (d.indexOf('-') !== -1) {
      da = d.split('-');
    } else {
      da.push(d.substr(0, 3), d.substr(3, 2), d.substr(-2, 2));
    }
    return (d.indexOf('-') !== -1) ? new Date(+da[0], +da[1] - 1, +da[2]): new Date(+da[0] + 1911, +da[1] - 1, +da[2]);
  }
  setDate(e) {
    var o = {};
    o[e.target.id] = e.target.value; //specify filtering sday or eday with input's value
    this.setState({filter: Object.assign(this.state.filter, o)});
  }
  search(e) {
    var temp = this.state.data, k = e.target.value;
    if (k == '') {
      console.log('none');
      this.setState({data: temp});
      return null;
    } else {
    
    var arr = this.state.data.filter((v) => v['作物名稱'].indexOf(k) !== -1);
    this.setState({data : arr});
    }
  }
  graph(e) {
    var p = e.target.text;
    $('#graph').modal('toggle');
    this.loadData(1, 0, this.state.type, p);
    this.setState({graph: this.state.data});
  }
  getData(c, l, t) { //update state & load data from storage at current page's position
    var t = t || this.state.type;
    if (this.state.storage[t] !== undefined && this.state.storage[t][this.state.item]) {
      if (this.state.storage[t][this.state.item].length !== this.state.opt[t].N && this.state.storage[t][this.state.item].length < c * this.props.g.R) { //if storage doesn't have enough data, load data from server
        console.log('loading data');
        this.loadData(c, l, t);
      } else {
        this.setState((pS, pr) => ({cur: c, data: pS.storage[pS.type][pS.item].slice((c - 1) * pr.g.R, c * pr.g.R)}));
      }
    } else {
      console.log('loading data');
      this.loadData(c, l, t);
    }
  }
  page(e) {
    var c = this.state.cur, p = this.props.g.P, v = (e.target.text) ? e.target.text : e.target.value; //distinguish event between button and selection list
    switch (v) {
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
    }
    this.getData(c, (c % p == 0) ? c / p - 1 : Math.floor(c / p)); //render data according to specified page
  }
  category(e){
    var t = '';
    e.preventDefault();
    $(e.target).tab('show');
    if (e.target.parentNode.parentNode.className == 'dropdown-menu') { //click menu
      $(e.target.parentNode.parentNode).tab('show');
      t = e.target.parentNode.parentNode.previousSibling.hash + e.target.hash;
      t = t.split('#');
      t.shift();
    } else if (e.target.parentNode.parentNode.nextSibling.className == 'tab-content') { //click tab
      t = e.target.hash;
      t = t.substr(1);
    }
    if (typeof t == 'object') {
      this.getData(1, 0, t[0]);
    } else {
      this.loadData(1, 0, this.state.type, t);
    }
    console.dir(t);
  }
  filter (e) {
    
  }
  setQuery() {
    
  }
  loadData(c, l, t, q) { //load a piece of data from server
    q = q || ''; 
    $.ajax({
      url: '/T/' + t + '/' + l + '/' + q,
      success: function(d){
        var o1 = {}, o2 = {}, opt = {};
        if (l == 0) opt[t] = d.pop(); //load a new type of data, get options of the new type
        if (q) {
          o2[q] = d;
        } else {
          o2[this.state.item] = (this.state.storage[t] !== undefined && this.state.storage[t][this.state.item]) ? this.state.storage[t][this.state.item].concat(d) : d;
        }
        o1[t] = (this.state.storage[t]) ? Object.assign(this.state.storage[t], o2) : o2;
        this.setState({cur: c, storage: Object.assign(this.state.storage, o1), data: (q) ? o1[t][q].slice((c - 1) * this.props.g.R, c * this.props.g.R) : o1[t]['all'].slice((c - 1) * this.props.g.R, c * this.props.g.R), type: t, opt: Object.assign(this.state.opt, opt), item: q || 'all'});
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(this.url, status, err.toString());
      }.bind(this)
    });
  }
  componentWillMount() { //before render
    console.log('component will mount');
  }
  render() {
    console.log('render Content');
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
  componentDidMount() { //initialization with DOM or request
    var o = {};
    this.state.opt[this.state.type].H.forEach((v) => o[v] = null); //set sorting flag according to data's header
    this.setState({asc: o});
  }
}