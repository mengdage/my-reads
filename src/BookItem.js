import React, { Component } from 'react';

class BookItem extends Component {

  handleChange(e) {
    console.log(e.target.value);
    const book = this.props.book;
    const newShelf = e.target.value;
    this.props.changeShelf(book, newShelf);
  }

  render() {
    const book = this.props.book;
    const title = book.title;
    const authors = book.authors ? book.authors.reduce(
      (acc, cur) => acc? `${acc}; ${cur}` : `${cur}`, '') : '';
    const thumbnailUrl = book.imageLinks.thumbnail;
    const shelf = book.shelf;
    return(
      <div className="book">
        <div className="book-top">
          <div className="book-cover"
            style={{
              width: 128,
              height: 188,
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
          <div className="book-shelf-changer">
            <select onChange={(e)=>this.handleChange(e)} value={shelf}>
              <option disabled>Move to...</option>
              <option value='currentlyReading'>Currently Reading</option>
              <option value='wantToRead'>Want to Read</option>
              <option value='read'>Read</option>
              <option value='none'>None</option>
            </select>
          </div>

        </div>
        <div className="book-title">{title}</div>
        <div className="book-authors">{authors}</div>
      </div>
    )
  }
}


export default BookItem;
