import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import BookShelf from './BookShelf';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyReading: [],
      wantToRead: [],
      read: []
    }
  }
  componentDidMount() {
    BooksAPI.search('art', 10)
      .then(books=>console.log(books));

    BooksAPI.getAll()
      .then(books => {
        console.log(books);
        // create copies of shelves
        const current = Array.prototype.slice.call(this.state.currentlyReading);
        const want = Array.prototype.slice.call(this.state.wantToRead);
        const read = Array.prototype.slice.call(this.state.read);
        // push books to each shelf according to their shelf type
        books.forEach(book => {
          switch(book.shelf) {
            case 'currentlyReading':
              current.push(book);
              break;
            case 'wantToRead':
              want.push(book);
              break;
            case 'read':
              read.push(book);
              break;
            default:
              console.error(`Unknown shelf type: ${book.shelf}`);
          }
        });

        // set app state
        this.setState({
          currentlyReading: current,
          wantToRead: want,
          read: read
        });
      });
  }

  changeShelf(book, newShelfName) {
    // if shelf does not change, ignore
    if(book.shelf === newShelfName) {
      return;
    }

    const bookId = book.id;
    const oldShelfName = book.shelf;
    const oldShelf = Array.prototype.slice.call(this.state[oldShelfName]);

    BooksAPI.update(book, newShelfName)
    .then(data=> {
      let newState = {};
      // remove the book from the old shelf
      newState[oldShelfName] = oldShelf.filter((b) => b.id!==bookId);
      // if new shelf name is not none, add the update book to the correct shelf
      if(newShelfName!== 'none') {
        const newShelf = Array.prototype.slice.call(this.state[newShelfName]);
        book.shelf = newShelfName;
        newShelf.push(book);
        newState[newShelfName] = newShelf;
      }

      this.setState(newState);

    });

  }
  render() {
    return (
      <div className="app">
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <BookShelf shelfName={'Currently Reading'}
              books={this.state.currentlyReading}
              changeShelf={(book, newShelf)=>this.changeShelf(book, newShelf)}/>
            <BookShelf shelfName={'Want to Read'}
              books={this.state.wantToRead}
              changeShelf={(book, newShelf)=>this.changeShelf(book, newShelf)}/>
            <BookShelf shelfName={'Read'}
              books={this.state.read}
              changeShelf={(book, newShelf)=>this.changeShelf(book, newShelf)}/>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
