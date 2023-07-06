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
    await queryInterface.bulkInsert('airplanes',[
      {
        modelNumber : 'Airbus350',
        capacity : 260,
        createdAt: new Date(),
        updatedAt : new Date(),
      },
      {
        modelNumber : 'Airbus390',
        capacity : 230,
        createdAt: new Date(),
        updatedAt : new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Airplanes", {
      [Op.or]: [{ modelNumber: "airbus340" }, { modelNumber: "boeing777" }],
    });
  }
};
