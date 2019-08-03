import axios from "axios";

const BASEQUERY = "https://www.googleapis.com/books/v1/volumes?q=";

export default {
  // Gets all books
  getBooks: function() {
    return axios.get("/api/savedbooks");
  },
  // Gets the book with the given id
  getBook: function(id) {
    return axios.get("/api/savedbooks/" + id);
  },
  // Deletes the book with the given id
  deleteBook: function(id) {
    return axios.delete("/api/savedbooks/" + id);
  },
  // Saves a book to the database
  saveBook: function(bookData) {
    return axios.post("/api/savedbooks", bookData);
  },
  searchBooks: function(query){
    return axios.get(BASEQUERY + query)
  }

};
