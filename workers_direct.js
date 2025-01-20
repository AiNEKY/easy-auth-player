export default {
  async fetch(request) {
    const url = new URL(request.url);
    const params = url.searchParams;

    // HTTP Basic Auth
    const USERNAME = 'username';
    const PASSWORD = 'password';
    const validAuth = `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`;

    const authHeader = request.headers.get('Authorization');
    if (authHeader !== validAuth) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Access Authentication Required"' },
      });
    }

    // Extract parameters
    const app = params.get('app') || 'live'; //默认值为live
    const via = params.get('via');
    const type = params.get('type');
    const streamid = params.get('streamid');

    if (!via || !type || !streamid) {
      return new Response('Missing required parameters', { status: 400 });
    }

    if (via === 'player') {
      // 302 Redirect to the backend stream URL
      const backendURL = `https://example.com/${app}/${streamid}.${type}`;
      return Response.redirect(backendURL, 302);
    } else if (via === 'browser') {
      // Generate HTML page with mpegts.js player
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PALAKAMA Stream3 - Web Stream Player</title>
          <script src="https://cdn.jsdelivr.net/npm/mpegts.js"></script>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background: linear-gradient(135deg, #ff0888, #66ccff);
              height: 100vh;
              color: white;
              font-family: Arial, sans-serif;
            }
            video {
              max-width: 95%;
              max-height: 95%;
              border: 3px solid #ffffff;
              border-radius: 10px;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
            }
          </style>
        </head>
        <body>
          <video id="videoElement" controls autoplay muted></video>
          <script>
            (function() {
              const url = '${url.origin}/?via=player&type=${type}&app=${app}&streamid=${streamid}';
              const videoElement = document.getElementById('videoElement');

              if (mpegts.getFeatureList().mseLivePlayback) {
                const player = mpegts.createPlayer({
                  type: '${type === "flv" ? "flv" : "mpegts"}',
                  url: url,
                });
                player.attachMediaElement(videoElement);
                player.load();
                player.play();
              } else {
                alert('Your browser does not support MSE live playback.');
              }
            })();
          </script>
        </body>
        </html>
      `;
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    } else {
      return new Response('Invalid "via" parameter', { status: 400 });
    }
  },
};
