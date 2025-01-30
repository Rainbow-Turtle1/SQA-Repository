function NewSessionToken(req, uuid) {
  if (!req.session) {
    console.error("Session object is undefined. Possible misconfiguration.");
    return;
  }

  if (!uuid) {
    console.error("UUID is missing for session token.");
    return;
  }

  req.session.user = {
    id: uuid,
    date: getCurrentDate(),
  };
  console.log(`Session token created for user ${uuid} on ${getCurrentDate()}`);
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
      req.session.destroy(); // ✅ Prevents errors if destroy is missing
    } else {
      console.warn("Session destroy method is not available.");
      req.session.user = null; // Fallback: Manually clear user session
    }

    return false;
  }

  return true;
}

function getCurrentDate() {
  let date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}${month}${day}`;
}

export { NewSessionToken, tokenIsValid };
