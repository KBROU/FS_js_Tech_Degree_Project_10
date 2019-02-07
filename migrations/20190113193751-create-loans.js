'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      book_id: {
        type: Sequelize.INTEGER,
        // not sure if references are needed
        // references: {
        //   model: 'Books',
        //   key: 'id',
        // },
      },
      patron_id: {
        type: Sequelize.INTEGER
      },
      loaned_on: {
        type: Sequelize.DATE
      },
      return_by: {
        type: Sequelize.DATE
      },
      returned_on: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Loans');
  }
};
