# SNS OGP Switcher

A Cloudflare Workers application that dynamically switches OGP (Open Graph Protocol) images based on the social media platform accessing the page.

## Features

- Detects social media platforms by User-Agent and Referer headers
- Serves different OGP images for each platform
- Supports major platforms: Twitter/X, Facebook/Meta, Tumblr, Bluesky, Mixi, Misskey, Mastodon, Discord, Slack, LINE, and Zenn
- Built with Hono framework for fast performance
- Deployed on Cloudflare Workers

## Supported Platforms

| Platform | Detection Method | Endpoint |
|----------|------------------|----------|
| Twitter/X | User-Agent: `Twitterbot` | `x.png` |
| Tumblr | User-Agent: `Tumblr` | `tumblr.png` |
| Facebook/Meta | User-Agent: `www.facebook.com` | `meta.png` |
| Bluesky | User-Agent: `Bluesky` | `bluesky.png` |
| Mixi | Referer: `mixi.social` | `mixi2.png` |
| Misskey | User-Agent: `MisskeyMediaProxy` | `misskey.png` |
| Mastodon | User-Agent: `Mastodon` | `mastodon.png` |
| Discord | User-Agent: `Discordbot` | `discord.png` |
| Slack | User-Agent: `Slackbot` | `slack.png` |
| LINE | User-Agent: `line-poker` | `line.png` |
| Zenn | User-Agent: `node-fetch` | `zenn.png` |
| Default | Others | `default.png` |

## How It Works

1. When a social media crawler visits the page, the application detects the platform
2. Based on the detection, it serves an HTML page with the appropriate OGP image URL
3. The OGP image URL points to `https://sns-ogp.folks-chat.com/{platform}.png`
4. Each platform displays its specific OGP image when the URL is shared

## Development

### Prerequisites

- Node.js
- Cloudflare account
- Wrangler CLI

### Setup

```bash
npm install
```

### Local Development

```bash
npm run dev
```

### Deployment

```bash
npm run deploy
```

### Type Generation

Generate TypeScript types for Cloudflare Workers:

```bash
npm run cf-typegen
```

## Usage

1. Deploy the application to Cloudflare Workers
2. Share the deployed URL on different social media platforms
3. Each platform will display its corresponding OGP image

## Example

When you share the URL:
- On Twitter/X: Shows `x.png`
- On Facebook: Shows `meta.png`
- On Discord: Shows `discord.png`
- On other platforms: Shows `default.png`

## License

Created by [@ponyo877](https://x.com/ponyo877)
