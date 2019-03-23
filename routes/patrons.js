var express = require('express');
var router = express.Router();
const sequelize = require('sequelize');
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;
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

/* GET patrons list. */
router.get('/index/:page', function(req, res, next) {
  let pageNumber = req.params.page;
  let urlTest = 'index';
  Patrons.findAll({
  }).then(function(patrons){
    let patronCount = patrons.length;
    let pageCount = Math.ceil(patronCount/5);
    offsetResult(pageNumber);
    Patrons.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      offset: offsetNum
    }).then(function(patronsLim){
      res.render("patrons/index", {urlTest, patronsLim, pageCount});
    })
  }).catch(function(error){
      res.send(500, error);
   });
});

/*Post Patron Search*/
router.post('/search/:page', function(req, res, next) {
  Patrons.findAll({
    where: {
      [Op.or]: {
        first_name: {[Op.like]: `%${req.body.search}%`},
        last_name: {[Op.like]: `%${req.body.search}%`},
        address: {[Op.like]: `%${req.body.search}%`},
        email: {[Op.like]: `%${req.body.search}%`},
        library_id: {[Op.like]: `%${req.body.search}%`},
        zip_code: {[Op.like]: `%${req.body.search}%`}
      }
    }
  }).then(function(patronsLim){
    res.render("patrons/index", {patronsLim});
  }).catch(function(error){
      res.send(500, error);
    });
});

/* POST create patron entry. */
router.post('/', function(req, res, next) {
  Patrons.create(req.body).then(function(patron) {
    res.redirect("/patrons/index/1");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("patrons/new", {patron: Patrons.build(req.body), errors: error.errors, title: "New Patron"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.status(500).send(error);
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
    res.redirect("/patrons/index/1");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        Patrons.findById(req.params.id)
          .then(function(patron){
            Loans.findAll({
              where: {patron_id: req.params.id},
              include: [{model: Books}]
            })
            .then(function(loans){
              res.render("patrons/detail", {
                patron, loans, title: patron.title, errors: error.errors
              });
            })
        })
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});


module.exports = router;
