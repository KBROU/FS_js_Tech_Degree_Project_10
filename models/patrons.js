'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patrons = sequelize.define('Patrons', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address : DataTypes.STRING,
    email : DataTypes.STRING,
    library_id : DataTypes.STRING,
    zip_code : DataTypes.INTEGER
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
