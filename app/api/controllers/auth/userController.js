const sequelize = require('../../db');
const Users = sequelize.import('../../models/users.js');
const Logins = sequelize.import('../../models/logins.js');
const permissionController = require('./permissionController.js');

exports.users_get = (req, res) => {
  permissionController.hasPermission(req, res, 'get_users', () => {
    const userID = req.params.id;
    let _usersPromise;
    if (userID) {
      _usersPromise = Users.findOne({ where: { userID } });
    } else {
      _usersPromise = Users.findAll();
    }
    _usersPromise.then((users) => {
      res.status(200);
      res.json(users);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
  });
};


exports.user_patch = (req, res) => {
  permissionController.hasPermission(req, res, "patch_user", () => {
    if (req.params.id) {
      Users.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName,
          relatedRoleID: req.body.relatedRoleID,
          email: req.body.email,
        },
        {
          where: {
            userID: req.params.id,
          },
        }
      )
        .then((updatedUser) => {
          res.status(204);
          return res.json({});
        })
        .catch((err) => {
          console.log(err);
          res.status(500);
          res.json();
        });
    } else {
      res.status(400);
      res.json();
    }
  });
};

exports.user_delete = (req, res) => {
  permissionController.hasPermission(req, res, "delete_user", () => {
    if (req.params.id) {
      // Delete login row if user is already logged
      Logins.destroy({
        where: {
          relatedUserID: req.params.id
        }
      })
      // Delete user row. 
      Users.destroy({
        where: {
          userID: req.params.id,
        },
      })
      .then((deleted) => {
        res.status(204);
        res.json();
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.json();
      });
    } else {
      res.status(400);
      res.json();
    }
  });
};

