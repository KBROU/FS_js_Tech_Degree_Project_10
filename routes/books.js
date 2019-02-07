var express = require('express');
var router = express.Router();
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
/* GET books listing. */

router.get('/', function(req, res, next) {
  Books.findAll({order: [["createdAt", "DESC"]]}).then(function(books){
    res.render("books/index", {books: books});
  }).catch(function(error){
      res.send(500, error);
   });
});

/* POST create book. */
router.post('/', function(req, res, next) {
  Books.create(req.body).then(function(book) {
    res.redirect("/books");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("books/new", {article: Books.build(req.body), errors: error.errors, title: "New Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* Create a new book form. */
router.get('/new', function(req, res, next) {
  res.render("books/new", {book: {}, title: "New Book"});
});

/* GET individual book. */
router.get("/:id", function(req, res, next){
  Books.findById(req.params.id).then(function(book){
    if(book) {
      res.render("books/detail", {book: book, title: book.title});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});

router.get("/:id/return", function(req, res, next){
  const returnOnDate = (new Date()).toLocaleDateString();
  Books.findById(req.params.id)
    .then(function(book){
      Loans.findAll({
        where: {book_id: req.params.id},
        include: [{model: Patrons}]
      })
      .then(function(loans){
        res.render("books/return", {
          book, loans, returnOnDate, title: book.title
        });
      })
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
    res.redirect("/loans/");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        var article = Loans.build(req.body);
        loan.id = req.params.id;
        res.render("loans/", {loan, errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* POST create returned_on entry. */
// router.post('/:id/return', function(req, res, next) {
//   Loans.update(req.body).then(function() {
//     res.redirect("/loans");
//   }).catch(function(error){
//       if(error.name === "SequelizeValidationError") {
//         res.render("loans/", {article: Loans.build(req.body), errors: error.errors, title: "New Loan"})
//       } else {
//         throw error;
//       }
//   }).catch(function(error){
//       res.send(500, error);
//    });
// });

module.exports = router;

// router.get('/', function(req, res, next) {
//   Loans.findAll({include: [{model: Books}, {model: Patrons}] })
//     .then(function(loans){
//       res.render("loans/index", { loans });
//     })
//     .catch(function(error){
//       res.send(500, error);
//     });
// });
//
// router.get("/:id", function(req, res, next){
//   Patrons.findById(req.params.id)
//     .then(function(patron){
//       Loans.findAll({
//         where: {patron_id: req.params.id},
//         include: [{model: Books}]
//       })
//       .then(function(loans){
//         res.render("patrons/detail", {
//           patron, loans, title: patron.title
//         });
//       })
//   }).catch(function(error){
//       res.send(500, error);
//     });
// });

/* Working code
var express = require('express');
var router = express.Router();
const Books = require('../models').Books;

 //GET books listing.

// router.get('/', function(req, res, next) {
//   res.render('books');
// });


module.exports = router;

 GET return book.
router.get("/:id/return", function(req, res, next){
  Books.findById(req.params.id).then(function(book){
    if(book) {
      res.render("books/return", {book: book, title: book.title});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});

*/
