import "jest-localstorage-mock";
import { jest } from "@jest/globals"; // ✅ Ensures jest functions work
import { NewSessionToken, tokenIsValid } from "../routes/session-tokens.js";
import { sequelize } from "../models/user.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(() => {
  sessionStorage.clear();
});

afterAll(async () => {
  await sequelize.close();
});

// ✅ Mock Request Object with a destroy function
function MockReq() {
  return {
    session: {
      user: null,
      destroy: jest.fn(), // ✅ Ensures destroy() can be called in tests
    },
  };
}

// ✅ Generate a dynamic current date for testing
function getCurrentTestDate() {
  let date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}${month}${day}`;
}

// ✅ Test NewSessionToken creates a token correctly
test("NewSessionToken creates a token if none exists", () => {
  const req = MockReq();
  NewSessionToken(req, "id-for-tests");
  expect(req.session.user).toEqual({
    id: "id-for-tests",
    date: getCurrentTestDate(), // ✅ Matches the dynamically generated date
  });
});

// ✅ Test tokenIsValid correctly verifies a valid session token
test("tokenIsValid should return true for a valid session token", () => {
  const req = MockReq();
  req.session.user = {
    id: "uuid-123",
    date: getCurrentTestDate(), // ✅ Ensures date matches today's date
  };
  expect(tokenIsValid(req)).toBe(true);
});

// ✅ Test tokenIsValid correctly invalidates an expired session token
test("tokenIsValid should return false for an expired token and call session.destroy", () => {
  const req = MockReq();
  req.session.user = {
    id: "uuid-123",
    date: "20000101", // Simulated expired token date
  };
  expect(tokenIsValid(req)).toBe(false);
  expect(req.session.destroy).toHaveBeenCalled(); // ✅ Ensures destroy() was called
});

// ✅ Test tokenIsValid correctly handles missing session token
test("tokenIsValid should return false if no user session exists", () => {
  const req = MockReq();
  expect(tokenIsValid(req)).toBe(false);
});
