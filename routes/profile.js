import { Router } from "express";
const router = Router();
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import {
  getAccountProfilePicture,
  setAccountProfilePicture,
  profilePicturePaths,
  getCurrentLoggedInUser,
  setCurrentLoggedInUser,
} from "./shared-data.js";

let accountProfilePicture = getAccountProfilePicture();
let currentProfilePicture = 0;

router.get("/profile", (req, res) => {
  const user = getCurrentLoggedInUser();
  res.render("user-profile/profile", {
    title: "Profile",
    user: user,
    profilePicture: profilePicturePaths[accountProfilePicture],
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.get("/profile/edit", (req, res) => {
  const user = getCurrentLoggedInUser();
  res.render("user-profile/edit-details", {
    title: "Edit Profile",
    user: user,
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.get("/profile/change-password", (req, res) => {
  const user = getCurrentLoggedInUser();
  res.render("user-profile/change-password", {
    title: "Change Password",
    user: user,
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.get("/profile/delete-account", (req, res) => {
  const user = getCurrentLoggedInUser();
  res.render("user-profile/delete-account", {
    title: "Delete Account",
    user: user,
    profileIcon: profilePicturePaths[accountProfilePicture],
  });
});

router.post("/profile/change-password", async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const email = "test@email.com";
    const user = await User.findOne({ where: { email } });

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

    const doesPasswordMatch = await bcrypt.compareSync(
      oldPassword,
      user.password
    );

    if (!doesPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "The old password you entered is incorrect.",
        redirectUrl: "/profile/change-password",
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await User.update({ password: newHash }, { where: { email } });

    res.status(200).json({
      success: true,
      message: "Password successfully changed.",
      redirectUrl: "/profile",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Error changing password.",
    });
  }
});

router.post("/profile/edit", async (req, res) => {
  try {
    const { name, email } = req.body;
    const currentLoggedInUser = getCurrentLoggedInUser();
    const user = await User.findOne({
      where: { email: currentLoggedInUser.email },
    });

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: "You must amend either field.",
        redirectUrl: "/profile/edit",
      });
    }

    if (name && email === "") {
      User.update(
        { name },
        {
          where: {
            email: currentLoggedInUser.email,
          }, // need to fix
        }
      );
      setCurrentLoggedInUser({
        ...currentLoggedInUser,
        name,
        email: currentLoggedInUser.email,
      });
    } else if (email && name === "") {
      const checkAgainstDBUser = await User.findOne({ where: { email } });
      if (checkAgainstDBUser && checkAgainstDBUser.email !== user.email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
          redirectUrl: "/profile/edit",
        });
      }

      User.update(
        { email },
        {
          where: {
            email: currentLoggedInUser.email,
          }, // need to fix
        }
      );
      setCurrentLoggedInUser({
        ...currentLoggedInUser,
        email,
        name: currentLoggedInUser.name,
      });
    } else if (name && email) {
      const checkAgainstDBUser = await User.findOne({ where: { email } });
      if (checkAgainstDBUser && checkAgainstDBUser.email !== user.email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
          redirectUrl: "/profile/edit",
        });
      } else {
        User.update(
          { name, email },
          {
            where: {
              email: currentLoggedInUser.email,
            },
          }
        );
        setCurrentLoggedInUser({ ...currentLoggedInUser, name, email });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Successfully edited user details.",
      redirectUrl: "/profile",
    });
  } catch {
    res.status(400).json({
      success: false,
      message: "Error editing user details.",
      redirectUrl: "/profile/edit",
    });
  }
});

router.post("/profile/delete-account", async (req, res) => {
  try {
    const { password } = req.body;
    const email = "test@email.com";
    const user = await User.findOne({ where: { email } });

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "You must enter your password to delete your account.",
        redirectUrl: "/profile/delete-account",
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "You don't have an account!",
        redirectUrl: "/register",
      });
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password. Please try again.",
        redirectUrl: "/profile/delete-account",
      });
    }

    await User.destroy({ where: { email } });

    return res.status(200).json({
      success: true,
      message: "Successfully deleted account.",
      redirectUrl: "/register",
    });
  } catch {
    res.status(400).send("Error editing user details.");
  }
});

router.post("/profile", (req, res) => {
  const { action } = req.body;
  const user = getCurrentLoggedInUser();

  if (action === "nextPicture") {
    currentProfilePicture < profilePicturePaths.length - 1
      ? currentProfilePicture++
      : (currentProfilePicture = 0);

    res.render("user-profile/profile", {
      title: "Profile",
      user: user,
      profilePicture: profilePicturePaths[currentProfilePicture],
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else if (action === "prevPicture") {
    currentProfilePicture > 0
      ? currentProfilePicture--
      : (currentProfilePicture = profilePicturePaths.length - 1);

    res.render("user-profile/profile", {
      title: "Profile",
      user: user,
      profilePicture: profilePicturePaths[currentProfilePicture],
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else if (action === "savePicture") {
    setAccountProfilePicture(currentProfilePicture);
    accountProfilePicture = getAccountProfilePicture();

    res.render("user-profile/profile", {
      title: "Profile",
      user: user,
      profilePicture: profilePicturePaths[accountProfilePicture],
      profileIcon: profilePicturePaths[accountProfilePicture],
    });
  } else {
    res.status(400).send("Invalid action.");
  }
});

export default router;
