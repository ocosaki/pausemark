export const config = { runtime: 'edge' };

const GAMES = {
  'game-001': 'Identify the Lead Actor',
  'game-002': 'Identify the Music Director',
  'game-003': 'Identify the Brand',
  'game-004': 'Common Sense',
  'game-005': 'Foodnotes',
  'game-006': 'IPL: The Superover',
  'game-007': 'Doordarshan',
  'game-008': 'CinemaPaattu',
  'game-009': 'Lost in Translation',
  'game-010': 'Indian States',
  'game-011': 'A Colourful Life',
  'game-012': 'Villains of Tamil Cinema',
  'game-013': 'Human Body',
  'game-014': 'Animal Names',
  'game-015': 'NoteWorthy',
  'game-016': "It's a MAD, MAD, MADRAS",
};

const IMAGE_EXT = {
  'game-012': 'jpg',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const gameId = url.searchParams.get('game') || '';
  const gameName = GAMES[gameId] || 'PauseMark';
  const ext = IMAGE_EXT[gameId] || 'jpeg';
  const imageUrl = gameId && GAMES[gameId]
    ? `https://cdn.jsdelivr.net/gh/ocosaki/pausemark@main/share/${gameId}.${ext}`
    : `https://cdn.jsdelivr.net/gh/ocosaki/pausemark@main/pausemarklogo.jpg?v=2`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>PauseMark — ${gameName}</title>
  <meta property="og:title" content="PauseMark — ${gameName}"/>
  <meta property="og:description" content="Not just a quiz. The right answer at the wrong moment is worth nothing. Can you wait long enough?"/>
  <meta property="og:image" content="${imageUrl}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:url" content="https://pausemark.orucupoxygen.com${gameId ? '?game=' + gameId : ''}"/>
  <meta property="og:type" content="website"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:image" content="${imageUrl}"/>
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
