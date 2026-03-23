import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getSongsFromPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  updateSong,
} from '../controllers/musicController';

const router = Router();

router.use(authMiddleware);

router.get('/:playlistId/songs', getSongsFromPlaylist);
router.post('/:playlistId/songs', addSongToPlaylist);
router.delete('/:playlistId/songs/:songId', removeSongFromPlaylist);
router.put('/:playlistId/songs/:songId', updateSong);

export default router;
