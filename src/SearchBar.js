import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SearchBar extends Component {

  handleChange() {
    this.props.handleSearch(this.input.value);
  }

  render() {
    return(
      <div className="search-books-bar">
        <Link className="close-search" to="/"/>
        <div className="search-books-input-wrapper">
          <input type="text"
            defaultValue={this.props.defaultValue}
            ref={(input => this.input=input)}
            onChange={()=>this.handleChange()}
          placeholder="Search by title or author"/>
        </div>
      </div>
    )
  }
}

export default SearchBar;
