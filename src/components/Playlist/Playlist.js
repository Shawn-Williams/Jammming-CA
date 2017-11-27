import React, { Component } from 'react';
import TrackList from '../TrackList/TrackList';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
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
    this.playlistDuration = this.playlistDuration.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
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
  
  playlistDuration() {
    let totalTime = 0;
    let duration = (timeInMs) => {
      let x = timeInMs / 1000;
      let seconds = (x % 60).toFixed(0);
      let minutes = Math.floor(x / 60);
      if (seconds === 60) {
        minutes += 1;
        seconds = 0;
      }
      return `${minutes}m ${seconds}s`
    }

    this.props.tracks.map(track => {
      totalTime += track.duration;
      return null;
    })
    return duration(totalTime);
  }

  onDragEnd = (result) => {
    // if dropped outside the list
    if (!result.destination) {
      return;
    }
    
    const newList = this.props.reorder(
      this.props.tracks,
      result.source.index,
      result.destination.index
    );
    
    this.props.updatePlaylist(newList)
  }

  render() {
    let saveButton = <a className="Playlist-save" onClick={this.handlePlaylistSave}>SAVE TO SPOTIFY</a>;

    if (this.props.savedStatus) {
      saveButton = <span className="Playlist-save success">SAVE SUCCESSFUL!</span> 
    }

    return (
    <DragDropContext onDragEnd={this.onDragEnd}>
      <div className="Playlist">
        <input value={this.state.playlistName} onChange={this.setPlaylistName} onClick={this.clearInputOnClick} />
        <span className="duration">Playlist duration: {this.playlistDuration()}</span>
        <Droppable droppableId="droppable" type="user-playlist">
          {(dropProvided, snapshot) => (
            <div ref={dropProvided.innerRef}  className="droppable-track-wrapper">
              <TrackList tracks={this.props.tracks} listType="playlist" modifyTracklist={this.props.removeTrack}/>
              {dropProvided.placeholder}
            </div>
          )}
          </Droppable>
        {saveButton}
      </div>
    </DragDropContext>
    )
  }
}

export default Playlist;