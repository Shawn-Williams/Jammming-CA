
const CLIENT_ID = 'fe091ac7832744b692ad3ec109f337b4';
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const REDIRECT_URI = 'http://localhost:3000/'; //Change this uri to the address where the app is hosted

let accessToken,
    expiresIn,
    userId;

let Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      this.parseToken();
    } else {
      window.location = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
    } 
  },

  parseToken() {
    accessToken = window.location.href.match(/access_token=([^&]*)/)[0].slice(13);
    localStorage.setItem('accessToken', accessToken);
    expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].slice(11);
    localStorage.setItem('tokenExpiration', Date.now() + (expiresIn * 1000));
    window.setTimeout(() => {
      accessToken = '';
      localStorage.setItem('accessToken', '');
    }, expiresIn * 1000); // reset token if browser session extends beyond the token's valid timeframe
    window.history.pushState('Access Token', null, '/');
  },

 /**
  * Test local token expiration and set accessToken variable to localToken value if 
  * variable has not been set. This is to allow for query of user information on page reload
  * as well as the redirect from the Spotify authentication page.
  */
  
  localTokenisValid() {
    if (Date.now() > localStorage.getItem('tokenExpiration')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiration');
      return false;
    } return true;
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
              uri: track.uri
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

