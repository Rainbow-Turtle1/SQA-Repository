import 'jest-localstorage-mock';
import { NewSessionToken } from '../routes/sessionTokens.js';

beforeEach(() => {
  globalThis.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };
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
