import React from 'react';
import Track from '../Track/Track';

import './TrackList.css';


function TrackList (props) {
	//console.log(props.tracks);
		return (
			<div className="TrackList">
				{props.tracks.map(track => {
					return <Track key={track.id} track={track} action={props.action} modifyPlaylist={props.modifyPlaylist}/>
				})}
				
			</div>
		)
	
} 

export default TrackList;