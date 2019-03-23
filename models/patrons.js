'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patrons = sequelize.define('Patrons', {
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please Input First Name"
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please Input Last Name"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please Input Address"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Please Input Email"
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please Input Library ID"
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: "Please Input Only Numbers"
        },
        notEmpty: {
          msg: "Please Input Zip Code"
        }
      }
    }
  }, {
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });
  Patrons.associate = function(models) {
    // associations can be defined here
    Patrons.hasOne(models.Loans, {
      foreignKey: 'patron_id'
    });
  };
  return Patrons;
};
