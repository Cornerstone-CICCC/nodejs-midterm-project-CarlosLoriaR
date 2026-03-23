import { Request, Response } from 'express';
import { playlistStorage } from '../models/Playlist';

export function browsePlaylists(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const playlists = playlistStorage.getAll(req.userId);
  res.json({ playlists });
}

export function readPlaylist(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const playlist = playlistStorage.getById(id);

  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }

  if (playlist.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json({ playlist });
}

export function searchPlaylists(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const results = playlistStorage.search(req.userId, q);
  res.json({ playlists: results });
}

export function addPlaylist(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Playlist name is required' });
  }

  const playlist = playlistStorage.create(req.userId, name, description || '');
  res.status(201).json({ playlist });
}

export function editPlaylist(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const { name, description } = req.body;

  const existing = playlistStorage.getById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Playlist not found' });
  }

  if (existing.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updated = playlistStorage.update(id, { name, description });
  res.json({ playlist: updated });
}

export function deletePlaylist(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const playlist = playlistStorage.getById(id);

  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }

  if (playlist.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (playlistStorage.delete(id)) {
    res.json({ message: 'Playlist deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
}
