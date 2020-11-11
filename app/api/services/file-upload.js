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
const uploadFolder = process.env.BUCKET_ENV_UPLOAD_FOLDER;
const jwtDecode = require("jwt-decode");

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (
    ["audio/wav", "audio/mpeg", "image/jpeg", "image/png"].includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid Mime Type, only JPEG, PNG, MP3 and WAV"), false);
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
      let assetSubfolder = "";
      if (["image/jpeg", "image/png"].includes(file.mimetype)) {
        assetSubfolder = "images/";
      } else if (["audio/wav", "audio/mpeg"].includes(file.mimetype)) {
        assetSubfolder = "audios/";
      } else {
        cb(new Error("Invalid Mime Type, only JPEG, PNG, MP3 and WAV"), false);
      }
      const path =
        uploadFolder + assetSubfolder + Date.now() + "_" + file.originalname;
      cb(null, "assets" + path); //Appending extension
    },
  }),
});

module.exports = upload;
