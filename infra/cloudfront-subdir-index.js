// CloudFront Function (viewer request) — resolve URLs de diretório para index.html
// e redireciona www.multazero.co -> multazero.co.
//
// Por que: o site/blog é estático com PASTAS (/blog/, /blog/post/<slug>/, /blog/studio).
// O S3 atrás do CloudFront (origin REST) NÃO serve index.html automático para subpastas,
// então /blog, /blog/studio etc. dão 403/404/301. Esta função reescreve o caminho.
//
// Como aplicar:
//   1. CloudFront > Functions > Create function (runtime: cloudfront-js-2.0)
//   2. Cole este código > Save > Publish
//   3. Distribution > Behaviors > Default (*) > Edit > Viewer request > Function association
//      = esta função. Save.
//   4. Invalide o cache (/*) depois.

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // www -> domínio principal. Sem isso o site inteiro existe em dois endereços
  // e buscadores dividem a relevância entre eles. (Query string não é mantida.)
  var host = request.headers.host && request.headers.host.value;
  if (host === 'www.multazero.co') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://multazero.co' + uri } },
    };
  }

  if (uri.endsWith('/')) {
    // /blog/  ->  /blog/index.html
    request.uri += 'index.html';
  } else if (uri.split('/').pop().indexOf('.') === -1) {
    // /blog/studio  ->  /blog/studio/index.html  (último segmento sem extensão = diretório)
    request.uri += '/index.html';
  }
  // arquivos com extensão (/blog/_astro/x.js, /assets/y.css) passam intactos
  return request;
}
