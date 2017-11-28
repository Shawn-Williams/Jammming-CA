import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Track from '../Track/Track';

class DraggableTrack extends React.Component {
  constructor(props) {
    super(props);

    this.getItemStyle = this.getItemStyle.bind(this);
  }

  getItemStyle = (draggableStyle, isDragging) => ({
    userSelect: 'none',
    cursor: 'grab',
    // change background color if dragging
    background: isDragging ? '#581C7A' : 'none',
  
    // styles we need to apply on draggables
    ...draggableStyle,
    margin: draggableStyle && draggableStyle.margin ? draggableStyle.margin : `0 0 ${this.grid}px 0`,
  });

  render() {
    return (
      <Draggable draggableId={this.props.track.id} type="user-playlist" > 
      {(provided, snapshot) => (
        <div className="draggable-wrapper">
          <div ref={provided.innerRef} draggable="true" style={this.getItemStyle(
            provided.draggableStyle,
            snapshot.isDragging
          )} {...provided.dragHandleProps}>
            <Track key={this.props.index} track={this.props.track} action={this.props.action} modifyTracklist={this.props.modifyTracklist} inPlaylist={this.props.inPlaylist}/>	
          </div>
          {provided.placeholder}
        </div>
      )}
      </Draggable>
    )
  }
}

export default DraggableTrack;