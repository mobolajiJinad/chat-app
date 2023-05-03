const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const User = require("../model/User");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/profile_pics/");
  },
  filename: function (req, file, cb) {
    const { userID } = req.user;
    const originalname = file.originalname;

    const extension = originalname.split(".").pop();

    const fileName = `${userID}profilePic.${extension}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 Mb
  fileFilter: (req, file, cb) => {
    const acceptableExtensions = ["png", "jpg", "jpeg", "jpg"];
    if (
      !acceptableExtensions.some(
        (extension) =>
          path.extname(file.originalname).toLowerCase() === `.${extension}`
      )
    ) {
      return req.flash("error", "Extension not allowed");
    }
    cb(null, true);
  },
});

router.route("/logout").get((req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.flash("error", "Something went wrong");
    }

    res.redirect("/auth/login");
  });
});

router.post(
  "/upload-profile-pic",
  upload.single("profilePic"),
  async (req, res) => {
    const { userID } = req.user;
    const file = req.file;

    if (!file) {
      req.flash("error", "No image was selected");
      return res.status(400).json({ error: "No image was selected" });
    }

    const user = await User.findById(userID);

    let filePath = file.path.split("\\");
    filePath = `/${filePath[1]}/${filePath[2]}`;

    user.profilePicture = filePath;
    await user.save();

    res.status(200).json({ msg: "Profile picture saved" });
  }
);

module.exports = router;
