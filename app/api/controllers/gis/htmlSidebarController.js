const permissionController = require("../auth/permissionController");
const sequelize = require("../../db.js");
const HtmlSidebar = sequelize.import("../../models/html_sidebar.js");
const Icons = sequelize.import("../../models/icons.js");
const jwtDecode = require("jwt-decode");

/** HTML ENDPOINT */

exports.html_sidebar_get = (req, res) => {
  HtmlSidebar.findAll({
    raw: true,
  })
    .then((data) => {
      let response = {
        layers: {},
        groups: {},
      };
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((html) => {
          if (html.type === "layer") {
            response.layers[html.name] = html;
          }
          if (html.type === "group") {
            response.groups[html.name] = html;
          }
        });
      }
      res.status(200);
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.json({ err: err });
    });
};

exports.html_sidebar_post = (req, res) => {
  permissionController.hasPermission(req, res, "edit_layers", () => {
    const decodedToken = jwtDecode(req.headers.authorization);
    const uploaderId = parseInt(decodedToken.user.userID);
    const payload = {
      type: req.body.type,
      name: req.body.name,
      html: req.body.html,
      createdBy: uploaderId,
    };
    HtmlSidebar.create(payload)
      .then(() => {
        res.status(200);
        return res.json("html added successfuly");
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.json();
      });
  });
};
exports.html_sidebar_patch = (req, res) => {
  permissionController.hasPermission(req, res, "edit_layers", () => {
    HtmlSidebar.update(
      {
        html: req.body.html,
      },
      {
        where: {
          name: req.body.name,
        },
      }
    )
      .then(() => {
        res.status(200);
        return res.json("html updated successfuly");
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.json();
      });
  });
};

exports.html_sidebar_delete = (req, res) => {
  permissionController.hasPermission(req, res, "edit_layers", () => {
    if (req.body.name) {
      HtmlSidebar.destroy({
        where: {
          name: req.body.name,
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

/** ICONS ENDPOINT */

exports.icons_get = (req, res) => {
  Icons.findAll({
    raw: true,
  })
    .then((data) => {
      res.status(200);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.json({ err: err });
    });
};

exports.icons_post = (req, res) => {
  permissionController.hasPermission(req, res, "edit_layers", () => {
    const payload = {
      iconUrl: req.body.iconUrl,
      title: req.body.title
    };
    Icons.create(payload)
      .then(() => {
        res.status(200);
        return res.json("icon added successfuly");
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.json();
      });
  });
};
exports.icons_delete = (req, res) => {
  permissionController.hasPermission(req, res, "edit_layers", () => {
    if (req.body.id) {
      Icons.destroy({
        where: {
          id: req.body.id,
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
