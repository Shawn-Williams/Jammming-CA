import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './Track.css';




class Track extends React.Component {
  constructor(props) {
    super(props)

    this.displayPlaylist = this.displayPlaylist.bind(this);
    this.getItemStyle = this.getItemStyle.bind(this);
  }
  
  // Test whether current track is present in the user created playlist
  trackInPlaylist = () => {
    if(this.props.inPlaylist) {
      return 'inPlaylist'
    }  return null;
  } 

  duration = () => {
    let x = this.props.track.duration / 1000;
      let seconds = (x % 60).toFixed(0);
      let minutes = Math.floor(x / 60);
      if (seconds === 60) {
        minutes += 1;
        seconds = 0;
      }
    return `${minutes}m ${seconds}s`
  }

  getItemStyle = (draggableStyle, isDragging) => ({
    userSelect: 'none',
  
    // change background color if dragging
    background: isDragging ? '#581C7A' : 'none',
  
    // styles we need to apply on draggables
    ...draggableStyle,
    margin: draggableStyle && draggableStyle.margin ? draggableStyle.margin : `0 0 ${this.grid}px 0`,
  });
  
  //Determine whether the track is located in the user created playlist and, if so, render track inside draggable wrapper
  displayPlaylist = () => {
    if (this.props.listType==="playlist") {
      return (
        <Draggable draggableId={this.props.track.id} type="user-playlist"> 
        {(provided, snapshot) => (
          <div className="droppable-wrapper">
            <div ref={provided.innerRef} style={this.getItemStyle(
              provided.draggableStyle,
              snapshot.isDragging
            )} {...provided.dragHandleProps}>
              <div className="Track">
                <div className={`Track-information ${this.trackInPlaylist}`}>
                  <h3>{this.props.track.name}</h3> 
                  <p>{this.props.track.artist} | {this.props.track.album}</p>
                  <p className="duration">{this.duration()}</p>
                </div>
                <a className={`Track-action ${this.inPlaylist}`} onClick={this.props.modifyTracklist.bind(this, this.props.track)}>{this.props.action}</a> 
              </div>
            </div>
            {provided.placeholder}
          </div>
        )}
        </Draggable>
      )
    }
    else {
      return (
        <div className="Track">
        <div className={`Track-information ${this.trackInPlaylist()}`}>
          <h3>{this.props.track.name}</h3> 
          <p>{this.props.track.artist} | {this.props.track.album}</p>
          <p className="duration">{this.duration()}</p>
        </div>
        <a className={`Track-action ${this.trackInPlaylist()}`} onClick={this.props.modifyTracklist.bind(this, this.props.track)}>{this.props.action}</a> 
      </div> 
      )
    }
  }
  
  render() {
    return this.displayPlaylist()
  }
  
}

export default Track;