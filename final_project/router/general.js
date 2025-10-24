const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.get('/', async function (req, res) {
    try {
        const allBooks = await new Promise((resolve, reject) => {
            resolve(books);
        });
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});


public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});


public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const matchingBooks = await new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            let foundBooks = [];
            bookKeys.forEach((key) => {
                if (books[key].author === author) {
                    foundBooks.push({
                        "isbn": key,
                        "title": books[key].title,
                        "reviews": books[key].reviews
                    });
                }
            });

            if (foundBooks.length > 0) {
                resolve(foundBooks);
            } else {
                reject("No books found by this author");
            }
        });
        return res.status(200).json(matchingBooks);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});


public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const matchingBooks = await new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            let foundBooks = [];
            bookKeys.forEach((key) => {
                if (books[key].title === title) {
                    foundBooks.push({
                        "isbn": key,
                        "author": books[key].author,
                        "reviews": books[key].reviews
                    });
                }
            });

            if (foundBooks.length > 0) {
                resolve(foundBooks);
            } else {
                reject("No books found with this title");
            }
        });
        return res.status(200).json(matchingBooks);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});




public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) { // Use the helper function
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
        return res.status(409).json({ message: "Username already exists" });
    }
});