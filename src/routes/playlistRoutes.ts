import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  browsePlaylists,
  readPlaylist,
  searchPlaylists,
  addPlaylist,
  editPlaylist,
  deletePlaylist,
} from '../controllers/playlistController';

const router = Router();

router.use(authMiddleware);

router.get('/', browsePlaylists);
router.get('/search', searchPlaylists);
router.post('/', addPlaylist);
router.get('/:id', readPlaylist);
router.put('/:id', editPlaylist);
router.delete('/:id', deletePlaylist);

export default router;
