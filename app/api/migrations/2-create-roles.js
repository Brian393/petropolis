'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('_roles', {
      roleID: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false,
         autoIncrement: true
      },
      roleName: Sequelize.STRING,
      relatedAccountID: {
        type: Sequelize.INTEGER,
        references: {
          model: '_accounts', // foreign key on accounts
          key: 'accountID'
        }
      },
      roleEmail: {
        type: Sequelize.STRING, // ex: admins@company.com
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('_roles');
  }
};
