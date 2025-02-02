'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('AdminPassword@@1779', 10);

    return queryInterface.bulkInsert(
      'Users',
      [
        {
          user_name: 'Admin',
          user_email: 'main_admin_account@gmail.com',
          password: hashedPassword,
          role: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', { user_name: 'Admin' }, {});
  },
};
