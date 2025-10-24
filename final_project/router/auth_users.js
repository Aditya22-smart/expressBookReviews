const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0; // True if user is found and password matches
}

//only registered users can login
regd_users.post("/login", (req,res) => {
const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in: Missing username or password" });
    }

    if (authenticatedUser(username, password)) {
        // Create a JWT
        let accessToken = jwt.sign({
            data: password, // You can store username here as well
            username: username
        }, 'access', { expiresIn: 60 * 60 }); // 'access' is the secret key, expires in 1 hour

        // Save token in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
const isbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.authorization.username; // Get username from session

    if (!reviewText) {
        return res.status(400).json({ message: "Review text is required" });
    }

    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = reviewText; // Add or update the review
        
        books[isbn] = book; // Update the books object
        return res.status(200).json({ message: `Review for book with ISBN ${isbn} added/updated successfully.` });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Get username from session

    if (books[isbn]) {
        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username]; // Delete the user's review
            return res.status(200).json({ message: `Review for book with ISBN ${isbn} by user ${username} deleted.` });
        } else {
            return res.status(404).json({ message: "Review not found for this user" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
