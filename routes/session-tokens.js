function NewSessionToken(id) {
	let token = GenerateSessionToken(id);
	sessionStorage.setItem("sessionToken", JSON.stringify(token));
	return token;
}

function GenerateSessionToken(id) {
	let newToken = {
		id,
		date: getCurrentDate(),
	};
	let encryptedToken = tokenEncrypt(newToken);
	return encryptedToken;
}

function getCurrentDate() {
	let date = new Date();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}${month}${day}`;
}

function tokenEncrypt(token) {
	let encrypted = token;
	return encrypted;
}

function tokenIsValid(uuid) {
	const storedTokenStr = sessionStorage.getItem("sessionToken");

	if (!storedTokenStr) {
		console.error("No session token found. User may not be logged in.");
		return false;
	}

	try {
		const storedToken = JSON.parse(storedTokenStr);
		if (!storedToken.id || !storedToken.date) {
			console.error(
				"Session token invalid - missing id or date - Clearing session Token"
			);
			sessionStorage.removeItem("sessionToken");
			return false;
		}

		const tokenDate = storedToken.date;
		const dateNow = getCurrentDate();

		if (tokenDate != dateNow) {
			console.error("Token invalid - not from current date - Clearing session");
			sessionStorage.removeItem("sessionToken");
			return false;
		}

		if (storedToken.id === uuid) {
			console.log("Session token is valid. User authenticated.");
			return true;
		}

		console.error(
			`Session token mismatch: Expected ${uuid}, but found ${storedToken.id}. Possible unauthorized access.`
		);
	} catch (error) {
		console.error(
			"Session token is corrupted or improperly formatted. Clearing session.",
			error
		);
		sessionStorage.removeItem("sessionToken");

		return false;
	}
}

export { NewSessionToken, GenerateSessionToken, tokenIsValid };
