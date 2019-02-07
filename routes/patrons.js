var express = require('express');
var router = express.Router();
const sequelize = require('sequelize');
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;


/* GET patrons list. */
router.get('/', function(req, res, next) {
  Patrons.findAll({order: [["createdAt", "DESC"]]})
    .then(function(patrons){
      res.render("patrons/index", { patrons });
    })
    .catch(function(error){
      res.send(500, error);
    });
});

/* POST create patron entry. */
router.post('/', function(req, res, next) {
  Patrons.create(req.body).then(function() {
    res.redirect("/patrons");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("patrons/", {article: Patrons.build(req.body), errors: error.errors, title: "New Patron"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* Create a new patron form. */
router.get('/new', function(req, res, next) {
  res.render("patrons/new", {patron: {}, title: "New Patron"});
});

/* GET individual patron. */
router.get("/:id", function(req, res, next){
  Patrons.findById(req.params.id)
    .then(function(patron){
      Loans.findAll({
        where: {patron_id: req.params.id},
        include: [{model: Books}]
      })
      .then(function(loans){
        res.render("patrons/detail", {
          patron, loans, title: patron.title
        });
      })
  }).catch(function(error){
      res.send(500, error);
    });
});

/* PUT update patron. */
router.put("/:id", function(req, res, next){
  Patrons.findById(req.params.id).then(function(patron){
    if(patron) {
      return patron.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(patron){
    res.redirect("/patrons/" + patron.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        var article = Patrons.build(req.body);
        patron.id = req.params.id;
        res.render("patron/:id", {patron, errors: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

module.exports = router;
