import "jest-localstorage-mock";
import {
  afterAll,
  beforeAll,
  beforeEach,
  test,
  expect,
  jest,
} from "@jest/globals";
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
    session: {},
    destroy: jest.fn(),
  };
}

test("NewSessionToken creates a token if none exists", () => {
  const req = MockReq();
  NewSessionToken(req, "id-for-tests");
  expect(req.session.user).toEqual({
    id: "id-for-tests",
    date: expect.any(String),
  });
});

test("tokenIsValid should return true for a valid session token", () => {
  const req = MockReq();
  req.session.user = {
    id: "uuid-123",
    date: "20240101", // Ensure this matches the format of getCurrentDate()
  };
  expect(tokenIsValid(req)).toBe(true);
});

test("tokenIsValid should return false for an expired token and call session.destroy", () => {
  const req = MockReq();
  req.session.user = {
    id: "uuid-123",
    date: "20000101", // A date far in the past
  };
  expect(tokenIsValid(req)).toBe(false);
  expect(req.destroy).toHaveBeenCalled();
});

test("tokenIsValid should return false if no user session exists", () => {
  const req = MockReq();
  expect(tokenIsValid(req)).toBe(false);
});
