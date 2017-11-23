import React from 'react';
import Track from '../Track/Track';

import './TrackList.css';



function TrackList (props) {
	let inPlaylist = false;
	
	function isInPlaylist (track, el) {
		return el.id === track;
	};
	return (
		<div className="TrackList">
			{props.tracks.map(track => {
				/**
	       * Set a boolean property based on whether a track in the search results is already in the playlist
	      */
				if (props.playlist) {
					inPlaylist = props.playlist.find(isInPlaylist.bind(this, track.id)) ? true : false;
				}
				return <Track key={track.id} track={track} action={props.action} modifyPlaylist={props.modifyPlaylist} inPlaylist={inPlaylist}/>
			})}
			
		</div>
	)
} 

export default TrackList;