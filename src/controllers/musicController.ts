import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { playlistStorage, Song } from '../models/Playlist';

export function getSongsFromPlaylist(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { playlistId } = req.params;
  const playlist = playlistStorage.getById(playlistId);

  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }

  if (playlist.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json({ songs: playlist.songs });
}

export function addSongToPlaylist(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { playlistId } = req.params;
  const { title, artist, duration } = req.body;

  if (!title || !artist || duration === undefined) {
    return res.status(400).json({ error: 'Title, artist, and duration are required' });
  }

  const playlist = playlistStorage.getById(playlistId);
  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }

  if (playlist.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const song: Song = {
    id: uuidv4(),
    title,
    artist,
    duration: Number(duration),
  };

  playlist.songs.push(song);
  playlistStorage.update(playlistId, { songs: playlist.songs });

  res.status(201).json({ song });
}

export function removeSongFromPlaylist(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { playlistId, songId } = req.params;
  const playlist = playlistStorage.getById(playlistId);

  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }

  if (playlist.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const songIndex = playlist.songs.findIndex(s => s.id === songId);
  if (songIndex === -1) {
    return res.status(404).json({ error: 'Song not found' });
  }

  playlist.songs.splice(songIndex, 1);
  playlistStorage.update(playlistId, { songs: playlist.songs });

  res.json({ message: 'Song removed successfully' });
}

export function updateSong(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { playlistId, songId } = req.params;
  const { title, artist, duration } = req.body;

  const playlist = playlistStorage.getById(playlistId);
  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }

  if (playlist.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const song = playlist.songs.find(s => s.id === songId);
  if (!song) {
    return res.status(404).json({ error: 'Song not found' });
  }

  if (title) song.title = title;
  if (artist) song.artist = artist;
  if (duration !== undefined) song.duration = Number(duration);

  playlistStorage.update(playlistId, { songs: playlist.songs });

  res.json({ song });
}
