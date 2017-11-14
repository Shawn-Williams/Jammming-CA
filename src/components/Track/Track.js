import React from 'react';
import './Track.css'



function Track(props) {
  return (
    <div className="Track">
    <div className="Track-information">
      <h3>{props.track.name}</h3> 
      <p>{props.track.artist} | {props.track.album}</p>
    </div>
    <a className="Track-action" onClick={props.modifyPlaylist.bind(this, props.track)}>{props.action}</a> 
  </div> 
  )
}

export default Track;