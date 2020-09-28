const permissionController = require("../auth/permissionController");
const sequelize = require("../../db.js");

const upload = require("../../services/file-upload");
const singleUpload = upload.single("image");

exports.layer_post = (req, res) => {
  permissionController.hasPermission(req, res, "edit_layers", () => {
    // Prevent sql injection
    singleUpload(req, res, function (err) {
      const payload = JSON.parse(req.body.payload);
      if (
        req.file &&
        req.file.location &&
        payload.properties.hasOwnProperty("imageUrl")
      ) {
        payload.properties.imageUrl = process.env.CLOUDFRONT_BASE_URL
          ? process.env.CLOUDFRONT_BASE_URL +
            req.file.key.replace(process.env.UPLOAD_BASE_FOLDER, "")
          : process.file.location;
      }
      if (payload.table.charAt(0) === "_") {
        res.status(500);
        res.json({ err: "Sql injection detected" });
      }
      let geometry, featureId;
      if (payload.geometry) {
        geometry = `ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(
          payload.geometry
        )}'), ${payload.srid})`;
      }
      if (payload.featureId) {
        if (typeof payload.featureId === "string") {
          featureId = parseInt(payload.featureId.split(".")[1]);
        }
      }
      if (payload.type) {
        let sql = ``;
        switch (payload.type) {
          case "insert": {
            const keys = [];
            const values = [];
            if (payload.geometry) {
              keys.push("geom");
              values.push(geometry);
            }
            if (payload.properties) {
              Object.keys(payload.properties).forEach((key) => {
                keys.push(`"${key}"`);
                let value = payload.properties[key];
                if (typeof value === "string") {
                  value = `$$${value}$$`;
                } else if (typeof value === "object") {
                  value = `$$${JSON.stringify(value)}$$`;
                }
                values.push(value);
              });
            }
            sql = `insert into ${
              payload.table
            } (${keys.join()}) values (${values.join()})`;
            break;
          }
          case "update": {
            let keyValue = "";
            if (payload.properties) {
              Object.keys(payload.properties).forEach((key, index, array) => {
                let value = payload.properties[key];
                if (value !== null) {
                  if (typeof value === "string") {
                    value = `$$${value}$$`;
                  } else if (typeof value === "object") {
                    value = `$$${JSON.stringify(value)}$$`;
                  }
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
            sql = `update ${payload.table} SET ${keyValue} where ${payload.table}.id = ${featureId}`;
            break;
          }
          case "delete": {
            if (featureId) {
              sql = `DELETE FROM ${payload.table} WHERE id = ${featureId};`;
            }
            break;
          }
          default:
            break;
        }
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
  });
};
