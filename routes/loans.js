var express = require('express');
var router = express.Router();
const sequelize = require('sequelize');
//var books = require('../routes/books');
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;

/* GET loans listing. */

// router.get('/', function(req, res, next) {
//   res.render('loans/index');
// });

router.get('/', function(req, res, next) {
  Loans.findAll({include: [{model: Books}, {model: Patrons}] })
    .then(function(loans){
      res.render("loans/index", { loans });
    })
    .catch(function(error){
      res.send(500, error);
    });
});

/* POST create loan entry. */
router.post('/', function(req, res, next) {
  Loans.create(req.body).then(function() {
    res.redirect("/loans");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("loans/", {article: Loans.build(req.body), errors: error.errors, title: "New Loan"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});



/* Create a new loan form. */
router.get('/new', function(req, res, next) {
  const returnDate = new Date(new Date().getTime() + 604800000).toLocaleDateString();
  const loanDate = (new Date()).toLocaleDateString();
  Books.findAll({
    order: [["createdAt", "DESC"]]
  })
  .then(function(books){
    Patrons.findAll({
      order: [["createdAt", "DESC"]]
    })
    .then(function(patrons){
      res.render("loans/new", {loan: {}, returnDate, loanDate, books, patrons, title: "New Loan"});
    })
  }).catch(function(error){
        res.send(500, error);
    });
});


//
//
// /* GET return book. */
// router.get("/:id/return", function(req, res, next){
//   Loans.findById(req.params.id).then(function(book){
//     if(book) {
//       res.render("books/return", {book: book, title: book.title});
//     } else {
//       res.send(404);
//     }
//   }).catch(function(error){
//       res.send(500, error);
//    });
// });

module.exports = router;
