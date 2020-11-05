"use strict";
module.exports = (sequelize, DataTypes) => {
  var _html_sidebar = sequelize.define(
    "_html_sidebar",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: DataTypes.STRING,
      name: DataTypes.STRING,
      html: DataTypes.TEXT,
      createdBy: DataTypes.INTEGER
    },
    { freezeTableName: true }
  );
  return _html_sidebar;
};
