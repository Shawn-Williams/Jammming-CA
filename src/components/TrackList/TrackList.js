import React from 'react';
import Track from '../Track/Track';

import './TrackList.css';

class TrackList extends React.Component{
  
	inPlaylist = false;

	isInPlaylist = (track, el) => {
		return el.id === track;
	};
	
	render() {
		return (
			<div className="TrackList" >
				{this.props.tracks.map((track, index) => {
					let action; 
					if(this.props.listType === "search-results") {
						action = "+"
					} else if (this.props.listType === "playlist") {
						action = "-";
					}
					/**
					 * Set a boolean property based on whether a track in the search results is already in the playlist
					*/
					if (this.props.playlist) {
						this.inPlaylist = this.props.playlist.find(this.isInPlaylist.bind(this, track.id)) ? true : false;
					}
					return <Track key={index} track={track} action={action} modifyTracklist={this.props.modifyTracklist} inPlaylist={this.inPlaylist} listType={this.props.listType}/>
				}
			)}
		</div>
	)}
} 

export default TrackList;