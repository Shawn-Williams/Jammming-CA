import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../utils/Spotify';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      tracks: [],
      playlist: [],
      saved: false
    };

    this.searchSpotify = this.searchSpotify.bind(this);
    this.savePlaylistToSpotify = this.savePlaylistToSpotify.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.checkLocalToken = this.checkLocalToken.bind(this);
  }
  
  getAccessToken() {
    Spotify.getAccessToken();
    this.setState({loggedIn: true})
  }

  checkLocalToken() {
    Spotify.localTokenisValid();
  }

  searchSpotify(term) {
    this.getAccessToken();
    this.getUserInfo();
    Spotify.search(term)
      .then(results => {
        this.setState({
          tracks: results
        })
      })  
  }

  getUserInfo() {
    Spotify.getUserInfo()
      .then(user => {
        if (user) {
          this.setState({
            user: {
              id: user.id,
              displayName: user.display_name,
              imageUrl: user.image_url
            },
          })};
        }
    );
  }

  savePlaylistToSpotify(name, playlist = this.state.playlist) {
    Spotify.savePlaylist(name, playlist)
    .then(success => {
      this.setState({saved: true})
      setTimeout(() => {
        this.setState({saved: false})
      }, 2000);
    });
    this.setState({playlist: []});
  }
  
  addTrack(track) {
    if (this.state.playlist.indexOf(track) === -1) {
      this.setState({playlist: this.state.playlist.concat(track)});
    }
    
  }

  removeTrack(track) {
    let playlist = this.state.playlist;
    playlist.splice(playlist.indexOf(track), 1);
    this.setState({playlist: playlist});
  }

  /**
   * Determine whether access token has been granted and query Spotify for user info if so.
   * This is to provide personalization on initial load from the Spotify authentication redirect.
   */
  componentWillMount() {
    if (window.location.href.match(/access_token=([^&]*)/)) {
      Spotify.parseToken();
      this.getUserInfo();
      this.setState({loggedIn: true});
    } else if (localStorage.getItem("accessToken")) {
      if(this.checkLocalToken()) {
        this.setState({loggedIn: false});
      }
      this.getUserInfo();
      this.setState({loggedIn: true});
    } 
  }

  render() {
    let user = '';

    if (this.state.user) {
      user = <div className="user-info">Hi<span className="user-name">{this.state.user.displayName.split(' ').shift()}</span><img src={this.state.user.imageUrl} alt='user avatar' /></div>;
    }
    return (
      <div>
        <header className='main-page-header'>
          <h1 className="page-title">Ja<span className="highlight">mmm</span>ing</h1>
          {user}
        </header> 
        <div className="App">
          <SearchBar search={this.searchSpotify} loggedIn={this.state.loggedIn} getAccessToken={this.getAccessToken}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.tracks} addTrack={this.addTrack}/>
            <Playlist tracks={this.state.playlist} removeTrack={this.removeTrack} savePlaylist={this.savePlaylistToSpotify} savedStatus={this.state.saved}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
