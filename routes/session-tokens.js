function NewSessionToken(req, uuid) {
  if (!req.session) {
    console.error("Session object is undefined. Possible misconfiguration.");
    return;
  }

  if (!uuid) {
    console.error("UUID not found - session token failed to create");
    return;
  }

  req.session.user = {
    id: uuid,
    date: getCurrentDate(),
  };

  console.log(
    `Session token was created for user: ${uuid} with date: ${getCurrentDate()}`
  );
}

function ClearSessionToken(req) {
  if (!req.session) {
    console.log(
      "Session object is undefined. Possible misconfiguration. Session may already be clear"
    );
    return res.redirect("/login");
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      console.log("Session successfully cleared.");
    }
    console.log("cleared session token");
  });
}

function FetchSessionId(req) {
  if (req.session && req.session.user && tokenIsValid(req)) {
    return req.session.user.id;
  }
  console.error("Session token error: user not authenticated.");
  throw Error("Session token error: user not authenticated.");
}

function tokenIsValid(req) {
  if (!req.session || !req.session.user) {
    console.error("No session token found. User may not be logged in.");
    return false;
  }

  const tokenDate = req.session.user.date;
  const dateNow = getCurrentDate();

  if (tokenDate !== dateNow) {
    console.error(
      `Token expired. Expected ${dateNow}, but got ${tokenDate}. Clearing session.`
    );

    if (typeof req.session.destroy === "function") {
      req.session.destroy(); // Prevents errors if destroy is missing
    } else {
      console.warn("Session destroy method is not available.");
      req.session.user = null; // Fallback: Manually clears user session
    }

    return false;
  }

  console.log("token is valid");
  return true;
}

function getCurrentDate() {
  let date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}${month}${day}`;
}

export { NewSessionToken, ClearSessionToken, tokenIsValid, FetchSessionId };
