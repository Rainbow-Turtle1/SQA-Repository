import { Router } from "express";
const router = Router();
// import { User } from '../models/user.js'
import { createRedirectResponse } from "./userUtil.js";

const user = {
  name: "John Smith",
  email: "test@email.com",
  password: "password123",
};

router.get("/profile", (req, res) => {
  res.render("profile", { title: "Profile", user: { user } });
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
      res.send(
        createRedirectResponse(
          "You must enter all fields.",
          "/profile/change-password"
        )
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      res.send(
        createRedirectResponse(
          "The new passwords you have entered do not match.",
          "/profile/change-password"
        )
      );
      return;
    }

    if (oldPassword === newPassword) {
      res.send(
        createRedirectResponse(
          "Your new password must be different from your old password.",
          "/profile/change-password"
        )
      );
      return;
    }

    // need to add the functionality to:
    // > make sure that the user is authenticated
    // > make sure that the old password is correct
    // > update the user's password in the database
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Error changing password.");
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

export default router;
