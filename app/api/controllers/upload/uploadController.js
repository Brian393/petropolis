const permissionController = require("../auth/permissionController");
const sequelize = require("../../db.js");

const upload = require("../../services/file-upload");

const singleUpload = upload.single("image");
exports.file_upload = (req, res) => {
  permissionController.hasPermission(req, res, "edit_layers", () => {
      singleUpload(req, res, function (err) {
        if (err) {
          return res
            .status(422)
            .send({
              errors: [{ title: "File Upload Error", detail: err.message }],
            });
        }
        return res.json({ imageUrl: req.file.location });
      });
  });
};
