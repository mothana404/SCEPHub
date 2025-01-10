'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const adminPassword = await bcrypt.hash('Password123@', 10);
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          user_name: 'Admin',
          user_email: 'main_admin_account@gmail.com',
          password: adminPassword,
          role: 3,
        },
      ],
      {},
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      'Users',
      {
        user_email: ['main_admin_account@gmail.com'],
      },
      {},
    );
  },
};
