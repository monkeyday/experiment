function Row(props) {
  return (
    <tr><td>{props.c['作物名稱']}</td><td>{props.c['平均價']}</td><td>{props.c['作物代號']}</td></tr>
  );
}

function Content(props) {
  const arr = props.c.map((v, i) => <Row c={v} key={v['交易日期'] + '-' + v['市場代號'] + '-' + v['作物代號']}></Row>);
  return (
     <table className="table-bordered table-hover">
     <caption>{props.n} date is {props.d}</caption>
     <thead><tr><th></th><th></th><th></th></tr></thead>
     <tbody>{arr}</tbody>
     </table>
  );
}

$(()=>{ //execute after DOM completely loaded
  $.ajax({
    url: 'http://127.0.0.1:3000',
    method: 'GET',
  })
  .done((json)=>{
    ReactDOM.render(<Content n='Monkeyday' c={json.c} d={json.d} />, $('#content')[0]);
  })
  .fail((xhr, status, err)=>{
    console.dir(err);
  })
  .always((xhr, status)=>{
    console.dir(xhr);
  });
  
  
});
//https://api.secret.taichung.gov.tw/v1.0/sfc/cities -> gov open data which allows CORS