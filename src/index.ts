import { Hono } from 'hono'

const app = new Hono()
const R2_ENDPOINT = 'https://sns-ogp.folks-chat.com'
const SELF_ENDPOINT = 'https://sns-ogp-switcher.folks-chat.com'

// Social media platform configurations
const PLATFORM_CONFIGS = [
  { userAgent: 'Twitterbot', endpoint: 'twitter' },
  { userAgent: 'Tumblr', endpoint: 'tumblr' },
  { userAgent: 'www.facebook.com', endpoint: 'meta' },
  { userAgent: 'Bluesky', endpoint: 'bluesky' },
  { userAgent: 'SummalyBot', endpoint: 'misskey' },
  { userAgent: 'Mastodon', endpoint: 'mastodon' },
  { userAgent: 'Discordbot', endpoint: 'discord' },
  { userAgent: 'Slackbot', endpoint: 'slack' },
  { userAgent: 'line-poker', endpoint: 'line' },
] as const

function detectPlatform(userAgent: string, referer: string): string {
  for (const config of PLATFORM_CONFIGS) {
    if (config.userAgent && userAgent.includes(config.userAgent)) {
      return config.endpoint
    }
  }
  return 'none'
}

function generateHtml(ogpImageUrl: string): string {
  // To X, neccessary to set the og:title or twitter:title
  return `<!DOCTYPE html>
<html>
  <head>
    <meta property="og:image" content="${ogpImageUrl}" />
    <meta property="og:title" content="SNS OGP Switcher" />
    <meta property="og:description" content="This page is a test page for switching OGP images for social media platforms." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://sns-ogp-switcher.folks-chat.com" />
    <meta property="og:site_name" content="SNS OGP Switcher" />
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
    <p>2025 <a href="https://github.com/ponyo877/sns-ogp-switcher">SNS OGP Switcher</a> by <a href="https://x.com/ponyo877">@ponyo877</a> </p>
  </footer>
</html>`
}

app.get('/image', (c) => {
  const referer = c.req.header('Referer') || ''
  if (referer.includes('mixi.social')) {
    const ogpImageURL = `${R2_ENDPOINT}/mixi2.png`
    return c.redirect(ogpImageURL, 302)
  }
  return c.redirect(`${R2_ENDPOINT}/default.png`, 302)
})

app.get('/', (c) => {
  const userAgent = c.req.header('User-Agent') || ''
  const referer = c.req.header('Referer') || ''
  console.log(`User-Agent: ${userAgent}, Referer: ${referer}`)

  const platform = detectPlatform(userAgent, referer)
  let ogpImageURL = `${R2_ENDPOINT}/${platform}.png`
  if (platform === 'none') {
    ogpImageURL = `${SELF_ENDPOINT}/image`
  }

  console.log(`ogpImageURL: ${ogpImageURL}`)

  const html = generateHtml(ogpImageURL)
  return c.html(html)
})

export default app
