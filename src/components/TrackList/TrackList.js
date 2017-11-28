import React from 'react';
import DraggableTrack from '../Track/DraggableTrack';
import Track from '../Track/Track';

import './TrackList.css';

class TrackList extends React.Component{
  
	inPlaylist = false;

	isInPlaylist = (track, el) => {
		return el.id === track;
	};

	render() {
		return (
			<div className={`TrackList ${this.props.listType}`} >
				{this.props.tracks.map((track, index) => {
					let action,
							renderedTrack; 
							
					if (this.props.playlist) {
						this.inPlaylist = this.props.playlist.find(this.isInPlaylist.bind(this, track.id)) ? true : false;
					}

					if(this.props.listType === "search-results") {
						action = "+";
						renderedTrack = <Track key={index} track={track} action={action} modifyTracklist={this.props.modifyTracklist} inPlaylist={this.inPlaylist} listType={this.props.listType}/>;
					} else if (this.props.listType === "playlist") {
						action = "-";
						renderedTrack = <DraggableTrack key={index} index={index} track={track} action={action} modifyTracklist={this.props.modifyTracklist} inPlaylist={this.inPlaylist} listType={this.props.listType}/>;
					}
					
					return renderedTrack;
				}
			)}
		</div>
	)}
} 

export default TrackList;