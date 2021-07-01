require("dotenv").config();
const express = require("express");
const mongoose=require("mongoose");

// Database
const database = require("./database1.js/database.js");
// Models
const BookModel = require("./database1.js/books");
const AuthorModel = require("./database1.js/author");
const PublicationModel = require("./database1.js/publication");


// Initialization
const booky = express();

// configuration
booky.use(express.json());

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true})
  .then(()=>console.log("connection established!!!"));

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/", async(req, res) => {
  const getAllBooks = await BookModel.find()
  return res.json({ getAllBooks });
});

/*
Route           /is
Description     Get specific books based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/is/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route           /c
Description     Get specific books based on category
Access          PUBLIC
Parameter       category
Methods         GET
*/
booky.get("/c/:category", (req, res) => {
  const getSpecificBook = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ book: getSpecificBook });
});
/*
Route           /lang
Description     Get list of books based on languages
Access          PUBLIC
Parameter       language
Methods         GET
*/
booky.get("/lang/:language", (req, res) => {
  const getLanguageBook = database.books.filter((book) =>
    book.language.includes(req.params.language)
  );

  if (getLanguageBook.length === 0) {
    return res.json({
      error: `No book found for the language of ${req.params.language}`,
    });
  }

  return res.json({ book: getLanguageBook });
});






/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/author", (req, res) => {
  return res.json({ authors: database.author });
});

/*
Route           /author/specific
Description     get specific authors
Access          PUBLIC
Parameter       name
Methods         GET
*/
booky.get("/author/specific/:names", (req,res)=>{
  const SpecificAuthor= database.author.filter((author)=>
 author.name === req.params.names );
 if (SpecificAuthor.length === 0) {
  return res.json({
    error: `No author found for the name of ${req.params.names}`,
  });
 }

return res.json({ book: SpecificAuthor });
});


/*
Route           /author/book
Description     get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/author/book/:isbn", (req, res) => {
  const getSpecificAuthor = database.author.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No Author found for the book of ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthor });
});

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/publications", (req, res) => {
  return res.json({ publications: database.publication });
});

/*
Route           /publications/specific
Description     get specific publications
Access          PUBLIC
Parameter       name
Methods         GET
*/
booky.get("/publications/specific/:name",(req,res)=>{
  const getSpecificPublication = database.publication.filter((pub)=>
  pub.name===req.params.name);
  if(getSpecificPublication.length==0){
    return res.json({
      error: `No Publication found for the book of ${req.params.name}`,
    });
  }
  return res.json({publications: getSpecificPublication});
});
/*
Route           /publications/books
Description     get  publication based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

booky.get("/publication/books/:isbn",(req,res)=>{
  const getBookPub= database.publication.filter((pub)=>
  pub.books.includes(req.params.isbn));
  if(getBookPub.length===0){
    return res.json({error: `No list of Publication found for the book of ${req.params.isbn}`,})
  }
  return res.json({publications: getBookPub});
});




/*
Route           /book/add
Description     add new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/book/add", (req, res) => {
  const { newBook } = req.body;
  database.books.push(newBook);
  return res.json({ books: database.books });
});

/*
Route           /author/add
Description     add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/author/add", (req, res) => {
  const { newAuthor } = req.body;
  database.author.push(newAuthor);
  return res.json({ authors: database.author });
});

/*
Route           /pub/add
Description     add new publication
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/pub/add", (req, res) => {
  const { newPub } = req.body;
  database.publication.push(newPub);
  return res.json({ publication: database.publication });
});



/*
Route           /book/update/title
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/title/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.newBookTitle;
      return;
    }
  });

  return res.json({ books: database.books });
});

/*
Route           /book/update/author
Description     update/add new author for a book
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
  // update book database

  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.author.push(parseInt(req.params.authorId));
    }
  });

  // update author database

  database.author.forEach((author) => {
    if (author.id === parseInt(req.params.authorId))
      return author.books.push(req.params.isbn);
  });

  return res.json({ books: database.books, author: database.author });
});

booky.listen(3000, () => console.log("HEy server is running! 😎"));

// HTTP client -> helper who helps you to make http request