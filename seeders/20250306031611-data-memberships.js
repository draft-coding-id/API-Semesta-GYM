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
    return queryInterface.bulkInsert('memberships', [
      {
        name: 'Member 1 Bulan',
        price: 10000,
        description: 'Deskripsi Member 1 Bulan',
        duration: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Member 2 Bulan',
        price: 20000,
        description: 'Deskripsi Member 2 Bulan',
        duration: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Member 3 Bulan',
        price: 30000,
        description: 'Deskripsi Member 3 Bulan',
        duration: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('memberships', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
