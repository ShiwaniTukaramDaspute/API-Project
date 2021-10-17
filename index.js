require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{



}
).then(() => console.log("Connection Established"));



/*GET*/
/* BOOKS */
/* To get all books:
Route            /
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/",async (req,res) => {
 const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});



/* To get specific books:
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn",async (req,res) => {

const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

//null !0 = 1 , !1=0
  if(!getSpecificBook) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
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
booky.get("/c/:category", async (req,res) => {
  const getSpecificBook = await BookModel.findOne({category: req.params.category});

  //null !0 = 1 , !1=0
    if(!getSpecificBook) {
      return res.json({error: `No book found for the category of ${req.params.category}`});
    }

    return res.json({book: getSpecificBook});
});



/* To get a list of books based on languages:
Route            /l
Description      Get specific book on language
Access           PUBLIC
Parameter        language
Methods          GET
*/
booky.get("/l/:language", async (req,res) => {
  const getSpecificBook = await BookModel.findOne({language: req.params.language});

  //null !0 = 1 , !1=0
    if(!getSpecificBook) {
      return res.json({error: `No book found for the language of ${req.params.language}`});
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
booky.get("/author", async (req,res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});


/* HW-DONE-To get specific author:
Route            /author
Description      Get specific author on ID
Access           PUBLIC
Parameter        id
Methods          GET
*/
booky.get("/author/:_id",async (req,res) => {


const getSpecificBook = await BookModel.findOne({ID: req.params.id});
  //null !0 = 1 , !1=0
    if(getSpecificBook) {
      return res.json({error: `No book found for the ID of ${req.params.id}`});
    }

    return res.json({book: getSpecificBook});
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
booky.get("/publications",async (req,res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
})


/* HW-DONE-To get specific publication:
Route            /publication
Description      Get specific publication on ID
Access           PUBLIC
Parameter        id
Methods          GET
*/
booky.get("/publication/:_id",async (req,res) => {
  const getSpecificBook = await BookModel.findOne({ID: req.params.id});
  //null !0 = 1 , !1=0
    if(getSpecificBook) {
      return res.json({error: `No publication found for the ID of ${req.params.id}`});
    }

    return res.json({book: getSpecificBook});
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


/*POST with POATMAN*/
/* Add new book:
Route            /book/new
Description      Add new books
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/book/new",async (req,res) => {
  const { newBook } = req.body;
  const addNewBook = await BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message: "Book was added !!!"
  });
});



/* Add new author:
Route            /author/new
Description      Add new authors
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/author/new",async (req,res) => {
const { newAuthor } = req.body;
const addNewAuthor = await AuthorModel.create(newAuthor);
  return res.json(
    {
      author: addNewAuthor,
      message: "Author was added!!!"
    }
  );
});


/* Add new publication:
Route            /publication/new
Description      Add new publications
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/publication/new",async (req,res) => {
const { newPublication } = req.body;
const addNewPublication = await PublicationModel.create(newPublication);

return res.json(
  {
    publication: addNewpublication,
    message: "Publication was added!!!"
  }
);
});


/*
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





/* HW-DONE-Delete author from book:
Route            /author/delete
Description      Delete author from book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/
booky.delete("/author/delete/:authorId", (req,res) => {


  const updatedBookDatabase = database.books.filter(
    (book) => book.ID !== req.params.id
  )
  database.books = updatedBookDatabase;
  return res.json({books: database.books});
});


/* Delete author from book & related book from author:
Route            /book/delete/author
Description      Delete an author from a book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book database
   database.books.forEach((book)=>{
     if(book.ISBN === req.params.isbn) {
       const newAuthorList = book.author.filter(
         (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
       );
       book.author = newAuthorList;
       return;
     }
   });


  //Update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!!"
  });
});

/*   MONGO_DB:  */
//Created Modals for author, book and publication
/* UPDATING AND DELETING:
Route            /book/update
Description      Update book on isbn
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/
booky.put("/book/update/:isbn",async (req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({
    books: updatedBook
  });
});


/*********Updating new author**********/
/*
Route            /book/author/update
Description      Update /add new author
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/
booky.put("/book/author/update/:isbn", async(req,res) =>{
  //Update book database
const updatedBook = await BookModel.findOneAndUpdate(
  {
    ISBN: req.params.isbn
  },
  {
    $addToSet: {
      authors: req.body.newAuthor
    }
  },
  {
    new: true
  }
);

  //Update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet: {
        books: req.params.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json(
    {
      bookss: updatedBook,
      authors: updatedAuthor,
      message: "New author was added"
    }
  );
} );



/****DELETE*****/
/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

booky.delete("/book/delete/:isbn", async (req,res) => {
  //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
  //and rest will be filtered out

  const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );

  return res.json({
    books: updatedBookDatabase
  });
});




booky.listen(3000,() => {
  console.log("Server is up and running");
});
