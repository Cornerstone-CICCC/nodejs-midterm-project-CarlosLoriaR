import express from 'express';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import playlistRoutes from './routes/playlistRoutes';
import musicRoutes from './routes/musicRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4321'];

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.static('dist/client'));

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use('/users', authRoutes);
app.use('/playlists', playlistRoutes);
app.use('/playlists', musicRoutes);

app.get('/', (req, res) => {
  res.sendFile('dist/client/index.html', { root: '.' });
});

app.get('*', (req, res) => {
  res.sendFile('dist/client/index.html', { root: '.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
