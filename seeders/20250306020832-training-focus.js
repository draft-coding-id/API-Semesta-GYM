'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('training_focus', [
      {
        name: 'DADA',
        picture: 'images/dada.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'TRICEPS',
        picture: 'images/triceps.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'WINGS',
        picture: 'images/wings.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'BICEPS',
        picture: 'images/biceps.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'SHOULDER',
        picture: 'images/shoulder.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'LEG',
        picture: 'images/leg.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('training_focus', null, {});
  }
};
