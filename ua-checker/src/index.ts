import { Hono } from 'hono';

const app = new Hono();

// Middleware to log requests
app.use('*', (c, next) => {
  const requestUrl = new URL(c.req.url);
  const sns = requestUrl.searchParams.get('sns');
  const userAgent = c.req.header('user-agent');

  logRequest(c.req.method, requestUrl.pathname, sns, userAgent);
  return next();
});

app.get('/ogp-image', (c) => {
  c.header('Content-Type', 'image/png');
  return c.body(null, 200);
});

app.get('/', (c) => {
  const requestUrl = new URL(c.req.url);
  const sns = requestUrl.searchParams.get('sns');
  const ogpImageUrl = `${requestUrl.origin}/ogp-image?sns=${sns ?? ''}`;

  const html = generateHtml(ogpImageUrl);
  return c.html(html);
});

function logRequest(method: string, pathname: string, sns: string | null, userAgent: string | undefined) {
  const timestamp = new Date().toISOString();
  const snsInfo = sns ?? 'N/A';
  const uaInfo = userAgent ?? 'N/A';

  console.log(`[${timestamp}] ${method} ${pathname} SNS: ${snsInfo} UA: ${uaInfo}`);
}

function generateHtml(ogpImageUrl: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta property="og:image" content="${ogpImageUrl}" />
    <title>OGP Test</title>
  </head>
  <body>
    <h1>OGP Test</h1>
  </body>
</html>`;
}

export default app;
