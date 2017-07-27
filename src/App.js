import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import BookShelf from './BookShelf';
import BookGrid from './BookGrid';
import SearchBar from './SearchBar';
import { Link, Route } from 'react-router-dom';
import debounce from 'lodash.debounce';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyReading: [],
      wantToRead: [],
      read: [],
      loading: false,
      query: '',
      queryResults: []
    }
  }

  handleSearch = (query) => {
    this.setState({
      loading: true
    });
    this.queryBooksDebounced(query);
  }

  queryBooksDebounced =
    debounce((query)=>{
      // if query is empty, ignore the query, cancel the loading, set query result to empty array
      if(!query){
        this.setState({
          queryResults: [],
          query: query,
          loading: false
        });
        return;
      }

      // if the query is the same as the last query, do not send new request to the server
      if(query === this.state.query) {
        this.setState({
          loading: false
        });
        return;
      }

      BooksAPI.search(query)
        .then(results => {
          const qr = Array.isArray(results)? results : [];
          this.setState({
            queryResults: qr,
            query: query,
            loading: false
          });
        });

    },500);

  componentDidMount() {
    BooksAPI.getAll()
      .then(books => {
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

  changeShelf = (book, newShelfName) => {
    // if shelf does not change, ignore
    if(book.shelf === newShelfName) {
      return;
    }

    const bookId = book.id;
    const oldShelfName = book.shelf;

    BooksAPI.update(book, newShelfName)
    .then(data=> {
      let newState = {};
      // if old shelf name is not none, remove the book from the old shelf
      if(oldShelfName!=='none') {
        const oldShelf = Array.prototype.slice.call(this.state[oldShelfName]);
        newState[oldShelfName] = oldShelf.filter((b) => b.id!==bookId);
      }
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
        <Route exact path="/" render={()=>(
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
            <div className="open-search">
              <Link to="/search" />
            </div>
          </div>
        )} />
        <Route path="/search" render={()=>(
          <div className="search-books">
            <SearchBar
              defaultValue={this.state.query}
              handleSearch={this.handleSearch}/>
            {this.state.loading && <div className="loading">Loading</div>}
            <BookGrid
              className="search-books-results"
              books={this.state.queryResults}
              changeShelf={this.changeShelf}
            />

          </div>
        )} />

      </div>
          );
  }
}

export default App;
/*
*/
