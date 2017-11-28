import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.trackInPlaylist = this.trackInPlaylist.bind(this);
  }
  
  // Test whether current track is present in the user created playlist
  trackInPlaylist() {
    if(this.props.inPlaylist) {
      return 'inPlaylist'
    }  return null;
  } 

  duration() {
    let x = this.props.track.duration / 1000;
      let seconds = (x % 60).toFixed(0);
      let minutes = Math.floor(x / 60);
      if (seconds === 60) {
        minutes += 1;
        seconds = 0;
      }
    return `${minutes}m ${seconds}s`
  }

  render() {
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

export default Track;