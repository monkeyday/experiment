const F = {
  Input(p) {
    
    return (
    <div className='form-group'>
      <label htmlFor={p.id}>{p.l}</label>
      <input type={p.t} id={p.id} className='form-control' value={p.v} placeholder={p.d} name={p.n} onFocus={p.focus} defaultValue={p.d} />
    </div>
    );
  },
  File(p) {
    
    return (
    <div className='form-group'>
      <label htmlFor={p.id}>{p.l}</label>
      <input type='file' id={p.id} className='form-control' value={p.v} placeholder={p.d} name={p.n} onFocus={p.focus} />
      <p className='help-block'>{p.t}</p>
    </div>
    );
  },
  SList(p) {
    let a = [];
    a.push(<option key={i} value={p.v}>{p.t}</option>);
    return (
    <label htmlFor={p.id}>
      {p.t}
      <select id={p.id} className='form-control' multiple={p.m ? true : false} value={p.s} onChange={p.c}>
        {a}
      </select>
    </label>
    );
  },
  Button(p) {
    
    return <button type='button' id={p.id} className='btn btn-default' value={p.v} />
  },
  Chkbox(p) {
    let a = [];
    a.push(
    <label>
      <input key={i} type='checkbox' value={p.v} name={p.n} checked={p.c ? true : false} onChange={p.c} />
      {p.t}
    </label>
    );
    return <div className='checkbox-inline'>{a}</div>
  },
  Rbutton(p) {
    let a = [];
    a.push(
    <label htmlFor={p.id}>
      <input key={i} type='radio' id={p.id} value={p.v} name={p.n} checked={p.c ? true : false} />
      {p.t}
    </label>
    );
    return <div className='radio-inline'>{a}</div>
  },
  Textarea(p) {
    return (
    <label htmlFor={p.id}>
    {p.t}
    <textarea id={p.id} className='form-control' value={p.v} rows={p.r} onChange={p.c} />
    </label>
    );
  }
};

class FO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.focus = this.focus.bind(this);
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
  }
  
  change(e) {
    console.log(e.target.value);
  }
  
  submit (e) {
    e.preventDefault();
  }
  
  render() {
    
    return (
    <form className='form-inline' onSubmit={this.submit}>
    <fieldset>
    
    </fieldset>
    </form>
    );
  }
}