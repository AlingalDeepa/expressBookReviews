const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
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
      }, 'access', { expiresIn: 60 });
  
      req.session.authorization = {
        accessToken,username
    }
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

if (book.reviews[username]) {
 
  book.reviews[username] = review;
  res.json({ message: 'Review modified successfully.' });
} else {
  
   book.reviews.push({ username:username, review });
   res.json({ message: 'Review added successfully.' });
}

res.send("Isbn: "+ isbn + " review " + books[isbn]);

return res.status(300).json({message: "Yet to be implemented"});
});


// Add a book review
regd_users.put("/auth/delete/:isbn", (req, res) => {

  const username = req.body.username;
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  const book = books[isbn];


  //book.reviews = book.reviews.filter((existingReview) => existingReview.username !== username);
  const indexToRemove = book.reviews.findIndex(existingReview => existingReview.username === username);

if (indexToRemove !== -1) {
  book.reviews.splice(indexToRemove, 1);
}

  res.json({ message: 'Review deleted successfully.' });
});
 

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
