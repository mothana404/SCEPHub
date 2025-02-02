'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Roles', [
      {
        role_id: 1,
        role_name: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: 2,
        role_name: 'instructor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: 3,
        role_name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Roles', { role_id: [1, 2, 3] }, {});
  },
};
