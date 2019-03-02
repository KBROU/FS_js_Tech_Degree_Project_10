'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Books', [{
        title: "Harry Potter and the Philosopher's Stone",
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        first_published: 1997,
      },
      {
        title: "Harry Potter and the Chamber of Secrets",
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        first_published: 1998,
      },
      {
        title: "Harry Potter and the Prisoner of Azkaban",
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        first_published: 1999,
      },
      {
        title: "Harry Potter and the Goblet of Fire",
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        first_published: 2000,
      },
      {
        title: "Harry Potter and the Order of the Phoenix",
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        first_published: 2003,
      },
      {
        title: "Harry Potter and the Half-Blood Prince",
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        first_published: 2005,
      }
      ], {
        timestamps: false,
        createdAt: false,
        updatedAt: false
      });

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Books', null, {});

  }
};
