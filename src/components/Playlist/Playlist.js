import React, { Component } from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';


class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistName: 'New Playlist',
    };
    
    this.setPlaylistName = this.setPlaylistName.bind(this);
    this.handlePlaylistSave = this.handlePlaylistSave.bind(this);
    this.clearInputOnclick = this.clearInputOnClick.bind(this);
    this.resetDefaultPlaylistName = this.resetDefaultPlaylistName.bind(this);
  }

  setPlaylistName(e) {
    this.setState({playlistName: e.target.value});
  }

  clearInputOnClick(e) {
    if (e.target.value === 'New Playlist') {
      e.target.value='';
    }
  }

  resetDefaultPlaylistName(e) {
    if (!this.state.playlistName && e.target.value === '') {
      this.setState({playlistName: this.state.playlistName});
    }
  }

  handlePlaylistSave(e) {
    this.props.savePlaylist(this.state.playlistName);
    this.setState({playlistName: 'New Playlist'});
    e.preventDefault();
  }  

  

  render() {
    let saveButton = <a className="Playlist-save" onClick={this.handlePlaylistSave}>SAVE TO SPOTIFY</a>;

    if (this.props.savedStatus) {
      saveButton = <span className="Playlist-save success">SAVE SUCCESSFUL!</span> 
    }

    return (
    <div className="Playlist">
      <input value={this.state.playlistName} onChange={this.setPlaylistName} onClick={this.clearInputOnClick} />
      <TrackList tracks={this.props.tracks} action="-" modifyPlaylist={this.props.removeTrack}/>
      {saveButton}
    </div>
    )
  }
}

export default Playlist;