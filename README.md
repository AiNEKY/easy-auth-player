# Easy WebPlayer

Easy WebPlayer 是一个简易的前端网页HTML播放器，可以部署在 Cloudflare Workers 上，同时引入 HTTP Basic Auth 鉴权。

该项目有两种形式：

1. **Direct 形式**：通过鉴权后，直接从后端服务器拉取视频流。
2. **Reverse Proxy 形式**：通过 Cloudflare Workers 的反向代理从源服务器拉取视频流，有效保护源站服务器。

## 特性

- 支持通过浏览器（Edge、Chrome 等）或播放器（VLC、PotPlayer 等）播放视频流，同时规范化视频流播放地址。
- 项目中的示例两种视频流格式（例如 `.ts` 和 `.flv`）。
- 播放格式可多样化，示例中采用 `mpegts.js` 实现，也可以使用 `dash.js`、`video.js` 等其他播放器实现播放`m3u8`、`mpd`等格式的视频流。
- 内置简单的鉴权机制，确保流媒体的安全访问。

## 参数说明

- `via`：指定流的播放方式。`via=browser` 表示通过浏览器播放流，`via=player` 表示通过 VLC、PotPlayer 等播放器播放流。
- `app`：指定应用名称，默认为 `live`。
- `type`：指定视频流文件格式。
- `streamid`：指定要播放的流的 ID。

## URL 结构

假设后端的真实视频流 URL 为：`https://distributon.palakama.cfd/live/PyongYang-Major.flv`

则 `backendURL` 应为：`https://distributon.palakama.cfd/${app}/${streamid}.${type}`

如果后端 URL 还带有如 `?secret=` 这样的参数，如：`https://distributon.palakama.cfd/live/PyongYang-Major.flv?secret=1145141919810`

则需要添加一段：
```js
const secret = params.get('secret');
```

同时在参数验证中也应作出相应的修改，如下示例：

```js
if (!via || !type || !streamid || !secret) {
  return new Response('Missing required parameters', { status: 400 });
}
```

最后的播放地址应为：
播放器：`https://stream.palakama.cfd/?via=player&app=live&type=flv&streamid=PyongYang-Major&secret=1145141919810`
浏览器：`https://stream.palakama.cfd/?via=browser&app=live&type=flv&streamid=PyongYang-Major&secret=1145141919810`

## 小Tips

正确配置后端 URL：根据您的需求，修改 `backendURL`，确保它指向正确的视频流资源。

设置鉴权机制：确保 `secret` 和其他鉴权参数已正确配置。

## 核心代码

```js
addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  const { searchParams } = url
  const via = searchParams.get('via')
  const type = searchParams.get('type')
  const streamid = searchParams.get('streamid')
  const secret = searchParams.get('secret')

  // 参数验证
  if (!via || !type || !streamid || !secret) {
    return event.respondWith(new Response('Missing required parameters', { status: 400 }))
  }

  // 拼接后端 URL
  const backendURL = `https://example.com/live/${streamid}.${type}?secret=${secret}`

  // 代理请求
  const requestHeaders = new Headers(event.request.headers)
  const response = fetch(backendURL, {
    method: 'GET',
    headers: requestHeaders,
  })

  event.respondWith(response)
})
```

