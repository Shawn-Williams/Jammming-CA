
const CLIENT_ID = 'fe091ac7832744b692ad3ec109f337b4';
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const REDIRECT_URI = 'http://localhost:3000/';

let accessToken,
    userId;

let Spotify = {

  /**
   * Reset local storage values if the token expiration time has passed.
   */

  localStorageIsValid() {
    let expiresIn = localStorage.getItem('tokenExpiration');
    if (expiresIn && Date.now() >= expiresIn) {
      localStorage.setItem('accessToken', '');
      localStorage.setItem('tokenExpiration', '');
    } else {
      accessToken = localStorage.getItem('accessToken');
      return true;
    }
  },

  /**
   * Request access token from Spotify and set local storage to current valid access token.
   * Additionally, reset the local accessToken variable and local storage after 60 min.
   */

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[0].slice(13);
;
      let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].slice(11);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('tokenExpiration', Date.now() + (3600 * 999)); 
      window.setTimeout(() => {
        accessToken = '';
        localStorage.setItem('accessToken', '');
      }, expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
    } 
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
              uri: track.uri
            }
          });
        } else return [];
      })
  },

 /**
  * Request user information from Spotify API for current authorized user.
  */

  getUserInfo() {
      return fetch('https://api.spotify.com/v1/me', {headers: {Authorization: `Bearer ${accessToken || localStorage.getItem('accessToken')}`}})
      .then(response => response.json())
      .then(jsonResponse => {
        userId = jsonResponse.id;
        return {
          id: jsonResponse.id,
          display_name: jsonResponse.display_name,
          image_url: jsonResponse.images[0].url
        }
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
     return Spotify.addTracksToPlaylist(playlistId, trackList)
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

