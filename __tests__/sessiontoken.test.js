import "jest-localstorage-mock";
import { jest } from "@jest/globals";
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

function MockReq() {
  return {
    session: {
      user: null,
      destroy: jest.fn(),
    },
  };
}

function getCurrentTestDate() {
  let date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}${month}${day}`;
}

test("NewSessionToken creates a token if none exists", () => {
  const req = MockReq();
  NewSessionToken(req, "id-for-tests");
  expect(req.session.user).toEqual({
    id: "id-for-tests",
    date: getCurrentTestDate(),
  });
});

test("tokenIsValid should return true for a valid session token", () => {
  const req = MockReq();
  req.session.user = {
    id: "uuid-123",
    date: getCurrentTestDate(),
  };
  expect(tokenIsValid(req)).toBe(true);
});

test("tokenIsValid should return false for an expired token and call session.destroy", () => {
  const req = MockReq();
  req.session.user = {
    id: "uuid-123",
    date: "20000101", 
  };
  expect(tokenIsValid(req)).toBe(false);
  expect(req.session.destroy).toHaveBeenCalled();
});

test("tokenIsValid should return false if no user session exists", () => {
  const req = MockReq();
  expect(tokenIsValid(req)).toBe(false);
});
