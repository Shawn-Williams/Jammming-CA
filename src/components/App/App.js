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
      loggedIn: false,
      menuExpanded: false,
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
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.updatePlaylist = this.updatePlaylist.bind(this);
  }
  
  getAccessToken() {
    Spotify.getAccessToken();
  }

  toggleDropdown(e) {
    this.setState(prevState => ({menuExpanded: !prevState.menuExpanded}));
    e.preventDefault();
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

  logoutUser() {
    Spotify.resetTokens();
    this.setState({loggedIn: false, user: '', menuExpanded: false, tracks: [], playlist: []});
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

  removeTrack = (track) => {
    let playlist = this.state.playlist;
    playlist.splice(playlist.indexOf(track), 1);
    this.setState({playlist: playlist});
  }

  updatePlaylist(newPlaylist) {
    this.setState({playlist: newPlaylist});
  }

  /**
   * Determine whether access token has been granted and query Spotify for user info if so.
   * This is to provide personalization on initial load from the Spotify authentication redirect.
   */
  componentWillMount() {
    Spotify.tokenIsValid();
    if (window.location.href.match(/access_token=([^&]*)/)) {
      Spotify.parseToken();
      this.getUserInfo();
      this.setState({loggedIn: true});
    } else if (localStorage.getItem('accessToken')) {
      Spotify.getAccessToken();
      this.getUserInfo();
      this.setState({loggedIn: true});
    } 
  }

  render() {
    let user = '';
    let menuCaret = this.state.menuExpanded ? <i className="fa fa-angle-down fa-angle-down-active" aria-hidden="true"></i> : <i className="fa fa-angle-down fa-angle-down-inactive" aria-hidden="true"></i>;
    if (this.state.user) {
      user = <div className="user-info">
               <a className='dropdown-toggle' onClick={this.toggleDropdown}>{menuCaret}</a>
               <span className="user-name">Hi {this.state.user.displayName.split(' ').shift()}</span>
               <span className={this.state.menuExpanded? 'user-logout' : 'user-logout hidden'}><a onClick={this.logoutUser} >Logout</a></span>
                <img src={this.state.user.imageUrl} alt='user avatar' />
            </div>;
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
              <SearchResults searchResults={this.state.tracks} addTrack={this.addTrack} playlist={this.state.playlist}/>
              <Playlist tracks={this.state.playlist} removeTrack={this.removeTrack} savePlaylist={this.savePlaylistToSpotify} savedStatus={this.state.saved} updatePlaylist={this.updatePlaylist}/>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
