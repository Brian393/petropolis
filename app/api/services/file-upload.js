const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
var path = require("path");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION_NAME,
});

const s3 = new aws.S3();
const imagesFolder = process.env.BUCKET_IMAGES_FOLDER;
const jwtDecode = require("jwt-decode");

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid Mime Type, only JPEG and PNG"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      const decodedToken = jwtDecode(req.headers.authorization);
      const uploaderFullName = `${decodedToken.user.firstName} ${decodedToken.user.lastName}`;
      const uploaderId = decodedToken.user.userID.toString();
      cb(null, { uploaderFullName, uploaderId });
    },
    key: function (req, file, cb) {
      cb(
        null,
        "assets" + imagesFolder + Date.now() + "_" + file.originalname
      ); //Appending extension
    },
  }),
});

module.exports = upload;
