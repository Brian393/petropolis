"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "_permissions",
      [
        {
          permissionName: "get_users",
          relatedRoleID: 1,
          resourceName: "_users",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "post_user",
          relatedRoleID: 1,
          resourceName: "_users",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "delete_user",
          relatedRoleID: 1,
          resourceName: "_users",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "patch_user",
          relatedRoleID: 1,
          resourceName: "_users",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "get_memberships",
          relatedRoleID: 1,
          resourceName: "_memberships",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "get_permissions",
          relatedRoleID: 1,
          resourceName: "_permissions",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "post_permissions",
          relatedRoleID: 1,
          resourceName: "_permissions",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "delete_permissions",
          relatedRoleID: 1,
          resourceName: "_permissions",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "get_roles",
          relatedRoleID: 1,
          resourceName: "_roles",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "patch_roles",
          relatedRoleID: 1,
          resourceName: "_roles",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "get_accounts",
          relatedRoleID: 1,
          resourceName: "_accounts",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "get_logins",
          relatedRoleID: 1,
          resourceName: "_logins",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
        {
          permissionName: "edit_layers",
          relatedRoleID: 2,
          resourceName: "_layers",
          createdAt: Sequelize.fn("NOW"),
          updatedAt: Sequelize.fn("NOW"),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("_permissions", null, {});
  },
};
