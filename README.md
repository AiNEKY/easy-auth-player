# easy-webplayer
一个可部署在Cloudflare Workers上的简易网页直播流播放器，搭配HTTP Basic Auth鉴权，支持HTTP-FLV和MPEG-TS视频流播放，基于mpeg-ts.js实现。
文档中有两种形式，一种是direct模式，通过验证后直接从后端服务器拉取视频流，缺点是会暴露后端服务器真实URL地址，这就似乎违背了初衷，另一种是我推荐使用的proxy模式，通过Cloudflare Workers的反向代理从服务器拉取视频流，这样一来就可以更好的保护源站服务器。
参数解读：via=player代表通过VLC、PotPlayer等播放器直接播放视频流，via=browser代表通过Edge、Chrome等浏览器播放视频流，app=live为选填参数，默认值已经指定为live，type=为指定视频流文件格式，目前支持ts和flv
播放地址示例：https://demo.aineky.us.kg/?via=browser&app=live&type=ts&streamid=test
