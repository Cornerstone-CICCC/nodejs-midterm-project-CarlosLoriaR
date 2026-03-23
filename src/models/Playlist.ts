import { v4 as uuidv4 } from 'uuid';

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description: string;
  songs: Song[];
  createdAt: Date;
  updatedAt: Date;
}

class PlaylistStorage {
  private playlists: Map<string, Playlist> = new Map();

  create(userId: string, name: string, description: string = ''): Playlist {
    const playlist: Playlist = {
      id: uuidv4(),
      userId,
      name,
      description,
      songs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.playlists.set(playlist.id, playlist);
    return playlist;
  }

  getAll(userId: string): Playlist[] {
    return Array.from(this.playlists.values()).filter(p => p.userId === userId);
  }

  getById(id: string): Playlist | null {
    return this.playlists.get(id) || null;
  }

  update(id: string, updates: Partial<Playlist>): Playlist | null {
    const playlist = this.playlists.get(id);
    if (!playlist) return null;

    const updated: Playlist = {
      ...playlist,
      ...updates,
      updatedAt: new Date(),
    };
    this.playlists.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.playlists.delete(id);
  }

  search(userId: string, query: string): Playlist[] {
    const lower = query.toLowerCase();
    return this.getAll(userId).filter(
      p => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower)
    );
  }
}

export const playlistStorage = new PlaylistStorage();
