import { Router } from "express";
const router = Router();
// import { User } from '../models/user.js'
import {
  getAccountProfilePicture,
  setAccountProfilePicture,
  profilePicturePaths,
} from "./shared-data.js";

let accountProfilePicture = getAccountProfilePicture();
let currentProfilePicture = 0;

const user = {
  name: "John Smith",
  email: "test@email.com",
  password: "password123",
};

router.get("/profile", (req, res) => {
  res.render("user-profile/profile", {
    title: "Profile",
    user: { user },
    profilePicture: profilePicturePaths[accountProfilePicture],
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.get("/profile/edit", (req, res) => {
  res.render("user-profile/edit-details", {
    title: "Edit Profile",
    user: { user },
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.get("/profile/change-password", (req, res) => {
  res.render("user-profile/change-password", {
    title: "Change Password",
    user: { user },
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.get("/profile/delete-account", (req, res) => {
  res.render("user-profile/delete-account", {
    title: "Delete Account",
    user: { user },
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.post("/profile/change-password", (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "You must enter all fields.",
        redirectUrl: "/profile/change-password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "The new passwords you have entered do not match.",
        redirectUrl: "/profile/change-password",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Your new password must be different from your old password.",
        redirectUrl: "/profile/change-password",
      });
    }

    res.status(200).send("Password changed successfully.");

    // need to add the functionality to:
    // > make sure that the user is authenticated
    // > make sure that the old password is correct
    // > update the user's password in the database
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(400).send("Error changing password.");
  }
});

router.post("/profile/edit", (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: "You must amend either field.",
        redirectUrl: "/profile/edit",
      });
    }
    res.status(400).send("Error editing user details.");
  } catch (error) {
    console.error("Error editing user details:", error);
    res.status(400).send("Error editing user details.");
  }
});

router.post("/profile/delete-account", (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "You must enter your password to delete your account.",
      });
    }
  } catch (error) {}
});

router.post("/profile", (req, res) => {
  const { action } = req.body;

  if (action === "nextPicture") {
    currentProfilePicture < profilePicturePaths.length - 1
      ? currentProfilePicture++
      : (currentProfilePicture = 0);

    res.render("user-profile/profile", {
      title: "Profile",
      user: { user },
      profilePicture: profilePicturePaths[currentProfilePicture],
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else if (action === "prevPicture") {
    currentProfilePicture > 0
      ? currentProfilePicture--
      : (currentProfilePicture = profilePicturePaths.length - 1);

    res.render("user-profile/profile", {
      title: "Profile",
      user: { user },
      profilePicture: profilePicturePaths[currentProfilePicture],
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else if (action === "savePicture") {
    setAccountProfilePicture(currentProfilePicture);
    accountProfilePicture = getAccountProfilePicture();

    res.render("user-profile/profile", {
      title: "Profile",
      user: { user },
      profilePicture: profilePicturePaths[accountProfilePicture],
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else {
    res.status(400).send("Invalid action.");
  }
});

export default router;
