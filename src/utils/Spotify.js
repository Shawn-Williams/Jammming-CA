import CONFIG from './config';

const CLIENT_ID = CONFIG.clientId;
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const REDIRECT_URI = CONFIG.redirectURI;
let accessToken,
    expiresIn,
    userId;

const Spotify = {

  getAccessToken() {
    this.tokenIsValid();
    if (accessToken) {
      return accessToken;
    } else if (!accessToken && localStorage.getItem('accessToken')) {
      accessToken = localStorage.getItem('accessToken');
    } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      this.parseToken();
    } else {
      window.location = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&show_dialog=true&redirect_uri=${REDIRECT_URI}`;
    } 
  },

  parseToken() { 
    accessToken = window.location.href.match(/access_token=([^&]*)/)[0].slice(13);
    expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].slice(11);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('tokenExpiration', Date.now() + (expiresIn * 1000));
    window.history.pushState('Access Token', null, '/');
  },
  
  resetTokens() {
    accessToken = '';
    expiresIn = '';
    userId = '';

    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpiration');
  },
  
 /**
  * Test token expiration and reset both local token and token variable if expired
 */
  tokenIsValid() {
    if (Date.now() > localStorage.getItem('tokenExpiration')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiration');
      accessToken = '';
    } 
  },

  getUserInfo() {
    return fetch('https://api.spotify.com/v1/me', {headers: {Authorization: `Bearer ${accessToken}`}})
    .then(response => response.json())
    .then(jsonResponse => {
      userId = jsonResponse.id;
      return {
        id: jsonResponse.id,
        display_name: jsonResponse.display_name,
        image_url: jsonResponse.images[0].url
      }
    })
    .catch(error => {
      console.log(`No data was returned. User has not been authorized.`);
    });
 },

  search(term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.tracks) {
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri,
              previewUrl: track.preview_url,
              duration: track.duration_ms
            }
          });
        } else return [];
      })
  },
 
  savePlaylist(name, trackList) {
    let playlistId;

    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json"},
      body: JSON.stringify({"name": name, "public": "true"})
    })
    .then(response => response.json())
    .then(jsonResponse => {
      playlistId = jsonResponse.id;
      return playlistId;
    })
    .then(playlistId => {
     return this.addTracksToPlaylist(playlistId, trackList)
     .then(success => success);
    })
   },

   addTracksToPlaylist(playlistId, trackList) {
      let trackURIs = trackList.map(track => track.uri);

      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json"},
        body: JSON.stringify(trackURIs)
      })
      .then(success => success.status);
   }
}

export default Spotify;

