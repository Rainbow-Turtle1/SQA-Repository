import "jest-localstorage-mock";
import { describe, it, jest } from "@jest/globals";
import {
  NewSessionToken,
  tokenIsValid,
  FetchSessionId,
} from "../routes/session-tokens.js";
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

jest.mock("../routes/session-tokens.js", () => ({
  ...jest.requireActual("../routes/session-tokens.js"),
  tokenIsValid: jest.fn(),
}));

function getCurrentTestDate() {
  let date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}${month}${day}`;
}

describe("Session Token Tests", () => {
  it("should create a token if none exists using NewSessionToken", () => {
    const req = MockReq();
    NewSessionToken(req, "id-for-tests");
    expect(req.session.user).toEqual({
      id: "id-for-tests",
      date: getCurrentTestDate(),
    });
  });

  it("should log an error if req.session is undefined", () => {
    const req = {};
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    NewSessionToken(req, "test-uuid");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Session object is undefined. Possible misconfiguration."
    );

    consoleErrorSpy.mockRestore();
  });

  it("should not create a token if the session is null", () => {
    const req = MockReq();
    req.session = { user: null };
    expect(req.session.user).toBe(null);
  });

  it("should not create a token if no UUID is provided", () => {
    const req = MockReq();
    NewSessionToken(req, null);
    expect(req.session.user).toBe(null);
  }),
    it("should should return true for a valid session token", () => {
      const req = MockReq();
      req.session.user = {
        id: "uuid-123",
        date: getCurrentTestDate(),
      };
      expect(tokenIsValid(req)).toBe(true);
    });

  it("should return false for an expired token and call session.destroy", () => {
    const req = MockReq();
    req.session.user = {
      id: "uuid-123",
      date: "20000101", // Simulated expired token date
    };
    expect(tokenIsValid(req)).toBe(false);
    expect(req.session.destroy).toHaveBeenCalled(); // ✅ Ensures destroy() was called
  });

  it("should return false if no user session exists", () => {
    const req = MockReq();
    expect(tokenIsValid(req)).toBe(false);
  });

  it("should log an error and throw an error if the session token is invalid", () => {
    const req = {
      session: {
        user: {
          id: "test-uuid",
        },
      },
    };

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => FetchSessionId(req)).toThrow(
      "Session token error: user not authenticated."
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Session token error: user not authenticated."
    );

    consoleErrorSpy.mockRestore();
  });

  it("should log an error and throw an error if the session is missing", () => {
    const req = {};

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => FetchSessionId(req)).toThrow(
      "Session token error: user not authenticated."
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Session token error: user not authenticated."
    );

    consoleErrorSpy.mockRestore();
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
