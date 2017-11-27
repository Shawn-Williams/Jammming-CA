import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      term: ''
    };
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
  }

  handleTermChange(e) {
    this.setState({term: e.target.value});
  }

  getAccessToken(e) {
    this.props.getAccessToken();
    e.preventDefault();
  }

  handleSearch(e) {
    if (this.state.term) {
      this.props.search(this.state.term);
    } 
    
    e.preventDefault();
  }

  render() {
    let searchButton = <button onClick={this.getAccessToken} className="logged-out" type="submit">CONNECT TO SPOTIFY</button>
    let searchBarValue = '';
    if (this.props.loggedIn) {
      searchButton = <button onClick={this.handleSearch} type="submit">SEARCH</button>
      searchBarValue = this.state.term;
    }
    return (
      <form className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} disabled={!this.props.loggedIn} value={searchBarValue}/>
        {searchButton}
      </form> 
    )
  }
}

export default SearchBar;
