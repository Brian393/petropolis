const sequelize = require("../../db");
const Logins = sequelize.import("../../models/logins.js");
const Users = sequelize.import("../../models/users.js");
const Permissions = sequelize.import("../../models/permissions.js");
const Roles = sequelize.import("../../models/roles.js");

const bcryptController = require("./bcryptController.js");
const tokenController = require("./tokenController.js");
const permissionController = require("./permissionController.js");

const assignToken = (login, res) => {
  const getUser = Users.findOne({
    where: {
      userID: login.relatedUserID,
    },
  });
  const permissionOpt = {
    attributes: ["permissionName"],
  };
  // Assign all permission if user is admin. 
  if (login.relatedRoleID !== 1) {
    permissionOpt.where = {
      relatedRoleID: login.relatedRoleID,
    };
  }
  const getPermissions = Permissions.findAll(permissionOpt);
  const getRoles = Roles.findAll({
    attributes: ["roleName"],
    where: {
      roleID: login.relatedRoleID,
    },
  });

  Promise.all([getUser, getRoles, getPermissions])
    .then((values) => {
      let user = values[0];
      let roles = values[1];
      let permissions = values[2];
      const payload = {
        sub: login.relatedUserID,
        iss: "auth-service",
        user: user,
      };
      if (roles) {
        const rolesArray = roles.map((obj) => obj.roleName);
        payload.roles = rolesArray;
      }
      if (permissions) {
        const permissionsArray = permissions.map((obj) => obj.permissionName);
        payload.permissions = permissionsArray;
      }
      const secret = tokenController.getSecret();
      const token = tokenController.getToken(payload, secret);
      res.json({ token: token });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.json({ err: err });
    });
};

exports.login_post = (req, res) => {
  Logins.findOne({
    where: {
      userName: req.body.username,
    },
  })
    .then((login) => {
      if (!login) {
        res.status(400);
        res.json({ err: "No user registered with this email" });
      }
      const pass = req.body.password;
      const salt = login.passwordSalt;
      const hash = login.passwordHash;
      const isValid = bcryptController.checkPassword(pass, salt, hash);
      if (!isValid) {
        res.status(400);
        res.json({ err: "Password invalid" });
      } else {
        assignToken(login, res);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.json({ err: err });
    });
};

exports.logins_get = (req, res) => {
  permissionController.hasPermission(req, res, "get_logins", () => {
    Logins.findAll()
      .then((permissions) => {
        res.status(200);
        res.json(permissions);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  });
};
