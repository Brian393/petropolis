'use strict';
module.exports = (sequelize, DataTypes) => {
  var Permissions = sequelize.define('_permissions', {
    permissionID: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true
    },
    relatedRoleID: {
      type: DataTypes.INTEGER
    },
    permissionName:  {
      type: DataTypes.STRING
    },
    resourceName: DataTypes.STRING
  });
  return Permissions;
};
