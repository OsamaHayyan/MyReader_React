import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import CurrentReading from "./currentread";
import WantToRead from "./want_to_read";
import Read from "./read";
import Search from "./search";

class BooksApp extends React.Component {
  state = {
    books: [],
    query: "",
    searchBooks: [],
    shelf: "",
    noBook: "",
    showSearchPage: false,
  };

  async componentDidMount() {
    const state = { ...this.state };

    const books = await BooksAPI.getAll();
    state.books = books;
    //set state
    this.setState(state);
  }

  handleSearchButton = () => {
    this.setState({
      showSearchPage: false,
      searchBooks: [],
      noBook: "",
      query: "",
    });
  };

  handleChangeSearch = async (e) => {
    e.persist();
    //Clone

    let state = { ...this.state };
    //Edit
    setTimeout(async () => {
      state.query = await e.target.value;

      if (state.query) {
        this.setState(state);
      } else {
        this.setState({ query: "" });
      }
    }, 500);
  };

  handleChangeShelf = async (eventValue, book) => {
    const state = { ...this.state };
    const index = state.books.indexOf(book);

    if (eventValue === "move") return;

    if (
      state.showSearchPage === false &&
      state.books[index].shelf !== eventValue
    ) {
      state.books[index].shelf = eventValue;
      this.setState(state);
      await BooksAPI.update(book, eventValue);
    }

    if (state.showSearchPage === true && state.shelf.length >= 0) {
      await BooksAPI.update(book, eventValue);
      if (eventValue) {
        state.shelf = eventValue;
        this.setState(state);
      }
    }
  };

  async componentDidUpdate(prevProps, prevState) {
    setTimeout(async () => {
      if (this.state.query !== prevState.query) {
        //Clone
        let state = { ...this.state };
        //fetch data

        let searchBooks;
        if (this.state.query) {
          searchBooks = await BooksAPI.search(this.state.query);
          //Edite
          if (searchBooks.error === "empty query") {
            state.searchBooks = [];
            state.noBook = "There is no books with this name";
            this.setState(state);
          } else {
            state.searchBooks = searchBooks;
            state.noBook = "";
            //set state
            this.setState(state);
          }
        } else {
          state.searchBooks = [];
          this.setState(state);
        }
      }
    }, 500);
    if (this.state.shelf !== prevState.shelf && this.state.shelf !== "") {
      this.setState({ shelf: "", showSearchPage: false });

      const books = await BooksAPI.getAll();
      this.setState({ books: books });
    }
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <Search
            handleSearchButton={this.handleSearchButton}
            handleChangeSearch={this.handleChangeSearch}
            handleChangeShelf={this.handleChangeShelf}
            noBook={this.state.noBook}
            query={this.state.query}
            searchBooks={this.state.searchBooks}
          />
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <CurrentReading
                  books={this.state.books}
                  handleChangeShelf={this.handleChangeShelf}
                />
                <WantToRead
                  books={this.state.books}
                  handleChangeShelf={this.handleChangeShelf}
                />
                <Read
                  books={this.state.books}
                  handleChangeShelf={this.handleChangeShelf}
                />
              </div>
            </div>
            <div className="open-search">
              <button onClick={() => this.setState({ showSearchPage: true })}>
                Add a book
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BooksApp;
