const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: "rujan",
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

  const token = jwt.sign({ user: user.username }, jwtSecret, { expiresIn: '1h' });
  return res.status(200).json({ token });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
