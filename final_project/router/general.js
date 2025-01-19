const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
 if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    // check if username already exists
    if (users[req.body.username]) {
        return res.status(400).json({message: "Username already exists"});
    }
    // register new user
    users[req.body.username] = {
         
        password: req.body.password
    };
    return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//     res.send(JSON.stringify(books,null,4));
//     return res.status(300).json({message: "Yet to be implemented"});
// });

//Async-Await function get "/"
public_users.get('/', async function (req, res){
    try{
        const data = await new Promise((resolve) => {
            resolve(books);
        });
        res.send(JSON.stringify(data, null, 4));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
  
//     const details  = req.params.isbn;
//     res.send(books[details])
// });

//Async-Await function get "/isbn/:isbn"
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    new Promise ((resolve) => {
        resolve(books[isbn]);
    })
    .then((data)=>{
        res.send(JSON.stringify(data, null, 4));
    })
    .catch((error) =>{
        res.status(400).json({ message: error.message });
    })

})
  
// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     let author = req.params.author;
//     let booksByAuthor = [];
//     let bookKeys = Object.keys(books);
//     for (let i = 0; i < bookKeys.length; i++) {
//         let book = books[bookKeys[i]];
//         if (book.author === author) {
//             booksByAuthor.push(book);
//         }
//     }
//     res.send(booksByAuthor);
// });

//Async-Await function get "/author/:author"
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    new Promise((resolve) => {
        let booksByAuthor =[];
        let bookKeys = Object.keys(books);

        for(let i = 0; i < bookKeys.length; i++){
            let book = books[bookKeys[i]];
            if(book.author === author){
                booksByAuthor.push(book);
            }
        }
        resolve(booksByAuthor);
    })

    .then((data) => {
        res.send(json.stringify(data));
    })
    .catch((error)=> {
        res.status(500).json({ message: error.message });
    }) 
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//  let title = req.params.title;
//     let booksByTitle = [];
//     let bookKeys = Object.keys(books);
//     for (let i = 0; i < bookKeys.length; i++) {
//         let book = books[bookKeys[i]];
//         if (book.title === title) {
//             booksByTitle.push(book);
//         }
//     }
//     res.send(booksByTitle);
// });

//Async Await function get '/title/:title'
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const data = await new Promise((resolve) => {
            let booksByTitle = [];
            let bookKeys = Object.keys(books);
            for (let i = 0; i < bookKeys.length; i++) {
                let book = books[bookKeys[i]];
                if (book.title === title) {
                    booksByTitle.push(book);
                }
            }
            resolve(booksByTitle);
        });
        res.send(JSON.stringify(data, null, 4));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const details  = req.params.isbn;
    res.send(books[details].reviews)
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
