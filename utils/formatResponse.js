const formatTracks = (tracks) => {
  return tracks.map((track) => ({
    id: track.id || track._id, // acepta cualquiera de los dos
    name: track.name || track.title,
    artist: track.artist,
    album: track.album,
    duration_ms: track.duration_ms || track.duration,
    preview_url: track.preview_url || track.url,
    external_url: track.external_url,
    image: track.image,
    audioFeatures: {
      valence: track.audioFeatures?.valence ?? null,
      energy: track.audioFeatures?.energy ?? null,
      danceability: track.audioFeatures?.danceability ?? null,
      tempo: track.audioFeatures?.tempo ?? null
    }
  }));
};

module.exports = {
  formatTracks
};