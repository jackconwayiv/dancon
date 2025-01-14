import axios, { AxiosError } from "axios";
import {
  DjangoPaginatedResponse,
  Recommendation,
  Song,
  Songbook,
  SongbookDetails,
  SongbookListItem,
  SongbookStats,
  SongEntry,
  User,
  WishlistSong,
} from "../models";

export async function getUserDetails() {
  try {
    return await axios.get<User>(`/api/users/`);
  } catch (error) {
    console.error(`Couldn't retrieve user details: ${error}`);
    return false;
  }
}

export async function toggleUserChordsDisplay(isShowingChords: boolean) {
  try {
    await axios.patch<User>(`/api/user_profiles/`, {
      is_showing_chords: isShowingChords,
    });
  } catch (error) {
    console.error(
      `Couldn't toggle user's chords display preferences: ${error}`
    );
  }
}

export async function setUserColumnsDisplay(columnsToDisplay: number) {
  try {
    await axios.patch<User>(`/api/user_profiles/`, {
      columns_to_display: columnsToDisplay,
    });
  } catch (error) {
    console.error(`Couldn't set user's columns display preferences: ${error}`);
  }
}

export async function getCurrentSong(sessionKey: string | undefined) {
  return await axios.get<Songbook>(`/api/songbooks/${sessionKey}/`);
}

export async function getSongbookDetails(sessionKey: string | undefined) {
  return await axios.get<SongbookDetails>(
    `/api/songbooks/${sessionKey}/details/`
  );
}

export async function getAllSongbooks() {
  return await axios.get<DjangoPaginatedResponse<SongbookListItem>>(
    `/api/songbooks/`
  );
}

export async function nextSongbookSong(sessionKey: string | undefined) {
  if (!sessionKey) return;

  try {
    await axios.patch<Songbook>(`/api/songbooks/${sessionKey}/next-song/`);
    return true;
  } catch (error) {
    console.error(`Couldn't get next song: ${error}`);
    return false;
  }
}

export async function createNewSongbook(
  maxActiveSongs: string | undefined,
  songbookTitle: string | undefined,
  isNoodleMode: boolean | undefined
) {
  try {
    return await axios.post<Songbook>(`/api/songbooks/`, {
      max_active_songs:
        maxActiveSongs && maxActiveSongs.length > 0 ? maxActiveSongs : null,
      title: songbookTitle,
      is_noodle_mode: isNoodleMode,
    });
  } catch (error) {
    console.error(`Couldn't create new songbook: ${error}`);
    return false;
  }
}

export async function setSongbookSong(
  sessionKey: string | undefined,
  songCreatedTime: string | undefined
) {
  if (!sessionKey || !songCreatedTime) return;

  try {
    await axios.patch<Songbook>(`/api/songbooks/${sessionKey}/`, {
      current_song_timestamp: songCreatedTime,
    });

    return true;
  } catch (error) {
    console.error(`Couldn't set new song: ${error}`);
    return false;
  }
}

export async function prevSongbookSong(sessionKey: string | undefined) {
  if (!sessionKey) return;
  try {
    await axios.patch<Songbook>(`/api/songbooks/${sessionKey}/previous-song/`);
    return true;
  } catch (error) {
    console.error(`Couldn't get previous song: ${error}`);
    return false;
  }
}

export async function deleteSongbookSong(songEntryId: number | undefined) {
  if (!songEntryId) return;

  try {
    await axios.delete(`/api/song_entries/${songEntryId}/`);
    return true;
  } catch (error) {
    console.error(`Couldn't delete song: ${error}`);
    return false;
  }
}

export async function searchForSong(q: string) {
  if (q.length < 1) return;

  try {
    const result = await axios.get<Song[]>(`/api/songs/search/`, {
      params: { q },
    });
    return result;
  } catch (error: any | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error?.response?.status === 404) {
        return "Could not find song, please try a different search.";
      }
    }
  }
  return "Could not add song, please try again later.";
}

export async function addSongToSongbook(
  song?: Song | undefined,
  songbookId?: number
) {
  try {
    return await axios.post<SongEntry>(`/api/song_entries/`, {
      song_id: song?.id,
      songbook_id: songbookId,
    });
  } catch (error: any | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error?.response?.status === 409) {
        return `"${song?.title}" by ${song?.artist} has already been requested.`;
      }
    }
  }

  return "Could not add song, please try again later.";
}

export async function setSongEntryFlagged(id: number | undefined) {
  if (!id) return;

  try {
    await axios.patch<SongEntry>(`/api/song_entries/${id}/`, {
      is_flagged: true,
    });
  } catch (error) {
    console.error(`Couldn't flag song entry: ${error}`);
  }
}

export async function setSongLikeStatus(song_id: number, isLiked: boolean) {
  try {
    if (isLiked) {
      return await axios.put(`/api/songs/${song_id}/like/`);
    } else {
      return await axios.delete(`/api/songs/${song_id}/like/`);
    }
  } catch (error) {
    console.error(`Couldn't update like status: ${error}`);
    return false;
  }
}

export async function getSongbookStats(sessionKey: string) {
  return await axios.get<SongbookStats>(`/api/songbooks/${sessionKey}/stats/`);
}

export async function getWishlistSongs() {
  return await axios.get<DjangoPaginatedResponse<WishlistSong>>(
    `/api/wishlist_songs/`
  );
}

export async function deleteWishlistSong(song) {
  if (!song.id) return;

  try {
    await axios.delete(`/api/wishlist_songs/${song.id}/`);
    return true;
  } catch (error) {
    console.error(`Couldn't delete wishlist song: ${error}`);
    return false;
  }
}

type WishlistSongPost = {
  artist: string;
  title: string;
};

export async function addSongToWishlist(song: WishlistSongPost) {
  try {
    return await axios.post<WishlistSongPost>(`/api/wishlist_songs/`, song);
  } catch (error: any | AxiosError) {}
  return "Could not add song, please try again later.";
}

export async function getRecommendations(session_key) {
  return await axios.get<Recommendation[]>(
    `/api/recommendations/${session_key}`
  );
}
