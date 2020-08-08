'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('_permissions', {
      permissionID: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true
      },
      relatedRoleID: {
        type: Sequelize.INTEGER,
        references: {
          model: '_roles', // foreign key on roles
          key: 'roleID'
        }
      },
      permissionName:  {
        type: Sequelize.STRING
      },
      resourceName: Sequelize.STRING,
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
    return queryInterface.dropTable('_permissions');
  }
};
