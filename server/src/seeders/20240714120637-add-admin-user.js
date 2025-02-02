'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const adminPassword = await bcrypt.hash('Password123@', 10);
    const now = new Date();

    await queryInterface.bulkInsert(
      'users',
      [
        {
          user_name: 'Admin',
          user_email: 'main_admin_account@gmail.com',
          password: adminPassword,
          role: 3,
          user_img:
            'https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png',
          created_at: now,
          updated_at: now,
        },
      ],
      {},
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      'users',
      {
        user_email: ['main_admin_account@gmail.com'],
      },
      {},
    );
  },
};
