import "jest-localstorage-mock";
import { afterEach, jest } from "@jest/globals";
import { NewSessionToken } from "../routes/session-tokens.js";

beforeEach(() => {
  sessionStorage.clear();
  jest.clearAllMocks();
  // globalThis.sessionStorage = {
  //   getItem: jest.fn().mockReturnValue(null),
  //   setItem: jest.fn(),
  // };
});

afterAll(async () => {
  await sequelize.close(); // Properly close database connection
});

test("NewSessionToken creates a token if none exists", () => {
  sessionStorage.getItem.mockReturnValue(null);

  const userId = "user123";
  const token = NewSessionToken(userId);

  expect(sessionStorage.getItem).toHaveBeenCalledWith("sessionToken");
  expect(sessionStorage.setItem).toHaveBeenCalledWith(
    "sessionToken",
    expect.any(String)
  );
  expect(token).toBeDefined();
});
