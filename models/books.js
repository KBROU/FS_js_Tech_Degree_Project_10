'use strict';
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define('Books', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please Input Title"
        }
      }
    },
    author:{
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please Input Author"
        }
      }
    },
    genre:{
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please Input Genre"
        }
      }
    },
    first_published:{
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Please Input Year First Published"
        }
      }
    }
  }, {
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });
  Books.associate = function(models) {
    // associations can be defined here
    //Books is a source Model and Loans is target model
    //There are two kind of 1:1 relationship in Sequelize, `hasOne` and `belongsTo`. HasOne puts the association key in the target model and BelongTo put the association key in the source model.
    Books.hasOne(models.Loans, {
      foreignKey: 'book_id'
    });
  };
  return Books;
};
