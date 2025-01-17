const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  
});



// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//  res.send(JSON.stringify(books,null,4));
// });

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const booksAsync = await getBooks();
  
      res.send(JSON.stringify(booksAsync, null, 4));
    } catch (error) {
     
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  function getBooks() {
    return new Promise((resolve, reject) => {
     
      setTimeout(() => {
        resolve(books);
      }, 2000);
    });
  }
  
    

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   res.send(JSON.stringify(books[isbn],null,4));
 
//  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const book = await getBooksByISBN(isbn);
      
      res.send(JSON.stringify(book, null, 4));
    } catch (error) {
     
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  function getBooksByISBN(isbn) {
    return new Promise((resolve, reject) => {
     
      setTimeout(() => {
        resolve(books[isbn]);
      }, 2000);
    });
  }


  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author;
//     // Filter books by author
//     console.log("Output: ", author);

//     const allBooks = Object.entries(books);
//     const bookKeys = Object.keys(books);
//     const booksByAuthor = bookKeys
//         .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
//         .map(key => books[key]);

//     console.log(`Books by ${author}:`, booksByAuthor);

//     res.send(booksByAuthor);
// });

// Get book details based on author

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    // Filter books by author
    console.log("Output: ", author);

    const book = await getBooksByAuthor(author);
    res.send(book);
});

function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
     
      setTimeout(() => {

        const allBooks = Object.entries(books);
        const bookKeys = Object.keys(books);
        const booksByAuthor = bookKeys
            .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
        .map(key => books[key]);

        console.log(`Books by ${author}:`, booksByAuthor);


        resolve(booksByAuthor);
      }, 2000);
    });
  }

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
// const title = req.params.title;
// const allBooks = Object.entries(books);
// const bookKeys = Object.keys(books);
//    const booksByTitle = bookKeys
//       .filter(key => books[key].title.toLowerCase() === title.toLowerCase())
//       .map(key => books[key]);

//    console.log(`Books by ${title}:`, booksByTitle);
// res.send(booksByTitle);

  
// });

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    //Write your code here
  const title = req.params.title;
  const book = await getBooksByTitle(title);
  res.send(book);
  
  });

  function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
     
      setTimeout(() => {

        const allBooks = Object.entries(books);
        const bookKeys = Object.keys(books);
        const booksByTitle = bookKeys
        .filter(key => books[key].title.toLowerCase() === title.toLowerCase())
        .map(key => books[key]);
  
        console.log(`Books by ${title}:`, booksByTitle);
  
        resolve(booksByTitle);
      }, 2000);
    });
  }


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;
  let book = books[isbn];
  const reviews = Object.values(book.reviews);
  res.send(reviews);

});

module.exports.general = public_users;
