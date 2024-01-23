const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 

let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    };

    console.log('Session:', req.session); // Log the entire session object
console.log('Authorization:', req.session.authorization); // Log the authorization object
console.log('Username:', req.session.authorization.username); // Log the username


    
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 
const { username, review } = req.body;
const isbn = req.params.isbn;

// Check if the book with the given ISBN exists
if (!books[isbn]) {
  return res.status(404).json({ error: 'Book not found.' });
}

const book = books[isbn];
const existingReview = book.reviews.find(existingReview => existingReview.username === username);

if (existingReview) {
    // Modify the existing review
    existingReview.review = review;
    res.json({ message: 'Review modified successfully.' });
  } else {
    // Add a new review
    book.reviews.push({ username, review });
    res.json({ message: 'Review added successfully.' });
  }

});


// Add a book review
regd_users.delete("/auth/delete/:isbn", (req, res) => {

console.log('Session:', req.session); // Log the entire session object
console.log('Authorization:', req.session.authorization); // Log the authorization object
console.log('Username:', req.session.authorization.username); // Log the username


  const username = req.session.authorization.username;
  
  const isbn = req.params.isbn;
  console.log('ISBN:', isbn);


  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  const book = books[isbn];

  console.log('Username:', username);
  console.log('Book Reviews:', book.reviews);

  const indexToRemove = book.reviews.findIndex(existingReview => existingReview.username === username);

if (indexToRemove !== -1) {
  book.reviews.splice(indexToRemove, 1);
  console.log('Index to Remove:', indexToRemove);
  return res.json({ message: 'Review deleted successfully.' });
}

  return res.json({ message: 'Review not found!' });
});
 
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
