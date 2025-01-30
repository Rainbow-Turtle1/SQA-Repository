import "jest-localstorage-mock";
import { afterAll /*, jest */ } from "@jest/globals";
import { NewSessionToken, tokenIsValid } from "../routes/session-tokens.js";
import { sequelize } from "../models/user.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(() => {
  sessionStorage.clear();
  //jest.clearAllMocks();
});

afterAll(async () => {
  await sequelize.close(); // Properly close database connection
});

function MockReq() {
  return {
    session: {},
  };
}
test("NewSessionToken creates a token if none exists", () => {
  const req = MockReq();
  NewSessionToken(req, "id-for-tests");
  expect(req.session.user).toEqual({
    id: "id-for-tests",
    date: expect.any(String),
  });

  test("tokenIsValid should return true for a valid token", () => {
    expect(tokenIsValid({ id: "uuid-123", date: "2024-01-01" })).toBe(true);
  });

  test("tokenIsValid should return false for an expired token", () => {
    expect(tokenIsValid({ id: "uuid-123", date: "2000-01-01" })).toBe(false);
  });

  //depricated
  //sessionStorage.getItem.mockReturnValue(null);

  // const userId = "user123";
  // const token = NewSessionToken(userId);

  // expect(sessionStorage.getItem).toHaveBeenCalledWith("sessionToken");
  // expect(sessionStorage.setItem).toHaveBeenCalledWith(
  // "sessionToken",
  // expect.any(String)
  // );
  // expect(token).toBeDefined();
});
