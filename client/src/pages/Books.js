import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, FormBtn } from "../components/Form";

class Books extends Component {
  state = {
    books: [],
    searchResults: [],
    title: ""
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
      )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  //Queries the Google API and converts all the data
  //into an array of objects which is added to state
  handleBookSearch = event => {
    event.preventDefault();
    API.searchBooks(this.state.title)
      .then(res => {
        let rawresults = res.data.items;
        let results = [];

        
        let filteredresults = rawresults

        //TODO some books don't have thumbnails, my ternary doesn't seem to work sometimes
        // .filter(result => {
        //   return (typeof result.volumeInfo.authors !== "array") || (typeof result.volumeInfo.imageLinks !== "undefined" )
        // })
      

        results = filteredresults.map(result => {
          
          result = {
            key: result.id,
            id: result.id,
            title: result.volumeInfo.title,
            authors: (result.volumeInfo.authors.length ? result.volumeInfo.authors.join(", ") : result.volumeInfo.authors.toString()),
            description: result.volumeInfo.description,
            image: (result.volumeInfo.imageLinks) ? result.volumeInfo.imageLinks.thumbnail : "no image",
            link: result.volumeInfo.canonicalVolumeLink
          }
          return result
        })
        // console.log(results)
        this.setState({ searchResults: results })
        this.setState({ title: "" });
      })
      .catch(err => console.log(err));
  };

  handleBookSave = event => {
    event.preventDefault();
    let savedBooks = this.state.searchResults.filter(book => book.id === event.target.id)
    
    savedBooks = savedBooks[0];
    
    API.saveBook(savedBooks)
        .then(this.loadBooks())
        .catch(err => console.log(err))
  }

  render() {
    return (
      <Container fluid>
        <Row>
          {/* This is all on the left part of the app */}
          <Col size="md-6">
            <Jumbotron>
              <h1>Search for a Book</h1>
            </Jumbotron>
            <form>
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                name="title"
                placeholder="Title of book you're searching for"
              />

              <FormBtn disabled={!(this.state.title)}
                onClick={this.handleBookSearch}>Search
              </FormBtn>
              <br></br>
            </form>
            {this.state.searchResults.length ? (
              <List>
                {this.state.searchResults.map(book => (
                  <ListItem key={book.id}>
                    
                    <div className="card" style={{width: "100%"}}>
                      <img src={book.image} style={{width: "30%"}} className="card-img-top" alt=""></img>
                        <div className="card-body">
                          <h5 className="card-title">{book.title} by {book.authors}</h5>
                          <p className="card-text">{book.description}</p>
                          <a href={book.link}><FormBtn>Link to Google Books</FormBtn></a>
                          <span>   </span>
                          <FormBtn id={book.id} onClick={this.handleBookSave}>Save this Book</FormBtn>
        
                        </div>
                    </div>



                  </ListItem>
                    ))}
              </List>
                ) : (
                <h3>No Search Results (yet)</h3>
                )}
  
  
          </Col>
          {/* This is all on the right part of the app */}
          <Col size="md-6 sm-12">
              <Jumbotron>
                <h1>Saved Books</h1>
              </Jumbotron>
              {this.state.books.length ? (
                <List>
                  {this.state.books.map(book => (
                    <ListItem key={book._id}>
                      <Link to={"/books/" + book._id}>
                        <strong>
                          {book.title} by {book.authors}
                        </strong>
                      </Link>
                      <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                  <h3>No Results to Display</h3>
                )}
            </Col>
        </Row>
      </Container>
        );
      }
    }
    
    export default Books;
