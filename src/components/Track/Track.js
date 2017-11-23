import React from 'react';
import './Track.css';




function Track(props) {
  let inPlaylist = props.inPlaylist ? 'inPlaylist' : '';
  return (
    <div className="Track">
    <div className={`Track-information ${inPlaylist}`}>
      <h3>{props.track.name}</h3> 
      <p>{props.track.artist} | {props.track.album}</p>
      {/* {preview}  */}
    </div>
    <a className={`Track-action ${inPlaylist}`} onClick={props.modifyPlaylist.bind(this, props.track)}>{props.action}</a> 
  </div> 
  )
}

export default Track;