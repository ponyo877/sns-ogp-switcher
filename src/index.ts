import { Hono } from 'hono'

const app = new Hono()
const ENDPOINT = 'https://sns-ogp.folks-chat.com'

// Social media platform configurations
const PLATFORM_CONFIGS = [
  { userAgent: 'Twitterbot', referer: '', endpoint: 'x' },
  { userAgent: 'Tumblr', referer: '', endpoint: 'tumblr' },
  { userAgent: 'www.facebook.com', referer: '', endpoint: 'meta' },
  { userAgent: 'Bluesky', referer: '', endpoint: 'bluesky' },
  { userAgent: '', referer: 'mixi.social', endpoint: 'mixi2' },
  { userAgent: 'MisskeyMediaProxy', referer: '', endpoint: 'misskey' },
  { userAgent: 'Mastodon', referer: '', endpoint: 'mastodon' },
  { userAgent: 'Discordbot', referer: '', endpoint: 'discord' },
  { userAgent: 'Slackbot', referer: '', endpoint: 'slack' },
  { userAgent: 'line-poker', referer: '', endpoint: 'line' },
  { userAgent: 'node-fetch', referer: '', endpoint: 'zenn' }, // Maybe distinguishable in this table, but likely to overlap in practice
] as const

function detectPlatform(userAgent: string, referer: string): string {
  for (const config of PLATFORM_CONFIGS) {
    if (config.userAgent && userAgent.includes(config.userAgent)) {
      return config.endpoint
    }
    if (config.referer && referer.includes(config.referer)) {
      return config.endpoint
    }
  }
  return 'default'
}

function generateHtml(ogpImageUrl: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta property="og:image" content="${ogpImageUrl}" />
    <title>SNS OGP Switcher</title>
  </head>
  <body>
    <h1>SNS OGP Switcher</h1>
    <p>This page is a test page for switching OGP images for social media platforms.</p>
    <p>The displayed OGP image changes based on each social media platform's User-Agent and Referer.</p>
    <p>The actual OGP images are retrieved by each social media platform's crawler.</p>
    <p>When you share this page on social media, the corresponding OGP image will be displayed.</p>
    <p>For example, when shared on Twitter, the Twitter-specific OGP image will be shown.</p>
    <p>Please copy this page's URL and try sharing it on social media.</p>
    <br/>
    <p>このページは、SNSのOGP画像を切り替えるためのテストページです。</p>
    <p>各SNSのUser-AgentやRefererに応じて、表示されるOGP画像が変わります。</p>
    <p>実際のOGP画像は、各SNSのクローラーによって取得されます。</p>
    <p>このページをSNSでシェアすると、対応するOGP画像が表示されます。</p>
    <p>例えば、Twitterでシェアすると、Twitter用のOGP画像が表示されます。</p>
    <p>このページのURLをコピーして、SNSでシェアしてみてください。</p>
    <br/>
  </body> 
  <footer>
    <p>2025 SNS OGP Switcher by <a href="https://x.com/ponyo877">@ponyo877</a> </p>
  </footer>
</html>`
}

app.get('/', (c) => {
  const userAgent = c.req.header('User-Agent') || ''
  const referer = c.req.header('Referer') || ''

  const platform = detectPlatform(userAgent, referer)
  const ogpImageURL = `${ENDPOINT}/${platform}.png`

  const html = generateHtml(ogpImageURL)
  return c.html(html)
})

export default app
