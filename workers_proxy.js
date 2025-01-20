export default {
  async fetch(request) {
    const url = new URL(request.url);
    const params = url.searchParams;

    // Basic Auth
    const authHeader = request.headers.get('Authorization');
    const validAuth = `Basic ${btoa('username:password')}`; // Replace with secure storage for credentials
    if (authHeader !== validAuth) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Access Authentication Required"' },
      });
    }

    // Extract parameters
    const app = params.get('app') || 'live';
    const via = params.get('via');
    const type = params.get('type');
    const streamid = params.get('streamid');
    const key = params.get('key');

    // Validate required parameters
    if (!via || !type || !streamid || !key) {
      return new Response('Missing required parameters', { status: 400 });
    }

    const backendURL = `https://example.com/${app}/${streamid}.${type}?secret=${key}`;

    if (via === 'player') {
      // Reverse proxy request to backend
      const backendResponse = await fetch(backendURL, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      return new Response(backendResponse.body, {
        headers: backendResponse.headers,
        status: backendResponse.status,
      });
    } else if (via === 'browser') {
      // Generate HTML with mpegts.js player
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Web Player</title>
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
              const url = '${url.origin}/?via=player&type=${type}&app=${app}&streamid=${streamid}&key=${key}';
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