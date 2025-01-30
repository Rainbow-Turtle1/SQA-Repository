import { tokenIsValid } from "../routes/session-tokens.js";

function isAuthenticated(req, res, next) {
  if (tokenIsValid(req)) {
    return next(); // User authenticated success
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized access. Please log in.",
    redirectUrl: "/login",
  });
}

export { isAuthenticated };
