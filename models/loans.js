'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Loans = sequelize.define('Loans', {
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: {
      type: DataTypes.DATEONLY,
      get: function() {
         return dateFormat(this.loaned_on, "yyyy-mm-dd");
      },
      validate: {
        notEmpty: {
          msg: "Today's Date is required"
        }
      }
    },
    return_by: {
      type: Sequelize.DATEONLY,
      validate: {
        notEmpty: {
          msg: "Date seven days from today is required"
        }
      }
    },
    returned_on: DataTypes.DATE
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });
  Loans.associate = function(models) {
    // associations can be defined here
    //Loans belongTo might not be needed because the association is happening in the books model.
    Loans.belongsTo(models.Books, {
      foreignKey: 'book_id'
    });
    Loans.belongsTo(models.Patrons, {
      foreignKey: 'patron_id'
    });
  };
//new format in sequelize v4 for instance methods
  Loans.prototype.loanedOn = function() {
     return dateFormat(this.loaned_on, "yyyy-mm-dd");
  };

  return Loans;
};


//Maybe use instanceMethods to get the date correct
// instanceMethods : { loanedOn: function() { return dateFormat(this.loaned_on, "yyyy-mm-dd"); },
