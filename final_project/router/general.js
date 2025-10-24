// Task 10: Get all books (Async/Await)
// [cite: 115]
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

// Task 11: Get book details based on ISBN (Async/Await)
// [cite: 120]
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

// Task 12: Get book details based on author (Async/Await)
// [cite: 125]
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

// Task 13: Get book details based on title (Async/Await)
// [cite: 130]
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
