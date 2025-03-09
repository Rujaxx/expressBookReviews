const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username,password } = req.body;
  if(!username){
    return res.status(422).json({message: "Username is required"})
  }
  if(!password){
    return res.status(422).json({message: "Password is required"})
  }
  if(!isValid){
    return res.status(409).json({message: "User already exists. Try new username."})
  }
  users.push({username,password})
  return res.status(201).json({message: "User added successfully",data:{username}});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({message: "Books Fetched.",data:JSON.stringify(books)});
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const book = books[isbn] ?? null
    if(!book){
        return res.status(404).json({message:"Book not found."})
    }
    return res.status(200).json({message: "Books Fetched.",data:JSON.stringify(book)});
 });
  
const getBookDetails = (field,value) => {
  const booksArr = Object.values(books)
  return booksArr.filter(book => book[field] == value)  
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const bookList = getBookDetails("author",req.params.author)
  return res.status(200).json({message: "Books" , data : JSON.stringify(bookList)});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookList = getBookDetails("title",req.params.title)
    return res.status(200).json({message: "Books" , data : JSON.stringify(bookList)});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(200).json({message:"Reviews",data:JSON.stringify(books[req.params.isbn].reviews)})
});

module.exports.general = public_users;
