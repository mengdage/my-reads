import React, { Component } from 'react';
import BookGrid from './BookGrid';

class BookShelf extends Component {

  render() {
    const shelfName = this.props.shelfName;
    const books = this.props.books;
    return(
      <div className="bookshelf">
        <h2 className="bookshelf-title">{shelfName}</h2>
        <BookGrid books={books}
          changeShelf={this.props.changeShelf}
        />
      </div>
    );
  }
}

export default BookShelf;
