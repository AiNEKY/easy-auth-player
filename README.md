# Easy Auth Player

该项目有两种形式：

1. **Direct 形式**：通过鉴权后，直接从后端服务器拉取视频流，但是会泄露真实源站地址。
2. **Reverse Proxy 形式**：通过 Cloudflare Workers 的反向代理从源服务器拉取视频流，可以隐藏真实源站地址。

## 项目初衷

这个项目最初创建的目的是我在研究电竞赛事流媒体纯净信号防盗链时，结合各个TO的信号分发解决方案想出来的一个虽然简单但是实用的好办法。国内大多数TO都使用腾讯云、阿里云、百度云等的云直播功能，这些云服务的拉流鉴权方式通常是在地址后加上类似`?secret=`、`?expire=`等参数实现简单的防盗链，在实际分发场景中由于大多数主播没有流信号地址的泄露保护意识，加之PotPlayer、VLC等播放器实际上很容易就把拉流地址和鉴权参数完整地泄露给直播间的观众，因此我这里使用了一个简单的HTTP Basic Auth来解决这个问题，这是个古老的验证方式，但是大多数的浏览器和播放器都原生支持，虽然还是有一定几率会导致鉴权验证用户名和密码泄露（比如某主播在直播中途与相关负责人获取流信号地址和验证信息时，没有关闭OBS桌面场景获取），但是总比形如`http://distribution.link/live/cleanfeed.flv?secret=114514&expire=1919810`的简单鉴权要好得多，后期我打算接入类似Cloudflare Zero Trust等来实现更安全的鉴权，目前需要解决的问题是Zero Trust只适用于浏览器访问时的鉴权，如果需要通过播放器直接播放流则无法理解Zero Trust的鉴权机制。

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

## 小Tips

正确配置后端 URL：根据您的需求，修改 `backendURL`，确保它指向正确的视频流资源。

设置鉴权机制：确保 `secret` 和其他鉴权参数已正确配置。

