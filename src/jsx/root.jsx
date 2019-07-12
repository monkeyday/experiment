const React = require('react'), babel = require('babel-core'), fs = require('fs');

function Root(p) {
  let Comp = p.c;
  let a = ['react.development', 'react-dom.development', 'jquery-3.2.1.min', 'popper.min', 'bootstrap4.min', 'd3.min', 'jquery-ui.min'];
  a = a.concat(p.j);
  a = a.map((e, i) => <script key={i} src={`/pub/js/${e}.js`}></script>);
  return (
    <html lang="zh-Hant-TW">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{p.n}</title>
      </head>
      <body>
        <div id="content" data-d={JSON.stringify(p.d)}>
          <Comp d={p.d} />
        </div>
      <link rel="stylesheet" href="/pub/css/bootstrap.min.css" />
      {a}
      </body>
    </html>
  );
}

function use(a) {
  a.forEach((f) => {
    babel.transformFile(`./src/jsx/component/${f}.jsx`, {
      presets: ['minify'],
      plugins: ['babel-plugin-transform-react-jsx'] 
    }, (e, r) => {
      if (e) throw e;
      fs.writeFile(`./pub/js/${f}.js`, r.code, (e) => {
        if (e) throw e;
      });
    });
  });
}

module.exports = {
  Root: Root,
  use: use
}