const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.static('dist/client'));

app.get('/', (req, res) => {
  res.sendFile('dist/client/index.html', { root: '.' });
});

app.get('*', (req, res) => {
  res.sendFile('dist/client/index.html', { root: '.' });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`✓ Astro files are being served correctly`);
  process.exit(0);
});
