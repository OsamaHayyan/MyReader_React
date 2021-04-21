import React, { Component } from "react";

class Search extends Component {
  state = {};

  render() {
    const {
      handleSearchButton,
      handleChangeSearch,
      handleChangeShelf,
      noBook,
      query,
      searchBooks,
    } = this.props;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <button className="close-search" onClick={handleSearchButton}>
            Close
          </button>
          <div className="search-books-input-wrapper">
            <input
              name="query"
              onChange={handleChangeSearch}
              type="text"
              placeholder="Search by title or author"
            />
          </div>
        </div>
        <div className="search-books-results">
          {noBook}
          <ol className="books-grid">
            {query.length > 0 &&
              searchBooks.map((book) => (
                <li key={book.id}>
                  <div className="book">
                    <div className="book-top">
                      <div
                        className="book-cover"
                        style={{
                          width: 128,
                          height: 193,
                          backgroundImage: `url(${
                            book.imageLinks ? book.imageLinks.thumbnail : ""
                          })`,
                          backgroundColor: "black",
                        }}
                      />
                      <div className="book-shelf-changer">
                        <select
                          name="shelf"
                          onChange={(event) =>
                            handleChangeShelf(event.target.value, book)
                          }
                        >
                          <option value="move" defaultValue>
                            Move to...
                          </option>
                          <option value="currentlyReading">
                            Currently Reading
                          </option>
                          <option value="wantToRead">Want to Read</option>
                          <option value="read">Read</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-authors">{book.authors}</div>
                  </div>
                </li>
              ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default Search;
