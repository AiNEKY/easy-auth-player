# Easy WebPlayer

Easy WebPlayer 是一个简易的前端网页HTML播放器，可以部署在 Cloudflare Workers 上，同时引入 HTTP Basic Auth 鉴权。

该项目有两种形式：

1. **Direct 形式**：通过鉴权后，直接从后端服务器拉取视频流，适用于音视频点播等场景。
2. **Reverse Proxy 形式**：通过 Cloudflare Workers 的反向代理从源服务器拉取视频流，适用于音视频直播等场景。

## 特性

- 支持通过浏览器（Edge、Chrome 等）或播放器（VLC、PotPlayer 等）播放视频流，同时规范化视频流播放地址。
- 项目中的示例两种视频流格式（例如 `.ts` 和 `.flv`）。
- 播放格式可多样化，示例中采用 `mpegts.js` 实现，也可以使用 `dash.js`、`video.js` 等其他播放器实现播放`m3u8`、`mpd`等格式的视频流。
- 内置简单的鉴权机制，确保流媒体的安全访问。

## 参数说明

- `via`：指定流的播放方式。`via=browser` 表示通过浏览器播放流，`via=player` 表示通过 VLC、PotPlayer 等播放器播放流。
- `app`：指定直播应用名称或视频流路径，默认为 `live`。
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

## 实战演示

播放器拉流地址：`https://demo.palakama.cfd/?via=player&app=live&type=flv&streamid=demo`

浏览器拉流地址：`https://demo.palakama.cfd/?via=browser&app=live&type=ts&streamid=demo`

用户名和密码都是`demo`

# 感谢YxVM赞助提供的演示服务器
https://yxvm.com/

## 小Tips

正确配置后端 URL：根据您的需求，修改 `backendURL`，确保它指向正确的视频流资源。

设置鉴权机制：确保 `secret` 和其他鉴权参数已正确配置。

