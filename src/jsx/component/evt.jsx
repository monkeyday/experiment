function sort(e) {
  let k = e.target.text, narr = [], o = {}, d = this.state.storage, t = this.state.type;
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

function  formatDate(d) { //transfer date string to date number in order to be sorted
  let da = [];
    if (d.indexOf('.') !== -1) {
      da = d.split('.');
    } else if (d.indexOf('-') !== -1) {
      da = d.split('-');
    } else {
      da.push(d.substr(0, 3), d.substr(3, 2), d.substr(-2, 2));
    }
    return (d.indexOf('-') !== -1) ? new Date(+da[0], +da[1] - 1, +da[2]): new Date(+da[0] + 1911, +da[1] - 1, +da[2]);
}

function  setDate(e) {
  let o = {};
    o[e.target.id] = e.target.value; //specify filtering sday or eday with input's value
    this.setState({filter: Object.assign(this.state.filter, o)});
}

function  search(e) {
  let temp = this.state.data, k = e.target.value;
    if (k == '') {
      console.log('none');
      this.setState({data: temp});
      return null;
    } else {
    
    var arr = this.state.data.filter((v) => v['作物名稱'].indexOf(k) !== -1);
    this.setState({data : arr});
    }
}

function  graph(e) {
  let p = e.target.text;
    $('#graph').modal('toggle');
    this.loadData(1, 0, this.state.type, p);
    this.setState({graph: this.state.data});
}

function  getData(c, l, t) { //update state & load data from storage at current page's position
  let t = t || this.state.type;
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

function  page(e) {
  let c = this.state.cur, p = this.props.g.P, v = (e.target.text) ? e.target.text : e.target.value; //distinguish event between button and selection list
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

function  category(e){
  let t = '';
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

function loadData(c, l, t, q) { //load a piece of data from server
  let q = q || ''; 
  $.ajax({
    url: '/T/' + t + '/' + l + '/' + q,
    success: function(d){
      let o1 = {}, o2 = {}, opt = {};
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
