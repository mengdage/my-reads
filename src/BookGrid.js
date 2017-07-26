import React, { Component } from 'react';
import BookItem from './BookItem';

class BookGrid extends Component {
  render() {
    const books = this.props.books;
    const booksList = books.map(book=>(
      <li key={book.id}>
        <BookItem
          book={book}
          changeShelf={this.props.changeShelf}
        />
      </li>
    ));
    const className = this.props.className;
    return(
      <div className={className}>
        {books.length>0 && <ol className="books-grid">
          {booksList}
        </ol>}
        {books.length===0 && <div className="error-msg">No book available!</div>}
      </div>

    );
  }
}

export default BookGrid;
