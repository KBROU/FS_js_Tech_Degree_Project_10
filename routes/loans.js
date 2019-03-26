var express = require('express');
var router = express.Router();
const sequelize = require('sequelize');
const moment = require('moment');
//Model variables
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;
//Date Variables to prefill the form
const currentDate = moment().format('YYYY-MM-DD');
const returnDate = moment().add(7, 'days').format('YYYY-MM-DD');

//Sequelize variable to perform operations
const Op = sequelize.Op;

/* GET loans listing. */
router.get('/', function(req, res, next) {
  Loans.findAll({include: [{model: Books}, {model: Patrons}] })
    .then(function(loans){
      res.render("loans/index", { loans });
    })
    .catch(function(error){
      res.send(500, error);
    });
});

/*GET Checked Out Book Loans*/
router.get('/checked', function(req, res, next) {
  Loans.findAll({where: {returned_on: null}, include: [{model: Books}, {model: Patrons}] })
    .then(function(loans){
      res.render("loans/checked", { loans });
    })
    .catch(function(error){
      res.send(500, error);
    });
});

/*GET Overdue Book Loans*/
router.get('/overdue', function(req, res, next) {
  Loans.findAll({
    where: {
      returned_on: null,
      return_by: {
        [Op.lt]: currentDate
      }
    },
    include: [{model: Books}, {model: Patrons}]
  })
    .then(function(loans){
      res.render("loans/overdue", { loans });
    })
    .catch(function(error){
      res.send(500, error);
    });
});

/* POST create loan entry. */
router.post('/', function(req, res, next) {
  Loans.create(req.body).then(function(loan) {
    res.redirect("/loans");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        Books.findAll({
          order: [["createdAt", "DESC"]]
        })
        .then(function(books){
          Patrons.findAll({
            order: [["createdAt", "DESC"]]
          })
          .then(function(patrons){
            res.render("loans/new", {loan: Loans.build(req.body), returnDate, currentDate, books, patrons, title: "New Loan", errors: error.errors});
          })
        })
      } else {
        throw error;
      }
  }).catch(function(error) {
      res.send(500,error);
    });
});



/* Create a new loan form. */
router.get('/new', function(req, res, next) {
  Books.findAll({
    order: [["createdAt", "DESC"]]
  })
  .then(function(books){
    Patrons.findAll({
      order: [["createdAt", "DESC"]]
    })
    .then(function(patrons){
      res.render("loans/new", {loan: {}, returnDate, currentDate, books, patrons, title: "New Loan"});
    })
  }).catch(function(error){
        res.send(500, error);
    });
});

module.exports = router;
