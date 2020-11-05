// Require dependencies
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const app = express();

// Require controller modules
const registerController = require("./controllers/auth/registerController.js");
const loginController = require("./controllers/auth/loginController.js");
const tokenController = require("./controllers/auth/tokenController.js");
const userController = require("./controllers/auth/userController.js");
const roleController = require("./controllers/auth/roleController.js");
const permissionController = require("./controllers/auth/permissionController.js");
const layerController = require("./controllers/gis/layerController.js");
const uploadController = require("./controllers/upload/uploadController.js");
const htmlSidebarController = require("./controllers/gis/htmlSidebarController.js");
const upload = require("./services/file-upload.js");

// Use middleware
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app
  .route("/api/register")
  .post(registerController.validate, registerController.register_post);

app
  .route("/api/updateUserPassword")
  .post(
    registerController.validatePassword,
    registerController.update_password_post
  );

app.route("/api/login").post(loginController.login_post);

app.route("/api/token").post(tokenController.token_post);

app.route("/api/validateToken").get(tokenController.validate_token);

app.route("/api/logins").get(loginController.logins_get);

app.route("/api/users").get(userController.users_get);

app
  .route("/api/users/:id")
  .get(userController.users_get)
  .patch(userController.user_patch)
  .delete(userController.user_delete);

app.route("/api/roles").get(roleController.roles_get);

app
  .route("/api/roles/:id")
  .get(roleController.role_get)
  .patch(roleController.role_patch)
  .delete(roleController.role_delete);

app
  .route("/api/permissions")
  .get(permissionController.permissions_get)
  .post(permissionController.permissions_post);

app
  .route("/api/permissions/:id")
  .patch(permissionController.permission_patch)
  .delete(permissionController.permission_delete);

app.route("/api/layer").post(layerController.layer_post);

app.route("/api/upload").post(uploadController.file_upload);

app
  .route("/api/html")
  .get(htmlSidebarController.html_sidebar_get)
  .delete(htmlSidebarController.html_sidebar_delete)
  .patch(htmlSidebarController.html_sidebar_patch)
  .post(htmlSidebarController.html_sidebar_post);

app.route("/api/icons")
    .get(htmlSidebarController.icons_get)
    .post(htmlSidebarController.icons_post)
    .delete(htmlSidebarController.icons_delete)
    
// Run server on port
app.listen(3000, () => console.log("Example app listening on port 3000!"));
