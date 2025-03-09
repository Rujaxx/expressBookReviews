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

const getAllBooks = async() => {
    return Object.values(books)
}
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    const allBooks = await getAllBooks()
  return res.status(200).json({message: "Books Fetched.",data:JSON.stringify(allBooks)});
})

const getBook = async(isbn) => {
    return books[isbn]  
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn
    const book = await getBook(isbn) ?? null
    if(!book){
        return res.status(404).json({message:"Book not found."})
    }
    return res.status(200).json({message: "Books Fetched.",data:JSON.stringify(book)});
 });
  
const getBookDetails = async(field,value) => {
  const booksArr = Object.values(books)
  return booksArr.filter(book => book[field] == value)  
}
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const bookList = await getBookDetails("author",req.params.author)
  return res.status(200).json({message: "Books" , data : JSON.stringify(bookList)});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const bookList = await getBookDetails("title",req.params.title)
    return res.status(200).json({message: "Books" , data : JSON.stringify(bookList)});
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
    const reviews = await getBook(req.params.isbn)?.reviews
    if(!reviews){
        return res.status(404)._construct({message:"Book not found"})
    }
    return res.status(200).json({message:"Reviews",data:JSON.stringify(reviews)})
});

module.exports.general = public_users;
