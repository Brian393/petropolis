const permissionController = require("../auth/permissionController");
const sequelize = require("../../db.js");

exports.layer_post = (req, res) => {
  permissionController.hasPermission(req, res, "edit_layers", () => {
    // Prevent sql injection
    if (req.body.table.charAt(0) === "_") {
      res.status(500);
      res.json({ err: "Sql injection detected" });
    }
    let geometry, featureId;
    if (req.body.geometry) {
      geometry = `ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(
        req.body.geometry
      )}'), ${req.body.srid})`;
    }
    if (req.body.featureId) {
      if (typeof req.body.featureId === "string") {
        featureId = parseInt(req.body.featureId.split(".")[1]);
      }
    }
    if (req.body.type) {
      let sql = ``;
      switch (req.body.type) {
        case "insert": {
          const keys = [];
          const values = [];
          if (req.body.geometry) {
            keys.push("geom");
            values.push(geometry);
          }
          if (req.body.properties) {
            Object.keys(req.body.properties).forEach((key) => {
              keys.push(`"${key}"`);
              let value = req.body.properties[key];
              if (typeof value === "string") {
                value = `'${value}'`;
              } else if (typeof value === "object") {
                value = `'${JSON.stringify(value)}'`;
              }
              values.push(value);
            });
          }
          sql = `insert into ${
            req.body.table
          } (${keys.join()}) values (${values.join()})`;
          break;
        }
        case "update": {
          let keyValue = "";
          if (req.body.properties) {
            Object.keys(req.body.properties).forEach((key, index, array) => {
              let value = req.body.properties[key];
              if (typeof value === "string") {
                value = `'${value}'`;
              } else if (typeof value === "object") {
                value = `'${JSON.stringify(value)}'`;
              }
              keyValue += `"${key}" = ${value}`;
              if (index !== array.length - 1) {
                keyValue += ",";
              } else {
                if (geometry) {
                  keyValue += `,"geom" = ${geometry}`;
                }
              }
            });
          }
          sql = `update ${req.body.table} SET ${keyValue} where ${req.body.table}.id = ${featureId}`;
          break;
        }
        case "delete": {
          if (featureId) {
            sql = `DELETE FROM ${req.body.table} WHERE id = ${featureId};`;
          }
          break;
        }
        default:
          break;
      }
      console.log(sql);
      sequelize
        .query(sql)
        .then((results) => {
          res.status(200);
          res.json(results);
        })
        .catch((err) => {
          console.log(err);
          res.status(500);
          res.json({ err: err });
        });
    } else {
      res.status(400);
      res.json();
    }
  });
};
