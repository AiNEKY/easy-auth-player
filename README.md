# easy-webplayer
一个可部署在Cloudflare Workers上的简易前端网页直播流播放器，同时引入HTTP Basic Auth鉴权。
项目中有两种形式，一种是direct模式，通过鉴权后直接从后端服务器拉取视频流，另一种是proxy模式，通过Cloudflare Workers的反向代理从服务器拉取视频流，可以更好的保护源站服务器。
参数解读：via=player代表通过VLC、PotPlayer等播放器直接播放视频流，via=browser代表通过Edge、Chrome等浏览器播放视频流，app=live为选填参数，默认值已经指定为live，type=为指定视频流文件格式，目前支持ts和flv，还可以换成dash.js、video.js等其他实现更多的播放协议。
浏览器拉流地址示例：https://example.com/?via=browser&app=live&type=flv&streamid=testlive1
播放器拉流地址示例：https://example.com/?via=player&app=live&type=flv&streamid=testlive2
---------------------------------------------------------------------------------------------
浏览器拉流演示：https://demo.aineky-riau.workers.dev/?via=browser&app=obj/media-fe/xgplayer_doc_video/flv&type=flv&streamid=xgplayer-demo-360p
演示站使用proxy模式，视频源真实地址为https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv
---------------------------------------------------------------------------------------------
