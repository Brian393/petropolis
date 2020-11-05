"use strict";
module.exports = (sequelize, DataTypes) => {
  var _icons = sequelize.define(
    "_icons",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      iconUrl: DataTypes.STRING
    },
    { freezeTableName: true }
  );
  return _icons;
};
