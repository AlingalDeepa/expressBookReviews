const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
 // return res.status(300).json({message: "Yet to be implemented"});
 res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn],null,4));
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;


// Filter books by author
console.log("Output: ", author);
//const bookValues = allBooks.filter(book => book.author.toLowerCase() === author);

// Convert object values to an array
const allBooks = Object.entries(books);
const bookKeys = Object.keys(books);

   // Iterate through the 'books' object & check the author matches the one provided
   const booksByAuthor = bookKeys
      .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
      .map(key => books[key]);

   console.log(`Books by ${author}:`, booksByAuthor);

res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  // Convert object values to an array
const allBooks = Object.entries(books);
const bookKeys = Object.keys(books);

   // Iterate through the 'books' object & check the author matches the one provided
   const booksByTitle = bookKeys
      .filter(key => books[key].title.toLowerCase() === title.toLowerCase())
      .map(key => books[key]);

   console.log(`Books by ${title}:`, booksByTitle);

res.send(booksByTitle);

  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
