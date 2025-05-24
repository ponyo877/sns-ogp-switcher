import { Hono } from 'hono';
import ogpImage from './image';

const app = new Hono();

// Middleware to log requests
app.use('*', (c, next) => {
  const requestUrl = new URL(c.req.url);
  const sns = requestUrl.searchParams.get('sns');
  const allHeader = c.req.header();

  let logHeaders = '';
  for (const [key, value] of Object.entries(allHeader)) {
    logHeaders += `${key}: ${value} `
  }

  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${c.req.method} ${requestUrl.pathname} SNS: ${sns} logHeaders: ${logHeaders}`);
  return next();
});

app.get('/image', (c) => {
  c.header('Content-Type', 'image/png');
  return c.body(base64ToUint8Array(ogpImage), 200);
});

app.get('/', (c) => {
  const requestUrl = new URL(c.req.url);
  const sns = requestUrl.searchParams.get('sns');
  const ogpImageUrl = `${requestUrl.origin}/image?sns=${sns ?? ''}`;

  const html = generateHtml(ogpImageUrl);
  return c.html(html);
});

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

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const uint8Array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }
  return uint8Array;
}

export default app;
