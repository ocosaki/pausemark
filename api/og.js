export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const gameId = url.searchParams.get('game') || '';

  // Try game-specific image first (jpeg), fall back to jpg, then logo
  const imageUrl = gameId
    ? `https://cdn.jsdelivr.net/gh/ocosaki/pausemark@main/share/${gameId}.jpeg`
    : `https://cdn.jsdelivr.net/gh/ocosaki/pausemark@main/pausemarklogo.jpg?v=2`;

  // Check if the jpeg exists — if not try jpg
  let finalImageUrl = imageUrl;
  if (gameId) {
    try {
      const check = await fetch(imageUrl, { method: 'HEAD' });
      if (!check.ok) {
        // Try .jpg
        const jpgUrl = `https://cdn.jsdelivr.net/gh/ocosaki/pausemark@main/share/${gameId}.jpg`;
        const checkJpg = await fetch(jpgUrl, { method: 'HEAD' });
        finalImageUrl = checkJpg.ok
          ? jpgUrl
          : `https://cdn.jsdelivr.net/gh/ocosaki/pausemark@main/share/game-001.jpeg`;
      }
    } catch (e) {
      finalImageUrl = `https://cdn.jsdelivr.net/gh/ocosaki/pausemark@main/share/game-001.jpeg`;
    }
  }

  const gameNum = gameId ? gameId.replace('game-', '#') : '';
  const title = gameId ? `PauseMark ${gameNum}` : 'PauseMark';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="Not just a quiz. The right answer at the wrong moment is worth nothing. Can you wait long enough?"/>
  <meta property="og:image" content="${finalImageUrl}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:url" content="https://pausemark.orucupoxygen.com${gameId ? '?game=' + gameId : ''}"/>
  <meta property="og:type" content="website"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:image" content="${finalImageUrl}"/>
  <meta http-equiv="refresh" content="0;url=https://pausemark.orucupoxygen.com${gameId ? '?game=' + gameId : ''}"/>
</head>
<body>
  <script>window.location.href = 'https://pausemark.orucupoxygen.com${gameId ? '?game=' + gameId : ''}';</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
