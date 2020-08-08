// Require dependencies
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

// Require controller modules
const registerController = require('./controllers/auth/registerController.js');
const loginController = require("./controllers/auth/loginController.js");
const tokenController = require("./controllers/auth/tokenController.js");
const userController = require("./controllers/auth/userController.js");
const roleController = require("./controllers/auth/roleController.js");
const permissionController = require("./controllers/auth/permissionController.js");

// Use middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Public API endpoints
app.route('/api/register')
  .post(registerController.validate, registerController.register_post);

app.route('/api/login')
  .post(loginController.login_post);

app.route('/api/token')
  .post(tokenController.token_post);

// Protected API Resources
app.route('/api/logins')
  .get(loginController.logins_get);


app.route("/api/users")
  .get(userController.users_get)
  
app.route('/api/users/:id')
  .get(userController.users_get)
  .delete(userController.user_delete);

app.route('/api/roles')
  .get(roleController.roles_get);

app.route('/api/roles/:id')
  .get(roleController.role_get)
  .patch(roleController.role_patch)
  .delete(roleController.role_delete);

app.route('/api/permissions')
  .get(permissionController.permissions_get)
  .post(permissionController.permissions_post);

app.route('/api/permissions/:id')
  .patch(permissionController.permission_patch)
  .delete(permissionController.permission_delete);

// Run server on port
app.listen(3000, () => console.log('Example app listening on port 3000!'));
