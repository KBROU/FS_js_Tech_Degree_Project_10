'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  let getToday = (value) => {
    const localDateFormat = (new Date()).toLocaleDateString('sq-AL',
    {year: "numeric", month: "2-digit", day: "2-digit"});

    if(value != localDateFormat) {
      throw new Error ("Today's Date is required" + " " + localDateFormat)
    }
  };
  const Loans = sequelize.define('Loans', {
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Date format is required"
        },
        isToday(value) {
          return getToday(value);
        }
      }
    },
    return_by: {
      type: Sequelize.DATEONLY,
      validate: {
        isDate: {
          msg: "A valid date is required for Return by"
        }
      }
    },
    returned_on:{
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Date format is required"
        },
        isToday(value) {
          return getToday(value);
        }
      }
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });
  Loans.associate = function(models) {
    // associations can be defined here
    Loans.belongsTo(models.Books, {
      foreignKey: 'book_id'
    });
    Loans.belongsTo(models.Patrons, {
      foreignKey: 'patron_id'
    });
  };

  return Loans;
};


//Maybe use instanceMethods to get the date correct
// instanceMethods : { loanedOn: function() { return dateFormat(this.loaned_on, "yyyy-mm-dd"); },
