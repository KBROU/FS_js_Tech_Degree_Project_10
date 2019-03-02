var express = require('express');
var router = express.Router();
const sequelize = require('sequelize');
//Model Variables
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
//Variable for return date
const returnOnDate = (new Date()).toLocaleDateString();
//Sequelize variable to perform operations
const Op = sequelize.Op;
//Variable and function for pagination
let offsetNum = 0;
function offsetResult (pageNumber) {
  if (pageNumber === 1){
    return offsetNum = 0;
  } else {
    return offsetNum = (pageNumber - 1) * 5;
  }
}

/* GET book listings. */
router.get('/index/:page', function(req, res, next) {
  let pageNumber = req.params.page;
  let urlTest = 'index';
  Books.findAll({
  }).then(function(books){
    let bookCount = books.length;
    let pageCount = Math.ceil(bookCount/5);
    offsetResult(pageNumber);
    console.log(offsetNum);
    Books.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      offset: offsetNum
    }).then(function(booksLim){
      res.render("books/index", {urlTest, booksLim, pageCount});
    })
  }).catch(function(error){
      res.send(500, error);
   });
});

/*Post Book Search*/
router.post('/search/:page', function(req, res, next) {
  Books.findAll({
    where: {
      [Op.or]: {
        title: {[Op.like]: `%${req.body.search}%`},
        genre: {[Op.like]: `%${req.body.search}%`},
        author: {[Op.like]: `%${req.body.search}%`},
        first_published: {[Op.like]: `%${req.body.search}%`}
      }
    }
  }).then(function(booksLim){
    res.render("books/index", {booksLim});
  }).catch(function(error){
      res.send(500, error);
    });
});

/* GET Checked Out Book Listings*/
router.get('/checked', function(req, res, next) {
  Books.findAll({
    include:{model: Loans, where: {returned_on: null}}
  }).then(function(books){
    res.render("books/checked", {books});
  }).catch(function(error){
      res.send(500, error);
   });
});

/* GET Overdue Book Listings*/
//Using docs.sequelizejs Scopes querying documentation Op.gt means return_by is less than the current date
router.get('/overdue', function(req, res, next) {
  const currentDate = (new Date()).toLocaleDateString();
  const Op = sequelize.Op;
  Books.findAll({
    include:{
      model: Loans,
      where: {
        returned_on: null,
        return_by: {
          [Op.lt]: currentDate
        }
      }
    }
  }).then(function(books){
    res.render("books/overdue", {books});
  }).catch(function(error){
      res.send(500, error);
   });
});

/* POST create book. */
router.post('/', function(req, res, next) {
  Books.create(req.body).then(function(book) {
    res.redirect("/books/index/1");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("books/new", {article: Books.build(req.body), errors: error.errors, title: "New Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
      console.log(error);
   });
});

/* Create a new book form. */
router.get('/new', function(req, res, next) {
  res.render("books/new", {book: {}, title: "New Book"});
});

/* GET individual book. */
router.get("/:id", function(req, res, next){
  Books.findById(req.params.id)
    .then(function(book){
      Loans.findAll({
        where: {book_id: req.params.id},
        include: [{model: Patrons}]
      })
    .then(function(loans){
        res.render("books/detail", {loans, book});
    })
  }).catch(function(error){
      res.send(500, error);
   });
});

/* PUT update for individual book. */
router.put("/:id", function(req, res, next){
  Books.findById(req.params.id).then(function(book){
    if(book) {
      console.log(book);
      return book.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(book){
    res.redirect("/books/" + book.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("books/", {book, errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

/*GET Returned Book*/
router.get("/:id/return", function(req, res, next){
  //const returnOnDate = (new Date()).toLocaleDateString();
  Loans.findAll({
    where: {id: req.params.id},
    include: [{model: Patrons}, {model: Books}]
  })
    .then(function(loans){
        res.render("books/return", {
          loans, returnOnDate
        });
  }).catch(function(error){
      res.send(500, error);
    });
});

/* PUT update returned_on entry. */
router.put("/:id/return", function(req, res, next){
  Loans.findById(req.params.id).then(function(loan){
    if(loan) {
      return loan.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(loan){
    res.redirect("/loans");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        Loans.findAll({
          where: {id: req.params.id},
          include: [{model: Patrons}, {model: Books}]
        })
          .then(function(loans){
              res.render("books/return", {
                loans, returnOnDate, errors: error.errors
              });
          })
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

module.exports = router;
