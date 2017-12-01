import React from 'react';
import TrackList from '../TrackList/TrackList';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import './Playlist.css';


class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistName: 'New Playlist',
    };
    
    this.setPlaylistName = this.setPlaylistName.bind(this);
    this.handlePlaylistSave = this.handlePlaylistSave.bind(this);
    this.clearInputOnclick = this.clearInputOnClick.bind(this);
    this.playlistDuration = this.playlistDuration.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    //this.reorder = this.reorder.bind(this);
  }

  setPlaylistName(e) {
    this.setState({playlistName: e.target.value});
  }

  clearInputOnClick(e) {
    if (e.target.value === 'New Playlist') {
      e.target.value='';
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

    if (totalTime > 0) {
      return `Playlist Duration: ${duration(totalTime)}`;
    } else return null;
    
  }

  onDragStart() {
    document.getElementById('Droppable-playlist').classList.add('dragging');
  }

  onDragEnd(result) {
    document.getElementById('Droppable-playlist').classList.remove('dragging');
    // Cancels if element is dropped outside of list.
    if (!result.destination) {
      return;
    };

    // Create the new list
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    //Update the list based on the current list and the result object provided by the API.
    const updatedList = reorder(
      this.props.tracks,
      result.source.index,
      result.destination.index
    );
    
    //Update the playlist state by providing the new list.
    this.props.updatePlaylist(updatedList);
  }

  render() {
    let saveButton = <a className="Playlist-save" onClick={this.handlePlaylistSave}>SAVE TO SPOTIFY</a>,
        reorderInstructions = this.props.tracks.length > 0? <span className="sort-instructions">DRAG TO REORDER</span> : '';

    if (this.props.savedStatus) {
      saveButton = <span className="Playlist-save success">SAVE SUCCESSFUL!</span> 
    }
    return (
      <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <div id="Droppable-playlist" className="Playlist">
          <input value={this.state.playlistName} onChange={this.setPlaylistName} onClick={this.clearInputOnClick}/>
          <span className="duration">{this.playlistDuration()}</span>
          <Droppable droppableId="droppable" type="user-playlist">
            {(dropProvided, snapshot) => (
              <div ref={dropProvided.innerRef}  className="droppable-track-wrapper" /*style={this.getListStyle(snapshot.isDraggingOver)}*/>
                <TrackList tracks={this.props.tracks} listType="playlist" modifyTracklist={this.props.removeTrack}/>
                {dropProvided.placeholder}
              </div>
            )}
            </Droppable>
          {reorderInstructions}
          {saveButton}
        </div>
      </DragDropContext>
    )
  }
}

export default Playlist;