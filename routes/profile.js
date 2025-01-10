import { Router } from "express";
const router = Router();
// import { User } from '../models/user.js'
import { createRedirectResponse } from "./userUtil.js";
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
  currentProfilePicture = getAccountProfilePicture();

  res.render("profile", {
    title: "Profile",
    user: { user },
    profilePicture: profilePicturePaths[accountProfilePicture],
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.get("/profile/edit", (req, res) => {
  res.render("edit-details", { title: "Edit Profile", user: { user } });
});

router.get("/profile/change-password", (req, res) => {
  res.render("change-password", { title: "Change Password", user: { user } });
});

router.get("/profile/delete-account", (req, res) => {
  res.render("delete-account", { title: "Delete Account", user: { user } });
});

router.post("/profile/change-password", (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      res
        .status(400)
        .send(
          createRedirectResponse(
            "You must enter all fields.",
            "/profile/change-password"
          )
        );
      return;
    }

    if (newPassword !== confirmPassword) {
      res
        .status(400)
        .send(
          createRedirectResponse(
            "The new passwords you have entered do not match.",
            "/profile/change-password"
          )
        );
      return;
    }

    if (oldPassword === newPassword) {
      res
        .status(400)
        .send(
          createRedirectResponse(
            "Your new password must be different from your old password.",
            "/profile/change-password"
          )
        );
      return;
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
      res.send(
        createRedirectResponse("You must amend either field.", "/profile/edit")
      );
      return;
    }
  } catch (error) {
    console.error("Error editing user details:", error);
    res.status(500).send("Error editing user details.");
  }
});

router.post("/profile", (req, res) => {
  const { action } = req.body;

  if (action === "nextPicture") {
    currentProfilePicture < profilePicturePaths.length - 1
      ? currentProfilePicture++
      : (currentProfilePicture = 0);

    res.render("profile", {
      title: "Profile",
      user: { user },
      profilePicture: profilePicturePaths[currentProfilePicture],
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else if (action === "prevPicture") {
    currentProfilePicture > 0
      ? currentProfilePicture--
      : (currentProfilePicture = profilePicturePaths.length - 1);

    res.render("profile", {
      title: "Profile",
      user: { user },
      profilePicture: profilePicturePaths[currentProfilePicture],
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else if (action === "savePicture") {
    setAccountProfilePicture(currentProfilePicture);
    accountProfilePicture = getAccountProfilePicture();

    res.render("profile", {
      title: "Profile",
      user: { user },
      profilePicture: profilePicturePaths[accountProfilePicture],
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  }
});

export default router;
