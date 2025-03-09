const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: "rujan",
        password: "12345"
    },
    {
        username: "user1",
        password: "12345"
    }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username == username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    const userExists = isValid(username)
    if(userExists){
       return users.some(user => user.username == username && user.password == password)
    }
    return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body

  if(!isValid(username)){
    return res.status(404).json({message:"User not found. Please register first."})
  }
  if(!authenticatedUser(username,password)){
    return res.status(404).json({message:"Username or password invalid"})  
  }

  const user = users.find(user => { return user.username == username && user.password == password})

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.session['accessToken'] = token; // Set session
    return res.status(200).json({ token });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const { review } = req.query;
    const username = req.user.username;

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added or updated successfully",data:JSON.stringify(books[isbn]) });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const { review } = req.query;
    const username = req.user.username;

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        return res.status(200).json({ message: "Review added or updated successfully",data:JSON.stringify(books[isbn]) });
    }

    // delete the review
    delete books[isbn].reviews[username]
    return res.status(200).json({ message: "Review added or updated successfully",data:JSON.stringify(books[isbn]) });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
