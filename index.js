const express = require("express");
var bodyParser = require("body-parser");

//Database
const database = require("./database");

//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());


/*GET*/
/* BOOKS */
/* To get all books:
Route            /
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/",(req,res) => {
  return res.json({books: database.books});
});


/* To get specific books:
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn", (req,res) => {

const getSpecificBook = database.books.filter(
  (book) => book.ISBN === req.params.isbn
);

  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
  }

  return res.json({book: getSpecificBook});
});


/* To get a list of books based on category:
Route            /c
Description      Get specific book on category
Access           PUBLIC
Parameter        category
Methods          GET
*/
booky.get("/c/:category", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  )

    if(getSpecificBook.length === 0) {
      return res.json({error: `No book found for the category of ${req.params.category}`})
    }

    return res.json({book: getSpecificBook});
});


/* HW-To get a list of books based on languages:
Route            /l
Description      Get specific book on language
Access           PUBLIC
Parameter        language
Methods          GET
*/
booky.get("/l/:language", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language.includes(req.params.language)
  )

    if(getSpecificBook.length === 0) {
      return res.json({error: `No book found for the language of ${req.params.language}`})
    }

    return res.json({book: getSpecificBook});
});


/* AUTHORS */
/* To get all authors:
Route            /author
Description      Get all authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/author",(req,res) => {
  return res.json({books: database.author});
});


/* HW-NOT DONE-To get specific author:
Route            /is/author
Description      Get specific author on ID
Access           PUBLIC
Parameter        id
Methods          GET
*/
booky.get("/is/author/:id", (req,res) => {

const getSpecificAuthor = database.author.filter(
  (author) => author.ID === req.params.id
);

  if(getSpecificAuthor.length === 0) {
    return res.json({error: `No author found for the ID of ${req.params.id}`})
  }

  return res.json({author: getSpecificAuthor});
});


/* To get a list of authors based on books:
Route            /author/book
Description      Get all authors based on books
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/author/book/:isbn", (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.length === 0){
    return res.json({error: `No author found for the book of ${req.params.isbn}`
    });
  }
  return res.json({authors: getSpecificAuthor});
});

/* PUBLICATION */
/* To get all the publications:
Route            /publications
Description      Get all publications
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/publications", (req,res) => {
  return res.json({publications: database.publication});
});


/* HW-NOT DONE-To get specific publication:
Route            /is/publication
Description      Get specific publication on ID
Access           PUBLIC
Parameter        id
Methods          GET
*/
booky.get("/is/publication/:id", (req,res) => {

const getSpecificPublication = database.publication.filter(
  (publication) => publication.ID === req.params.id
);

  if(getSpecificPublication.length === 0) {
    return res.json({error: `No publication found for the ID of ${req.params.id}`})
  }

  return res.json({publication: getSpecificPublication});
});


/* To get a list of publications based on books:
Route            /publication/book
Description      Get all authors based on books
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/publication/book/:isbn", (req,res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.books.includes(req.params.isbn)
  );

  if(getSpecificPublication.length === 0){
    return res.json({error: `No publication found for the book of ${req.params.isbn}`
    });
  }
  return res.json({publication: getSpecificPublication});
});



/*POST*/
/* Add new book:
Route            /book/new
Description      Add new books
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/book/new", (req,res) => {
const newBook = req.body;
database.books.push(newBook);
  return res.json({updatedBooks: database.books});
});


/* Add new author:
Route            /author/new
Description      Add new authors
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/author/new", (req,res) => {
const newAuthor = req.body;
database.author.push(newAuthor);
  return res.json(database.author);
});


/* Add new publication:
Route            /publication/new
Description      Add new publications
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/publication/new", (req,res) => {
const newPublication = req.body;
database.publication.push(newPublication);
  return res.json(database.publication);
});



/*PUT*/
/* Update book details if author is changed:
Route            /publication/update/book
Description      Update and add new publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/
booky.put("/publication/update/book/:isbn", (req,res) => {
  //Update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Successfully updated publications"
    }
  );
});



/*DELETE*/
/* Delete a book:
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/
booky.delete("/book/delete/:isbn", (req,res) => {
  //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
  //and rest will be filtered out

  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  )
  database.books = updatedBookDatabase;
  return res.json({books: database.books});
});


/* HW-NOT DONE-Delete author from book:
Route            /author/delete
Description      Delete author from book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/


/* Delete author from book & related book from author:
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

booky.listen(3000,() => {
  console.log("Server is up and running");
});
