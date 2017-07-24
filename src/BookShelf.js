import React, { Component } from 'react';
import BookItem from './BookItem';

class BookShelf extends Component {

  render() {
    const shelfName = this.props.shelfName;
    const books = this.props.books;
    const booksList = books.map(book => (
      <li key={book.id}>
        <BookItem
          book={book}
          changeShelf={this.props.changeShelf}/>
      </li>
    ));
    return(
      <div className="bookshelf">
        <h2 className="bookshelf-title">{shelfName}</h2>
        <ol className="books-grid">
          {booksList}
        </ol>

      </div>
    );
  }
}

export default BookShelf;
